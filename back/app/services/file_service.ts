import { inject } from '@adonisjs/core';
import File from '#models/file';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from "path";
import mime from "mime-types";

@inject()
export default class FileService {
    public delete(file: File): void {
        fs.unlink(`public/${file.path}`, (error): void => {
            if (error) {
                console.error(error.message);
            }
        });
    }

    public async getFileInfo(filePath: string): Promise<{ size: number; mimeType: string; extension: string; name: string }> {
        const stats = await fsPromises.stat(filePath);

        const size: number = stats.size;
        const extension: string = path.extname(filePath);
        const name: string = path.basename(filePath);
        const mimeType: string = mime.lookup(filePath) || 'unknown';

        return { size, mimeType, extension, name };
    }
}
