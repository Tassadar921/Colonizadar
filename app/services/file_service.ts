import { inject } from '@adonisjs/core';
import File from '#models/file';
import fs from 'fs';

@inject()
export default class FileService {
    public delete(file: File): void {
        fs.unlink(`public/${file.path}`, (error): void => {
            if (error) {
                console.error(error.message);
            }
        });
    }
}
