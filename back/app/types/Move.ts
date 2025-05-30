export interface Move {
    id?: number;
    from: number;
    to: number;
    infantry: number;
    ships: number;
    isAttack: boolean;
}
