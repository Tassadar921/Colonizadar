import Dexie, { type Table } from 'dexie';

export interface Move {
    id?: number;
    from: string;
    to: string;
    infantry: number;
    ships: number;
}

export class MyDatabase extends Dexie {
    moves!: Table<Move, number>;

    constructor() {
        super('colonizadar');
        this.version(1).stores({
            moves: '++id, from, to, infantry, ships',
        });
    }
}

export const db = new MyDatabase();
