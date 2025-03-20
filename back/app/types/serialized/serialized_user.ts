import UserRoleEnum from '#types/enum/user_role_enum';

type SerializedUser = {
    id: number;
    username: string;
    email: string;
    role: UserRoleEnum;
    enabled: boolean;
    acceptedTermsAndConditions: boolean;
    receivedFriendRequest?: boolean;
    sentFriendRequest?: boolean;
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedUser;
