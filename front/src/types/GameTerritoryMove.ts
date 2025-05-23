import type { Move as FetchedMove } from '../stores/dbStore';

export interface GameTerritoryMove extends FetchedMove {
    fromName: string;
    toName: string;
    isTarget: boolean;
}
