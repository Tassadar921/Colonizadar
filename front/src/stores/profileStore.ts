import {type Writable, writable} from 'svelte/store';
import axios from 'axios';
import type SerializedUser from "colonizadar-backend/app/types/serialized/serialized_user";

export const profile: Writable<SerializedUser | null> = writable(null);

export function setProfile(user: SerializedUser | null): void {
    profile.set(user);
}

export async function updateProfile(profile: SerializedUser | null = null): Promise<void> {
    try {
        if (!profile) {
            const { data: fetchedProfile } = await axios.get('/api/profile');
            profile = fetchedProfile.user;
        }
        setProfile(profile);
    } catch (error: any) {
        throw new Error();
    }
}

export function clearProfile(): void {
    profile.set(null);
}
