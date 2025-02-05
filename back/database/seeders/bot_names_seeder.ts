import { BaseSeeder } from '@adonisjs/lucid/seeders';
import BotName from '#models/bot_name';
import BotNameRepository from '#repositories/bot_name_repository';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const botNameRepository: BotNameRepository = new BotNameRepository();

        const botNames: { french: string; english: string, image: string }[] = [
            { french: 'Alexandre le Grand', english: 'Alexander the Great', image: 'alexandre-the-great.webp' },
            { french: 'Périclès', english: 'Pericles', image: '' },
            { french: 'Léonidas Ier', english: 'Leonidas I', image: '' },
            { french: 'Jules César', english: 'Julius Caesar', image: 'julius-caesar.webp' },
            { french: 'Auguste', english: 'Augustus', image: 'augustus.webp' },
            { french: 'Charlemagne', english: 'Charlemagne', image: 'charlemagne.webp' },
            { french: 'Gengis Khan', english: 'Genghis Khan', image: 'genghis-khan.webp' },
            { french: 'Saladin', english: 'Saladin', image: '' },
            { french: 'Kubilai Khan', english: 'Kublai Khan', image: 'kublai-khan.webp' },
            { french: 'Tamerlan', english: 'Tamerlane', image: '' },
            { french: 'Louis XIV', english: 'Louis XIV', image: '' },
            { french: 'Napoléon Bonaparte', english: 'Napoleon Bonaparte', image: '' },
            { french: 'Napoléon III', english: 'Napoleon III', image: '' },
            { french: 'George Washington', english: 'George Washington', image: 'george-washington.webp' },
            { french: 'Abraham Lincoln', english: 'Abraham Lincoln', image: '' },
            { french: 'Otto von Bismarck', english: 'Otto von Bismarck', image: 'bismarck.webp' },
            { french: 'Winston Churchill', english: 'Winston Churchill', image: 'churchill.webp' },
            { french: 'Franklin D. Roosevelt', english: 'Franklin D. Roosevelt', image: 'jd-roosevelt.webp' },
            { french: 'Joseph Staline', english: 'Joseph Stalin', image: '' },
            { french: 'Mao Zedong', english: 'Mao Zedong', image: '' },
            { french: 'Charles de Gaulle', english: 'Charles de Gaulle', image: 'de-gaulle.webp' },
            { french: 'Adolf Hitler', english: 'Adolf Hitler', image: 'hitler.webp' },
            { french: 'Simón Bolívar', english: 'Simón Bolívar', image: 'bolivar.webp' },
            { french: 'Hirohito', english: 'Hirohito', image: 'hirohito.webp' },
            { french: 'Shaka Zulu', english: 'Shaka Zulu', image: '' },
            { french: 'Meiji Tennō', english: 'Emperor Meiji', image: '' },
            { french: 'Soliman le Magnifique', english: 'Suleiman the Magnificent', image: '' },
            { french: 'Cyrus le Grand', english: 'Cyrus the Great', image: 'cyrus.webp' },
            { french: 'Ramsès II', english: 'Ramesses II', image: '' },
            { french: 'Ashoka le Grand', english: 'Ashoka the Great', image: '' },
            { french: 'Moctezuma II', english: 'Montezuma II', image: '' },
            { french: 'Marie de Médicis', english: "Marie de' Medici", image: '' },
            { french: 'Mazarin', english: 'Mazarin', image: '' },
            { french: 'Richelieu', english: 'Richelieu', image: '' },
            { french: 'Charles Quint', english: 'Charles V of Habsburg', image: 'charles-5-habsburg.webp' },
            { french: 'Saint Louis', english: 'Saint Louis', image: '' },
            { french: 'Clovis', english: 'Clovis', image: 'clovis.webp' },
            { french: 'Philippe II de Macédoine', english: 'Philip II of Macedon', image: '' },
            { french: 'Trajan', english: 'Trajan', image: '' },
            { french: 'Marc Aurèle', english: 'Marcus Aurelius', image: '' },
            { french: 'Tibère', english: 'Tiberius', image: '' },
            { french: 'Hannibal Barca', english: 'Hannibal Barca', image: 'hannibal.webp' },
            { french: 'Vercingétorix', english: 'Vercingetorix', image: '' },
            { french: 'Brennos', english: 'Brennus', image: 'brennus.webp' },
            { french: 'Claude', english: 'Claudius', image: 'claudius.webp' },
            { french: 'Denys de Syracuse', english: 'Dionysius of Syracuse', image: 'dionysius-syracuse.webp' },
            { french: 'Xerxès', english: 'Xerxes', image: '' },
            { french: 'Gustave Adolphe II', english: 'Gustavus Adolphus II', image: 'gustavus-adolphus-2.webp' },
            { french: 'Frédéric II', english: 'Frederick II', image: 'frederick-2.webp' },
            { french: "Guillaume d'Orange", english: 'William of Orange', image: '' },
            { french: "Anne d'Autriche", english: 'Anne of Austria', image: 'anne-austria.webp' },
            { french: 'Pierre le Grand', english: 'Peter the Great', image: '' },
            { french: 'Ivan le Terrible', english: 'Ivan the Terrible', image: 'ivan-the-terrible.webp' },
            { french: 'Robespierre', english: 'Robespierre', image: '' },
            { french: 'Frédéric-Guillaume II', english: 'Frederick William II', image: 'frederick-william-2.webp' },
            { french: 'Mehmed II', english: 'Mehmed II', image: '' },
            { french: 'Vlad III l\'Empaleur', english: 'Vlad III the Impaler', image: '' },
            { french: 'Attila', english: 'Attila the Hun', image: 'attila.webp' },
        ];

        for (const botName of botNames) {
            if (!(await botNameRepository.findOneBy({ english: botName.english }))) {
                await BotName.create({
                    french: botName.french,
                    english: botName.english,
                });
                console.log(`Bot name ${botName.english} created`);
            }
        }
    }
}
