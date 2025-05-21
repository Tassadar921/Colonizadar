import Dexie, { type Table } from 'dexie';
import { readable } from 'svelte/store';
import { liveQuery } from 'dexie';
import { showToast } from '../services/toastService';

export interface Move {
    id?: number;
    from: string;
    to: string;
    infantry: number;
    ships: number;
}

export interface Attack {
    id?: number;
    from: string;
    to: string;
    infantry: number;
    ships: number;
}

class FrontDatabase extends Dexie {
    moves!: Table<Move, number>;
    attacks!: Table<Attack, number>;

    constructor() {
        super('colonizadar');
        this.version(1).stores({
            moves: '++id, from, to, infantry, ships',
            attacks: '++id, from, to, infantry, ships',
        });
    }
}

const db = new FrontDatabase();

export const moves = readable<Move[]>([], (set) => {
    const subscription = liveQuery(() => db.moves.toArray()).subscribe({
        next: set,
        error: (error: any): void => showToast(error.message, 'error'),
    });

    return (): void => subscription.unsubscribe();
});

export const attacks = readable<Move[]>([], (set) => {
    const subscription = liveQuery(() => db.attacks.toArray()).subscribe({
        next: set,
        error: (error: any): void => showToast(error.message, 'error'),
    });

    return (): void => subscription.unsubscribe();
});

export async function addMove(move: Move): Promise<number> {
    return db.moves.add(move);
}

export async function removeMove(id: number): Promise<void> {
    await db.moves.delete(id);
}

export async function clearMoves(): Promise<void> {
    await db.moves.clear();
}

export async function addAttack(attack: Attack): Promise<number> {
    return db.attacks.add(attack);
}

export async function removeAttack(id: number): Promise<void> {
    await db.attacks.delete(id);
}

export async function clearAttacks(): Promise<void> {
    await db.attacks.clear();
}
