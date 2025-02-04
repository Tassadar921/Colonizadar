import { BaseSeeder } from '@adonisjs/lucid/seeders';
import BotName from '#models/bot_name';
import BotNameRepository from '#repositories/bot_name_repository';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const botNameRepository: BotNameRepository = new BotNameRepository();

        const botNames: { french: string; english: string }[] = [
            { french: 'Alexandre le Grand', english: 'Alexander the Great' },
            { french: 'Périclès', english: 'Pericles' },
            { french: 'Léonidas Ier', english: 'Leonidas I' },
            { french: 'Jules César', english: 'Julius Caesar' },
            { french: 'Auguste', english: 'Augustus' },
            { french: 'Charlemagne', english: 'Charlemagne' },
            { french: 'Gengis Khan', english: 'Genghis Khan' },
            { french: 'Saladin', english: 'Saladin' },
            { french: 'Kubilai Khan', english: 'Kublai Khan' },
            { french: 'Tamerlan', english: 'Tamerlane' },
            { french: 'Louis XIV', english: 'Louis XIV' },
            { french: 'Napoléon Bonaparte', english: 'Napoleon Bonaparte' },
            { french: 'Napoléon III', english: 'Napoleon III' },
            { french: 'George Washington', english: 'George Washington' },
            { french: 'Abraham Lincoln', english: 'Abraham Lincoln' },
            { french: 'Otto von Bismarck', english: 'Otto von Bismarck' },
            { french: 'Winston Churchill', english: 'Winston Churchill' },
            { french: 'Franklin D. Roosevelt', english: 'Franklin D. Roosevelt' },
            { french: 'Joseph Staline', english: 'Joseph Stalin' },
            { french: 'Mao Zedong', english: 'Mao Zedong' },
            { french: 'Charles de Gaulle', english: 'Charles de Gaulle' },
            { french: 'Adolf Hitler', english: 'Adolf Hitler' },
            { french: 'Simón Bolívar', english: 'Simón Bolívar' },
            { french: 'Hirohito', english: 'Hirohito' },
            { french: 'Shaka Zulu', english: 'Shaka Zulu' },
            { french: 'Meiji Tennō', english: 'Emperor Meiji' },
            { french: 'Soliman le Magnifique', english: 'Suleiman the Magnificent' },
            { french: 'Cyrus le Grand', english: 'Cyrus the Great' },
            { french: 'Ramsès II', english: 'Ramesses II' },
            { french: 'Ashoka le Grand', english: 'Ashoka the Great' },
            { french: 'Moctezuma II', english: 'Montezuma II' },
            { french: 'Marie de Médicis', english: "Marie de' Medici" },
            { french: 'Mazarin', english: 'Mazarin' },
            { french: 'Richelieu', english: 'Richelieu' },
            { french: 'Charles Quint', english: 'Charles V' },
            { french: 'Saint Louis', english: 'Saint Louis' },
            { french: 'Clovis', english: 'Clovis' },
            { french: 'Philippe II de Macédoine', english: 'Philip II of Macedon' },
            { french: 'Trajan', english: 'Trajan' },
            { french: 'Marc Aurèle', english: 'Marcus Aurelius' },
            { french: 'Tibère', english: 'Tiberius' },
            { french: 'Sylla', english: 'Sulla' },
            { french: 'Camille', english: 'Camillus' },
            { french: 'Hannibal Barca', english: 'Hannibal Barca' },
            { french: 'Vercingétorix', english: 'Vercingetorix' },
            { french: 'Boduognatos', english: 'Boduognatus' },
            { french: 'Brennos', english: 'Brennus' },
            { french: 'Claude', english: 'Claudius' },
            { french: 'Denys de Syracuse', english: 'Dionysius of Syracuse' },
            { french: 'Xerxès', english: 'Xerxes' },
            { french: 'Cyrus le Grand', english: 'Cyrus the Great' }, // Duplicate corrected
            { french: 'Gustave Adolphe II', english: 'Gustavus Adolphus II' },
            { french: 'Frédéric II', english: 'Frederick II' },
            { french: "Guillaume d'Orange", english: 'William of Orange' },
            { french: "Anne d'Autriche", english: 'Anne of Austria' },
            { french: 'Pierre le Grand', english: 'Peter the Great' },
            { french: 'Ivan le Terrible', english: 'Ivan the Terrible' },
            { french: 'Charles IX', english: 'Charles IX' },
            { french: 'Robespierre', english: 'Robespierre' },
            { french: 'Frédéric-Guillaume II', english: 'Frederick William II' },
            { french: 'Mehmed VI', english: 'Mehmed VI' },
            { french: 'Vlad III Țepeș', english: 'Vlad III the Impaler' },
            { french: 'Attila', english: 'Attila the Hun' },
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
