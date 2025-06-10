import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Bot from '#models/bot';
import BotRepository from '#repositories/bot_repository';
import File from '#models/file';
import app from '@adonisjs/core/services/app';
import FileService from '#services/file_service';
import FileTypeEnum from '#types/enum/file_type_enum';
import { Translation } from '@stouder-io/adonis-translatable';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const botRepository: BotRepository = new BotRepository();
        const fileService: FileService = new FileService();

        const bots: { code: string; french: string; english: string; image: string }[] = [
            { code: 'HIS-000', french: 'Alexandre le Grand', english: 'Alexander the Great', image: 'alexandre-the-great.webp' },
            { code: 'HIS-001', french: 'Périclès', english: 'Pericles', image: 'pericles.webp' },
            { code: 'HIS-002', french: 'Léonidas Ier', english: 'Leonidas I', image: 'leonidas-1.webp' },
            { code: 'HIS-003', french: 'Jules César', english: 'Julius Caesar', image: 'julius-caesar.webp' },
            { code: 'HIS-004', french: 'Auguste', english: 'Augustus', image: 'augustus.webp' },
            { code: 'HIS-005', french: 'Charlemagne', english: 'Charlemagne', image: 'charlemagne.webp' },
            { code: 'HIS-006', french: 'Gengis Khan', english: 'Genghis Khan', image: 'genghis-khan.webp' },
            { code: 'HIS-007', french: 'Saladin', english: 'Saladin', image: 'saladin.webp' },
            { code: 'HIS-008', french: 'Kubilai Khan', english: 'Kublai Khan', image: 'kublai-khan.webp' },
            { code: 'HIS-009', french: 'Tamerlan', english: 'Tamerlane', image: 'tamerlane.webp' },
            { code: 'HIS-010', french: 'Louis XIV', english: 'Louis XIV', image: 'louis-14.webp' },
            { code: 'HIS-011', french: 'Napoléon Bonaparte', english: 'Napoleon Bonaparte', image: 'napoleon-1.webp' },
            { code: 'HIS-012', french: 'Napoléon III', english: 'Napoleon III', image: 'napoleon-3.webp' },
            { code: 'HIS-013', french: 'George Washington', english: 'George Washington', image: 'george-washington.webp' },
            { code: 'HIS-014', french: 'Abraham Lincoln', english: 'Abraham Lincoln', image: 'lincoln.webp' },
            { code: 'HIS-015', french: 'Otto von Bismarck', english: 'Otto von Bismarck', image: 'bismarck.webp' },
            { code: 'HIS-016', french: 'Winston Churchill', english: 'Winston Churchill', image: 'churchill.webp' },
            { code: 'HIS-017', french: 'Franklin D. Roosevelt', english: 'Franklin D. Roosevelt', image: 'jd-roosevelt.webp' },
            { code: 'HIS-018', french: 'Joseph Staline', english: 'Joseph Stalin', image: 'stalin.webp' },
            { code: 'HIS-019', french: 'Mao Zedong', english: 'Mao Zedong', image: 'mao-zedong.webp' },
            { code: 'HIS-020', french: 'Charles de Gaulle', english: 'Charles de Gaulle', image: 'de-gaulle.webp' },
            { code: 'HIS-021', french: 'Adolf Hitler', english: 'Adolf Hitler', image: 'hitler.webp' },
            { code: 'HIS-022', french: 'Simón Bolívar', english: 'Simón Bolívar', image: 'bolivar.webp' },
            { code: 'HIS-023', french: 'Hirohito', english: 'Hirohito', image: 'hirohito.webp' },
            { code: 'HIS-024', french: 'Shaka Zulu', english: 'Shaka Zulu', image: 'zulu.webp' },
            { code: 'HIS-025', french: 'Meiji Tennō', english: 'Emperor Meiji', image: 'meiji.webp' },
            { code: 'HIS-026', french: 'Soliman le Magnifique', english: 'Suleiman the Magnificent', image: 'suleiman.webp' },
            { code: 'HIS-027', french: 'Cyrus le Grand', english: 'Cyrus the Great', image: 'cyrus.webp' },
            { code: 'HIS-028', french: 'Ramsès II', english: 'Ramesses II', image: 'ramesses-2.webp' },
            { code: 'HIS-029', french: 'Ashoka le Grand', english: 'Ashoka the Great', image: 'ashoka-the-great.webp' },
            { code: 'HIS-030', french: 'Moctezuma II', english: 'Montezuma II', image: 'montezuma-2.webp' },
            { code: 'HIS-031', french: 'Marie de Médicis', english: "Marie de' Medici", image: 'marie-medicis.webp' },
            { code: 'HIS-032', french: 'Mazarin', english: 'Mazarin', image: 'mazarin.webp' },
            { code: 'HIS-033', french: 'Richelieu', english: 'Richelieu', image: 'richelieu.webp' },
            { code: 'HIS-034', french: 'Charles Quint', english: 'Charles V of Habsburg', image: 'charles-5-habsburg.webp' },
            { code: 'HIS-035', french: 'Saint Louis', english: 'Saint Louis', image: 'louis-9.webp' },
            { code: 'HIS-036', french: 'Clovis', english: 'Clovis', image: 'clovis.webp' },
            { code: 'HIS-037', french: 'Philippe II de Macédoine', english: 'Philip II of Macedon', image: 'philip-2-macedon.webp' },
            { code: 'HIS-038', french: 'Trajan', english: 'Trajan', image: 'trajan.webp' },
            { code: 'HIS-039', french: 'Marc Aurèle', english: 'Marcus Aurelius', image: 'marc-aurelius.webp' },
            { code: 'HIS-040', french: 'Tibère', english: 'Tiberius', image: 'tiberius.webp' },
            { code: 'HIS-041', french: 'Hannibal Barca', english: 'Hannibal Barca', image: 'hannibal.webp' },
            { code: 'HIS-042', french: 'Vercingétorix', english: 'Vercingetorix', image: 'vercingetorix.webp' },
            { code: 'HIS-043', french: 'Brennos', english: 'Brennus', image: 'brennus.webp' },
            { code: 'HIS-044', french: 'Claude', english: 'Claudius', image: 'claudius.webp' },
            { code: 'HIS-045', french: 'Denys de Syracuse', english: 'Dionysius of Syracuse', image: 'dionysius-syracuse.webp' },
            { code: 'HIS-046', french: 'Xerxès', english: 'Xerxes', image: 'xerxes.webp' },
            { code: 'HIS-047', french: 'Gustave Adolphe II', english: 'Gustavus Adolphus II', image: 'gustavus-adolphus-2.webp' },
            { code: 'HIS-048', french: 'Frédéric II', english: 'Frederick II', image: 'frederick-2.webp' },
            { code: 'HIS-049', french: "Guillaume d'Orange", english: 'William of Orange', image: 'william-of-orange.webp' },
            { code: 'HIS-050', french: "Anne d'Autriche", english: 'Anne of Austria', image: 'anne-austria.webp' },
            { code: 'HIS-051', french: 'Pierre le Grand', english: 'Peter the Great', image: 'peter-the-great.webp' },
            { code: 'HIS-052', french: 'Ivan le Terrible', english: 'Ivan the Terrible', image: 'ivan-the-terrible.webp' },
            { code: 'HIS-053', french: 'Robespierre', english: 'Robespierre', image: 'robespierre.webp' },
            { code: 'HIS-054', french: 'Frédéric-Guillaume II', english: 'Frederick William II', image: 'frederick-william-2.webp' },
            { code: 'HIS-055', french: 'Mehmed II', english: 'Mehmed II', image: 'mehmet-2.webp' },
            { code: 'HIS-056', french: "Vlad III l'Empaleur", english: 'Vlad III the Impaler', image: 'vlad-3.webp' },
            { code: 'HIS-057', french: 'Attila', english: 'Attila the Hun', image: 'attila.webp' },
        ];

        for (const bot of bots) {
            if (!(await botRepository.findOneBy({ code: bot.code }))) {
                const { size, mimeType, extension, name } = await fileService.getFileInfo(app.makePath(`static/bot-picture/${bot.image}`));
                const file: File = await File.create({
                    name,
                    path: `static/bot-picture/${bot.image}`,
                    extension,
                    mimeType,
                    size,
                    type: FileTypeEnum.BOT_PICTURE,
                });
                await file.refresh();

                await Bot.create({
                    code: bot.code,
                    name: Translation.from({
                        fr: bot.french,
                        en: bot.english,
                    }),
                    pictureId: file.id,
                });
            }
        }
    }
}
