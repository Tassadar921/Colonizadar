import OpenAiRequestHeader from '#types/openAi/open_ai_request_header';
import OpenAiRequestContent from '#types/openAi/open_ai_request_content';
import env from '#start/env';
import CardPrint from '#models/card_print';
import CardPrintRepository from '#repositories/card_print_repository';
import OpenAiStat from '#models/open_ai_stat';
import { inject } from '@adonisjs/core';

@inject()
export default class OpenAiApiService {
    constructor(private readonly cardPrintRepository: CardPrintRepository) {}

    private headers: OpenAiRequestHeader = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.get('OPENAI_API_KEY')}`,
    };

    private content: OpenAiRequestContent = {
        model: env.get('OPENAI_API_MODEL'),
        messages: [
            {
                role: 'system',
                content: [
                    {
                        type: 'text',
                        text: `
                            Given a list of Magic: The Gathering cards, please provide a structured JSON object formatted as follows:
                            The JSON object should have a key 'cards' that maps to an array of objects. Each object in the 'cards' array should represent a distinct card. If the same card is recognized in multiple editions, or if one edition is recognized but others are not, the card should appear separately for each edition, with identical 'images' arrays but distinct 'set' properties. The properties for each card object should be as follows:
                            - 'name': A string containing the name of the card.
                            - 'images': An array of integers where each integer represents an image index where the card appears. If the card appears in multiple images, include all indices in this array.
                            - 'set': A string representing the name of the edition the card belongs to. If no edition is recognized, this field should be an empty string.
                            The output should be a valid JSON object with no extraneous characters or formatting issues.
                            Here is an example of the expected format:
                            {
                              "cards": [
                                { "name": "Faceless Haven", "images": [1, 2], "set": "Kaldheim" },
                                { "name": "Lightning Bolt", "images": [3], "set": "" },
                                { "name": "Lightning Bolt", "images": [3], "set": "Alpha" }
                              ]
                            }
                            Please ensure that the response is correctly formatted JSON with no additional text or special characters outside the JSON structure.`,
                    },
                ],
            },
            {
                role: 'user',
                content: [],
            },
        ],
        max_tokens: 4096,
    };

    public async getCardData(base64Strings: string[]): Promise<
        {
            cardPrint: CardPrint;
            images: number[];
        }[]
    > {
        if (!base64Strings || base64Strings.length === 0) {
            throw new Error('400: Invalid request - base64Strings array is empty or not provided.');
        }
        this.content.messages[1].content = [];
        for (const base64String of base64Strings) {
            if (!base64String.startsWith('data:image/')) {
                throw new Error('400: Invalid request - One or more provided base64 strings are not valid image types.');
            }
            this.content.messages[1].content.push({
                type: 'image_url',
                image_url: {
                    url: base64String,
                    detail: 'high',
                },
            });
        }
        const start: number = new Date().getTime();
        try {
            const response: Response = await fetch(env.get('OPENAI_API_URL'), {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(this.content),
            });
            const foundCards: { cardPrint: CardPrint; images: number[] }[] = [];
            const end: number = new Date().getTime();

            if (!response.ok) {
                response.json().then((data: any): void => {
                    console.error(data.error);
                });
                return [];
            }
            let data: { choices: { message: { content: string } }[] };
            try {
                data = (await response.json()) as {
                    choices: { message: { content: string } }[];
                };
            } catch (error) {
                return [];
            }
            let toParse: string = data.choices[0].message.content;
            while (toParse.includes('`') || toParse.includes('json')) {
                toParse = toParse.replace('`', '');
                toParse = toParse.replace('json', '');
            }
            const { cards: parsedData }: { cards: { name: string; set: string; images: number[] }[] } = JSON.parse(toParse);
            await OpenAiStat.create({
                time: end - start,
                cards: base64Strings.length,
            });

            for (const cardResponse of parsedData) {
                let cardPrint: CardPrint | null = null;
                if (cardResponse.set) {
                    cardPrint = await this.cardPrintRepository.findOneByEnglishNameAndSetName(cardResponse.name, cardResponse.set);
                    if (!cardPrint) {
                        cardPrint = await this.cardPrintRepository.findOneByEnglishNameWithPreloads(cardResponse.name);
                    }
                } else {
                    cardPrint = await this.cardPrintRepository.findOneByEnglishNameWithPreloads(cardResponse.name);
                }

                if (cardPrint) {
                    foundCards.push({ cardPrint, images: cardResponse.images });
                }
            }

            return foundCards;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}
