import Territory from '#models/territory';
import { BattleResult } from '#types/BattleResult';
import GameTerritory from '#models/game_territory';
import Game from '#models/game';
import RoomPlayer from '#models/room_player';

export default class TerritoryService {
    /**
     * Calculates a random "value" for a territory based on its characteristics.
     * @param territory The territory to evaluate.
     * @returns A numeric value representing the strategic value of the territory.
     */
    public rollTerritoryValue(territory: Territory): number {
        const coastalBoost: number = territory.isCoastal ? 10 : 0;
        const neighbourBoost: number = Math.floor(territory.neighbours.length / 2);

        const min: number = coastalBoost + 10;
        const max: number = neighbourBoost + 30;

        return Math.ceil(Math.random() * (max - min) + min) * 100000;
    }

    /**
     * Calculates the "power" of a territory based on its value and characteristics.
     * @param territory The territory to evaluate.
     * @param value The numeric value of the territory.
     * @returns The calculated power clamped between 1,000 and 350,000, rounded to nearest 1,000.
     */
    public rollTerritoryPower(territory: Territory, value: number): number {
        const isCoastalBoost: number = territory.isCoastal ? 30000 : 0;
        const neighbourCount: number = territory.neighbours.length;

        const base: number = value / 40000;
        const neighbourBoost: number = Math.pow(neighbourCount, 1.2) * 1500;
        const chaos: number = (Math.random() - 0.5) * 200000;

        let rawPower: number = base * 1000 + neighbourBoost + isCoastalBoost + chaos;

        const clamped: number = Math.max(1000, Math.min(350000, rawPower));
        return Math.round(clamped / 1000) * 1000;
    }

    /**
     * Resolves a full battle between attacker and defender territories.
     * @param attackerPlayer The player initiating the attack.
     * @param attackerInfantry Number of attacking infantry units.
     * @param attackerShips Number of attacking ships.
     * @param targetTerritory The target territory being attacked.
     * @param game The game instance (used to access wild modifiers if no defender).
     * @returns The result of the battle, including success, losses, and ships to move.
     */
    public resolveBattle(attackerPlayer: RoomPlayer, attackerInfantry: number, attackerShips: number, targetTerritory: GameTerritory, game: Game): BattleResult {
        const attackerModifiers = {
            infantryAttackFactor: attackerPlayer.country.infantryAttackFactor,
            shipAttackFactor: attackerPlayer.country.shipAttackFactor,
            landingAttackFactor: attackerPlayer.country.landingAttackFactor,
        };

        let defenderModifiers;

        if (targetTerritory.owner) {
            defenderModifiers = {
                infantryDefenseFactor: targetTerritory.owner.country.infantryDefenseFactor,
                shipDefenseFactor: targetTerritory.owner.country.shipDefenseFactor,
                landingDefenseFactor: targetTerritory.owner.country.landingDefenseFactor,
            };
        } else {
            defenderModifiers = {
                infantryDefenseFactor: game.map.wildInfantryDefenseFactor,
                shipDefenseFactor: game.map.wildShipsDefenseFactor,
                landingDefenseFactor: game.map.wildLandingDefenseFactor,
            };
        }

        return this.resolveBattleWithModifiers(attackerInfantry, attackerShips, targetTerritory, attackerModifiers, defenderModifiers);
    }

