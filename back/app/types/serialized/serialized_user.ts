import UserRoleEnum from '#types/enum/user_role_enum';
import SerializedFile from '#types/serialized/serialized_file';

type SerializedUser = {
    id: number;
    username: string;
    email: string;
    role: UserRoleEnum;
    enabled: boolean;
    acceptedTermsAndConditions: boolean;
    receivedFriendRequest?: boolean;
    sentFriendRequest?: boolean;
    profilePicture?: SerializedFile;
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedUser;
