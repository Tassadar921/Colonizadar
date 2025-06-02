export interface BattleResult {
    success: boolean;
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
