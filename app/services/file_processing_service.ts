import fs from 'node:fs';
import CardPrint from '#models/card_print';
import CardPrintRepository from '#repositories/card_print_repository';
import { inject } from '@adonisjs/core';

@inject()
export default class FileProcessingService {
    public async readFile(path: string): Promise<string> {
        return fs.readFileSync(path, 'utf-8');
    }

    public async getPrintsFromBuffer(path: string): Promise<CardPrint[]> {
        const cardPrintRepository: CardPrintRepository = new CardPrintRepository();

        const text: string = await this.readFile(path);
        const splitText: string[] = text.split('\n').filter(Boolean);
        const cards: CardPrint[] = [];
        for (let line of splitText) {
            line = line.split(' (')[0];
            const [quantity, ...name] = line.split(' ');
            try {
                const cardPrint: CardPrint | null = await cardPrintRepository.findOneByEnglishName(name.join(' ').trim());
                if (!cardPrint) {
                    console.error(`Card not found: ${name.join(' ')}`);
                    continue;
                }

                for (let i: number = 0; i < Number.parseInt(quantity); i++) {
                    cards.push(cardPrint);
                }
            } catch (e) {
                console.error(e);
            }
        }
        return cards;
    }
}
