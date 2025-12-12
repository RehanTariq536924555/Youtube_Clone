import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Video } from '../videos/entities/video.entity';
import { Comment } from '../comments/entities/comment.entity';
import { View } from '../views/entities/view.entity';
import { Channel } from '../channels/entities/channel.entity';
export declare class AdminService {
    private userRepository;
    private videoRepository;
    private commentRepository;
    private viewRepository;
    private channelRepository;
    constructor(userRepository: Repository<User>, videoRepository: Repository<Video>, commentRepository: Repository<Comment>, viewRepository: Repository<View>, channelRepository: Repository<Channel>);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalVideos: number;
        totalComments: number;
        totalViews: number;
        totalChannels: number;
        activeChannels: number;
        recentUsers: number;
    }>;
    getAllUsers(page: number, limit: number, search?: string): Promise<{
        users: User[];
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
        user: User;
    }>;
    unbanUser(id: string): Promise<{
        message: string;
        user: User;
    }>;
    updateUserRole(id: string, role: string): Promise<{
        message: string;
        user: User;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getAllVideos(page: number, limit: number, status?: string): Promise<{
        videos: Video[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    featureVideo(id: string): Promise<{
        message: string;
        video: Video;
    }>;
    suspendVideo(id: string, reason?: string): Promise<{
        message: string;
        video: Video;
    }>;
    unsuspendVideo(id: string): Promise<{
        message: string;
        video: Video;
    }>;
    deleteVideo(id: string): Promise<{
        message: string;
    }>;
    getAllComments(page: number, limit: number): Promise<{
        comments: Comment[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    deleteComment(id: string): Promise<{
        message: string;
    }>;
    getAnalytics(period: string): Promise<{
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
    createFirstAdmin(name: string, email: string, password: string): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    promoteUserToAdmin(email: string): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
