import File from '#models/file';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import mime from 'mime-types';
import axios from 'axios';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { cuid } from '@adonisjs/core/helpers';
import { fileURLToPath } from 'node:url';

export default class FileService {
    public delete(file: File): void {
        fs.unlink(`public/${file.path}`, (error: any): void => {
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

    public async saveOauthProfilePictureFromUrl(url: string): Promise<string> {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer: Buffer<any> = Buffer.from(response.data);

        const fileTypeResult: FileTypeResult | undefined = await fileTypeFromBuffer(buffer);
        if (!fileTypeResult) {
            throw new Error('Impossible de détecter le type de fichier');
        }

        const filename = `${cuid()}-${Date.now()}.${fileTypeResult.ext}`;
        const __filename: string = fileURLToPath(import.meta.url);
        const __dirname: string = path.dirname(__filename);
        const folderPath: string = path.join(__dirname, '../../static/profile-picture');

        const filePath: string = path.join(folderPath, filename);

        fs.writeFile(filePath, buffer, (error: any): void => {
            if (error) {
                throw new Error('Failed to save the avatar from URL');
            }
        });

        return `static/profile-picture/${filename}`;
    }
}
