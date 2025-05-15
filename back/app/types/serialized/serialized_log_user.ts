import SerializedLog from '#types/serialized/serialized_log';

type SerializedLogUser = {
    id: number;
    email: string;
    logs?: SerializedLog[];
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedLogUser;
