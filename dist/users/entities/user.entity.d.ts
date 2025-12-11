export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    googleId: string;
    picture: string;
    isEmailVerified: boolean;
    emailVerificationToken: string;
    avatar: string;
    bio: string;
    subscribersCount: number;
    videosCount: number;
    role: string;
    isBanned: boolean;
    videos: any[];
    comments: any[];
    likes: any[];
    subscriptions: any[];
    subscribers: any[];
    views: any[];
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
}
