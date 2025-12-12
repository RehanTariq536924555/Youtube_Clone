import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalVideos: number;
        totalComments: number;
        totalViews: number;
        totalChannels: number;
        activeChannels: number;
        recentUsers: number;
    }>;
    getAllUsers(page?: number, limit?: number, search?: string): Promise<{
        users: import("../users/entities/user.entity").User[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUserDetails(id: string): Promise<{
        videoCount: number;
        totalViews: any;
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
    }>;
    banUser(id: string, reason: string): Promise<{
        message: string;
        user: import("../users/entities/user.entity").User;
    }>;
    unbanUser(id: string): Promise<{
        message: string;
        user: import("../users/entities/user.entity").User;
    }>;
    updateUserRole(id: string, role: string): Promise<{
        message: string;
        user: import("../users/entities/user.entity").User;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getAllVideos(page?: number, limit?: number, status?: string): Promise<{
        videos: import("../videos/entities/video.entity").Video[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    featureVideo(id: string): Promise<{
        message: string;
        video: import("../videos/entities/video.entity").Video;
    }>;
    suspendVideo(id: string, reason?: string): Promise<{
        message: string;
        video: import("../videos/entities/video.entity").Video;
    }>;
    unsuspendVideo(id: string): Promise<{
        message: string;
        video: import("../videos/entities/video.entity").Video;
    }>;
    deleteVideo(id: string): Promise<{
        message: string;
    }>;
    getAllComments(page?: number, limit?: number): Promise<{
        comments: import("../comments/entities/comment.entity").Comment[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    deleteComment(id: string): Promise<{
        message: string;
    }>;
    getAnalytics(period?: string): Promise<{
        period: string;
        newUsers: number;
        newVideos: number;
    }>;
    createAdmin(name: string, email: string, password: string): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    changeUserPassword(id: string, newPassword: string): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
}
export declare class AdminBootstrapController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createFirstAdmin(name: string, email: string, password: string): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    promoteToAdmin(email: string): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
