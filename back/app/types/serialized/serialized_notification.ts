type SerializedNotification = {
    id: number;
    message: string;
    seen: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedNotification;
