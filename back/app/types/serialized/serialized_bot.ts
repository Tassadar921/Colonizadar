import SerializedFile from '#types/serialized/serialized_file';

type SerializedBot = {
    id: number;
    name: string;
    picture: SerializedFile;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedBot;
