import SerializedFile from "#types/serialized/serialized_file";

type SerializedPlayableCountry = {
    id: number;
    name: string;
    flag: SerializedFile;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPlayableCountry;
