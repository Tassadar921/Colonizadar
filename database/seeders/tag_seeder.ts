import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TagRepository from '#repositories/tag_repository'
import Tag from '#models/tag'

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const tagRepository: TagRepository = new TagRepository()
        const tags: { name: string; red: number; green: number; blue: number }[] = [
            { name: 'Singe', red: 125, green: 85, blue: 12 },
            { name: 'Paul', red: 210, green: 50, blue: 75 },
            { name: 'Gabriel', red: 60, green: 130, blue: 190 },
            { name: 'Gringalet', red: 34, green: 45, blue: 78 },
            { name: 'Cuck', red: 87, green: 23, blue: 45 },
            { name: 'Léo', red: 56, green: 200, blue: 89 },
            { name: 'Martin', red: 155, green: 20, blue: 220 },
            { name: 'Adrien', red: 12, green: 120, blue: 56 },
            { name: 'Hugo', red: 180, green: 85, blue: 36 },
            { name: 'César', red: 90, green: 120, blue: 150 },
            { name: 'Siméon', red: 30, green: 45, blue: 60 },
            { name: 'Florent', red: 255, green: 100, blue: 50 },
            { name: 'Evan', red: 100, green: 150, blue: 200 },
            { name: 'Vacances', red: 220, green: 180, blue: 120 },
            { name: 'Collège', red: 75, green: 45, blue: 120 },
            { name: 'Lycée', red: 125, green: 100, blue: 255 },
            { name: '2012', red: 100, green: 50, blue: 150 },
            { name: '2013', red: 200, green: 75, blue: 85 },
            { name: '2014', red: 30, green: 200, blue: 100 },
            { name: '2015', red: 180, green: 45, blue: 30 },
            { name: '2016', red: 45, green: 90, blue: 200 },
            { name: '2017', red: 255, green: 120, blue: 80 },
            { name: '2018', red: 70, green: 130, blue: 255 },
            { name: '2019', red: 60, green: 200, blue: 150 },
            { name: '2020', red: 120, green: 60, blue: 180 },
            { name: '2021', red: 90, green: 45, blue: 210 },
            { name: '2022', red: 75, green: 180, blue: 130 },
            { name: '2023', red: 200, green: 90, blue: 40 },
            { name: '2024', red: 50, green: 220, blue: 100 },
            { name: '2025', red: 240, green: 180, blue: 90 },
        ]

        for (const tag of tags) {
            if (!(await tagRepository.findOneBy({ name: tag.name }))) {
                await Tag.create({
                    name: tag.name,
                    red: tag.red,
                    green: tag.green,
                    blue: tag.blue,
                })
                console.log(`Tag ${tag.name} created`)
            }
        }
    }
}
