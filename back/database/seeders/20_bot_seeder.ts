import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Bot from '#models/bot';
import BotRepository from '#repositories/bot_repository';
import File from '#models/file';
import app from '@adonisjs/core/services/app';
import FileService from '#services/file_service';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const botRepository: BotRepository = new BotRepository();
        const fileService: FileService = new FileService();

        const bots: { french: string; english: string; image: string }[] = [
            { french: 'Alexandre le Grand', english: 'Alexander the Great', image: 'alexandre-the-great.webp' },
            { french: 'Périclès', english: 'Pericles', image: 'pericles.webp' },
            { french: 'Léonidas Ier', english: 'Leonidas I', image: 'leonidas-1.webp' },
            { french: 'Jules César', english: 'Julius Caesar', image: 'julius-caesar.webp' },
            { french: 'Auguste', english: 'Augustus', image: 'augustus.webp' },
            { french: 'Charlemagne', english: 'Charlemagne', image: 'charlemagne.webp' },
            { french: 'Gengis Khan', english: 'Genghis Khan', image: 'genghis-khan.webp' },
            { french: 'Saladin', english: 'Saladin', image: 'saladin.webp' },
            { french: 'Kubilai Khan', english: 'Kublai Khan', image: 'kublai-khan.webp' },
            { french: 'Tamerlan', english: 'Tamerlane', image: 'tamerlane.webp' },
            { french: 'Louis XIV', english: 'Louis XIV', image: 'louis-14.webp' },
            { french: 'Napoléon Bonaparte', english: 'Napoleon Bonaparte', image: 'napoleon-1.webp' },
            { french: 'Napoléon III', english: 'Napoleon III', image: 'napoleon-3.webp' },
            { french: 'George Washington', english: 'George Washington', image: 'george-washington.webp' },
            { french: 'Abraham Lincoln', english: 'Abraham Lincoln', image: 'lincoln.webp' },
            { french: 'Otto von Bismarck', english: 'Otto von Bismarck', image: 'bismarck.webp' },
            { french: 'Winston Churchill', english: 'Winston Churchill', image: 'churchill.webp' },
            { french: 'Franklin D. Roosevelt', english: 'Franklin D. Roosevelt', image: 'jd-roosevelt.webp' },
            { french: 'Joseph Staline', english: 'Joseph Stalin', image: 'stalin.webp' },
            { french: 'Mao Zedong', english: 'Mao Zedong', image: 'mao-zedong.webp' },
            { french: 'Charles de Gaulle', english: 'Charles de Gaulle', image: 'de-gaulle.webp' },
            { french: 'Adolf Hitler', english: 'Adolf Hitler', image: 'hitler.webp' },
            { french: 'Simón Bolívar', english: 'Simón Bolívar', image: 'bolivar.webp' },
            { french: 'Hirohito', english: 'Hirohito', image: 'hirohito.webp' },
            { french: 'Shaka Zulu', english: 'Shaka Zulu', image: 'zulu.webp' },
            { french: 'Meiji Tennō', english: 'Emperor Meiji', image: 'meiji.webp' },
            { french: 'Soliman le Magnifique', english: 'Suleiman the Magnificent', image: 'suleiman.webp' },
            { french: 'Cyrus le Grand', english: 'Cyrus the Great', image: 'cyrus.webp' },
            { french: 'Ramsès II', english: 'Ramesses II', image: 'ramesses-2.webp' },
            { french: 'Ashoka le Grand', english: 'Ashoka the Great', image: 'ashoka-the-great.webp' },
            { french: 'Moctezuma II', english: 'Montezuma II', image: 'montezuma-2.webp' },
            { french: 'Marie de Médicis', english: "Marie de' Medici", image: 'marie-medicis.webp' },
            { french: 'Mazarin', english: 'Mazarin', image: 'mazarin.webp' },
            { french: 'Richelieu', english: 'Richelieu', image: 'richelieu.webp' },
            { french: 'Charles Quint', english: 'Charles V of Habsburg', image: 'charles-5-habsburg.webp' },
            { french: 'Saint Louis', english: 'Saint Louis', image: 'louis-9.webp' },
            { french: 'Clovis', english: 'Clovis', image: 'clovis.webp' },
            { french: 'Philippe II de Macédoine', english: 'Philip II of Macedon', image: 'philip-2-macedon.webp' },
            { french: 'Trajan', english: 'Trajan', image: 'trajan.webp' },
            { french: 'Marc Aurèle', english: 'Marcus Aurelius', image: 'marc-aurelius.webp' },
            { french: 'Tibère', english: 'Tiberius', image: 'tiberius.webp' },
            { french: 'Hannibal Barca', english: 'Hannibal Barca', image: 'hannibal.webp' },
            { french: 'Vercingétorix', english: 'Vercingetorix', image: 'vercingetorix.webp' },
            { french: 'Brennos', english: 'Brennus', image: 'brennus.webp' },
            { french: 'Claude', english: 'Claudius', image: 'claudius.webp' },
            { french: 'Denys de Syracuse', english: 'Dionysius of Syracuse', image: 'dionysius-syracuse.webp' },
            { french: 'Xerxès', english: 'Xerxes', image: 'xerxes.webp' },
            { french: 'Gustave Adolphe II', english: 'Gustavus Adolphus II', image: 'gustavus-adolphus-2.webp' },
            { french: 'Frédéric II', english: 'Frederick II', image: 'frederick-2.webp' },
            { french: "Guillaume d'Orange", english: 'William of Orange', image: 'william-of-orange.webp' },
            { french: "Anne d'Autriche", english: 'Anne of Austria', image: 'anne-austria.webp' },
            { french: 'Pierre le Grand', english: 'Peter the Great', image: 'peter-the-great.webp' },
            { french: 'Ivan le Terrible', english: 'Ivan the Terrible', image: 'ivan-the-terrible.webp' },
            { french: 'Robespierre', english: 'Robespierre', image: 'robespierre.webp' },
            { french: 'Frédéric-Guillaume II', english: 'Frederick William II', image: 'frederick-william-2.webp' },
            { french: 'Mehmed II', english: 'Mehmed II', image: 'mehmet-2.webp' },
            { french: "Vlad III l'Empaleur", english: 'Vlad III the Impaler', image: 'vlad-3.webp' },
            { french: 'Attila', english: 'Attila the Hun', image: 'attila.webp' },
        ];

        for (const bot of bots) {
            if (!(await botRepository.findOneBy({ englishName: bot.english }))) {
                const { size, mimeType, extension, name } = await fileService.getFileInfo(app.makePath(`static/bot-picture/${bot.image}`));
                const file: File | null = await File.create({
                    name,
                    path: `static/bot-picture/${bot.image}`,
                    extension,
                    mimeType,
                    size,
                });
                await file.refresh();

                await Bot.create({
                    frenchName: bot.french,
                    englishName: bot.english,
                    pictureId: file.id,
                });
            }
        }
    }
}
