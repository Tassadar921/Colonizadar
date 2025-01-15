import { inject } from '@adonisjs/core';
import Deck from '#models/deck';
import CardLegalityEnum from '#types/enum/card_legality_enum';
import CardLegality from '#models/card_legality';
import DeckFormatEnum from '#types/enum/deck_format_enum';

@inject()
export default class DeckLegalityService {
    public isCommanderLegal(deck: Deck): boolean {
        const [cardQuantity, allLegal] = this.getCardsInfos(deck, DeckFormatEnum.COMMANDER);
        return !(cardQuantity !== 100 || !allLegal);
    }

    public isStandardLegal(deck: Deck): boolean {
        const [cardQuantity, allLegal] = this.getCardsInfos(deck, DeckFormatEnum.STANDARD);
        return !(cardQuantity < 60 || !allLegal);
    }

    public isModernLegal(deck: Deck): boolean {
        const [cardQuantity, allLegal] = this.getCardsInfos(deck, DeckFormatEnum.MODERN);
        return !(cardQuantity < 60 || !allLegal);
    }

    public isLegacyLegal(deck: Deck): boolean {
        const [cardQuantity, allLegal] = this.getCardsInfos(deck, DeckFormatEnum.LEGACY);
        return !(cardQuantity < 60 || !allLegal);
    }

    public isVintageLegal(deck: Deck): boolean {
        const [cardQuantity, allLegal] = this.getCardsInfos(deck, DeckFormatEnum.VINTAGE);
        return !(cardQuantity < 60 || !allLegal);
    }

    public isPauperLegal(deck: Deck): boolean {
        const [cardQuantity, allLegal] = this.getCardsInfos(deck, DeckFormatEnum.PAUPER);
        return !(cardQuantity < 60 || !allLegal);
    }

    public isPioneerLegal(deck: Deck): boolean {
        const [cardQuantity, allLegal] = this.getCardsInfos(deck, DeckFormatEnum.PIONEER);
        return !(cardQuantity < 60 || !allLegal);
    }

    private getCardsInfos(deck: Deck, format: keyof CardLegality): [cardQuantity: number, allLegal: boolean] {
        let cardQuantity: number = 0;
        let allLegal: boolean = true;
        for (const deckCategories of deck.deckCategories) {
            for (const deckCard of deckCategories.deckCards) {
                cardQuantity += deckCard.quantity;
                if (deckCard.cardPrint.card.legality[format] !== CardLegalityEnum.LEGAL) {
                    allLegal = false;
                }
            }
        }
        return [cardQuantity, allLegal];
    }
}
