import Dexie, { type Table } from 'dexie';
import { readable } from 'svelte/store';
import { liveQuery } from 'dexie';
import { showToast } from '../services/toastService';
import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
import { type Move } from 'colonizadar-backend/app/types/Move';

class FrontDatabase extends Dexie {
    moves!: Table<Move, number>;

    constructor() {
        super('colonizadar');
        this.version(1).stores({
            moves: '++id, from, to, infantry, ships, isAttack',
        });
    }
}

const db = new FrontDatabase();

export async function updateGameOnLoad(game: SerializedGame): Promise<void> {
    const moves: Move[] = await db.moves.toArray();

    for (const move of moves) {
        const from: SerializedGameTerritory | undefined = game.territories.find((t: SerializedGameTerritory): boolean => t.id === move.from);
        if (from) {
            from.infantry = (from.infantry ?? 0) - move.infantry;
            from.ships = (from.ships ?? 0) - move.ships;
        }
    }
}

export const moves = readable<Move[]>([], (set) => {
    const subscription = liveQuery(() => db.moves.toArray()).subscribe({
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

export async function getSelectedTerritoryMoves(gameTerritory: SerializedGameTerritory): Promise<Move[]> {
    return db.moves.where('from').equals(gameTerritory.id).or('to').equals(gameTerritory.id).toArray();
}

export async function getAllMoves(): Promise<Move[]> {
    return db.moves.toArray();
}

export async function clearMoves(): Promise<void> {
    await db.moves.clear();
}
