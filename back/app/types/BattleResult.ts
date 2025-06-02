export interface BattleResult {
    attackSuccess: boolean;
    isLanding: boolean;
    attackerLosses: {
        infantry: number;
        ships: number;
    };
    defenderLosses: {
        infantry: number;
        ships: number;
    };
    defenderShipsToMove: number;
}
