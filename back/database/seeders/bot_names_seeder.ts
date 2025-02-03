import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const botNames: { french: string; english: string }[] = [
            { french: "Alexandre le Grand", english: "Alexandre the Great" },
            { french: "Périclès", english: "Pericles" },
            { french: "Léonidas Ier", english: "Leonidas" },
            { french: "Jules César", english: "Julius Caesar" },
            { french: "Auguste", english: "Augustus" },
            { french: "Charlemagne", english: "Charlemagne" },
            { french: "Gengis Khan", english: "Genghis Khan" },
            { french: "Saladin", english: "Saladin" },
            { french: "Kubilai Khan", english: "Kubilai Khan" },
            { french: "Tamerlan", english: "Tamerlan" },
            { french: "Louis XIV", english: "Louis XIV" },
            { french: "Napoléon Bonaparte", english: "Napoleon Bonaparte" },
            { french: "Napoléon III", english: "Napoleon III" },
            { french: "George Washington", english: "George Washington" },
            { french: "Abraham Lincoln", english: "Abraham Lincoln" },
            { french: "Otto von Bismarck", english: "Otto von Bismarck" },
            { french: "Winston Churchill", english: "Winston Churchill" },
            { french: "Franklin D. Roosevelt", english: "Franklin D. Roosevelt" },
            { french: "Joseph Staline", english: "Joseph Staline" },
            { french: "Mao Zedong", english: "Mao Zedong" },
            { french: "Charles de Gaulle", english: "Charles de Gaulle" },
            { french: "Adolf Hitler", english: "Adolf Hitler" },
            { french: "Simón Bolívar", english: "Simon Bolivar" },
            { french: "Hirohito", english: "Hirohito" },
            { french: "Shaka Zulu", english: "Shaka Zulu" },
            { french: "Meiji Tennō", english: "Meiji Tenno" },
            { french: "Suleiman le Magnifique", english: "Suleiman the Magnificent" },
            { french: "Cyrus le Grand", english: "Cyrus the Grand" },
            { french: "Ramsès II", english: "Ramesses II" },
            { french: "Ashoka le Grand", english: "Ashoka the Great" },
            { french: "Moctezuma II", english: "Moctezuma II" },
        ];

    }
}
