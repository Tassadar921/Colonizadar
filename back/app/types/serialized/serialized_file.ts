import FileTypeEnum from '#types/enum/file_type_enum';

type SerializedFile = {
    name: string;
    path: string;
    extension: string;
    mimeType: string;
    size: number;
    type: FileTypeEnum;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedFile;