    /**
     * Resolves the full battle between attacker and defender.
     * Defender units come from the GameTerritory instance.
     * Handles naval (if landing) and land combat, applying modifiers.
     * @param attackerInfantry Number of infantry units attacking.
     * @param attackerShips Number of ships attacking.
     * @param targetTerritory Defender's territory (with infantry and ships data).
     * @param attackerModifiers Modifiers applied to attacker forces (infantry, ships, landing).
     * @param defenderModifiers Modifiers applied to defender forces (infantry, ships, landing).
     * @returns The result of the battle including success, losses, and ships to move.
     */
    public resolveBattleWithModifiers(
        attackerInfantry: number,
        attackerShips: number,
        targetTerritory: GameTerritory,
        attackerModifiers: {
            infantryAttackFactor: number;
            shipAttackFactor: number;
            landingAttackFactor: number;
        },
        defenderModifiers: {
            infantryDefenseFactor: number;
            shipDefenseFactor: number;
            landingDefenseFactor: number;
        }
    ): BattleResult {
        const defenderInfantry = targetTerritory.infantry;
        const defenderShips = targetTerritory.ships;

        const isLanding: boolean = attackerInfantry <= attackerShips * 1000;

        let effectiveAttackerInfantry: number = attackerInfantry;
        let attackerNavalLosses: number = 0;
        let defenderNavalLosses: number = 0;

        if (isLanding && defenderShips > 0) {
            const { attackerLosses, defenderLosses } = this.resolveNavalBattle(attackerShips, defenderShips, attackerModifiers.shipAttackFactor, defenderModifiers.shipDefenseFactor);

            attackerNavalLosses = attackerLosses;
            defenderNavalLosses = defenderLosses;

            effectiveAttackerInfantry = Math.max(0, effectiveAttackerInfantry - attackerNavalLosses * 1000);
        }

        const { success, attackerInfantryLosses, defenderInfantryLosses } = this.resolveLandBattle(
            effectiveAttackerInfantry,
            defenderInfantry,
            isLanding ? attackerModifiers.landingAttackFactor : attackerModifiers.infantryAttackFactor,
            isLanding ? defenderModifiers.landingDefenseFactor : defenderModifiers.infantryDefenseFactor
        );

        return {
            success,
            isLanding,
            attackerLosses: {
                infantry: attackerInfantry - (success ? attackerInfantryLosses : effectiveAttackerInfantry),
                ships: attackerNavalLosses,
            },
            defenderLosses: {
                infantry: success ? defenderInfantryLosses : 0,
                ships: defenderNavalLosses,
            },
            defenderShipsToMove: defenderNavalLosses,
        };
    }

    /**
     * Resolves the naval battle portion between attacker and defender ships.
     * Calculates proportional losses based on relative power.
     * @param attackerShips Number of attacking ships.
     * @param defenderShips Number of defending ships.
     * @param attackerFactor Attack modifier for attacker ships.
     * @param defenderFactor Defense modifier for defender ships.
     * @returns Losses for both attacker and defender ships.
     */
    private resolveNavalBattle(
        attackerShips: number,
        defenderShips: number,
        attackerFactor: number,
        defenderFactor: number
    ): {
        attackerLosses: number;
        defenderLosses: number;
    } {
        const attackerPower: number = attackerShips * attackerFactor;
        const defenderPower: number = defenderShips * defenderFactor;

        const totalPower: number = attackerPower + defenderPower;

        const attackerRatio: number = attackerPower / totalPower;
        const defenderRatio: number = defenderPower / totalPower;

        const attackerLosses: number = Math.round(defenderRatio * attackerShips);
        const defenderLosses: number = Math.round(attackerRatio * defenderShips);

        return {
            attackerLosses: Math.min(attackerLosses, attackerShips),
            defenderLosses: Math.min(defenderLosses, defenderShips),
        };
    }

    /**
     * Resolves the land battle portion between attacker and defender infantry.
     * Calculates if attack succeeds and infantry losses on both sides.
     * @param attackerInfantry Number of attacking infantry units.
     * @param defenderInfantry Number of defending infantry units.
     * @param attackerFactor Attack modifier for attacking infantry.
     * @param defenderFactor Defense modifier for defending infantry.
     * @returns Battle outcome including success and infantry losses.
     */
    private resolveLandBattle(
        attackerInfantry: number,
        defenderInfantry: number,
        attackerFactor: number,
        defenderFactor: number
    ): {
        success: boolean;
        attackerInfantryLosses: number;
        defenderInfantryLosses: number;
    } {
        const attackerPower: number = attackerInfantry * attackerFactor;
        const defenderPower: number = defenderInfantry * defenderFactor;

        const success: boolean = attackerPower > defenderPower;

        if (success) {
            return {
                success: true,
                attackerInfantryLosses: Math.round(defenderPower / attackerFactor),
                defenderInfantryLosses: defenderInfantry,
            };
        } else {
            const powerRatio: number = attackerPower / defenderPower;
            const lossRatio: number = 0.5 + (1 - powerRatio) * 0.5;
            const losses: number = Math.round(lossRatio * attackerInfantry);

            return {
                success: false,
                attackerInfantryLosses: losses,
                defenderInfantryLosses: 0,
            };
        }
    }
}
