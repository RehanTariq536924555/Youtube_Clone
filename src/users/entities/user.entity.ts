import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  password: string;

  // Google OAuth fields
  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  picture: string;

  //email verification status
  @Column({ default: false })
  isEmailVerified: boolean;

  //email verification token
  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'int', default: 0 })
  subscribersCount: number;

  @Column({ type: 'int', default: 0 })
  videosCount: number;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  isBanned: boolean;

  @OneToMany('Video', 'user')
  videos: any[];

  @OneToMany('Comment', 'user')
  comments: any[];

  @OneToMany('Like', 'user')
  likes: any[];

  @OneToMany('Subscription', 'subscriber')
  subscriptions: any[];

  @OneToMany('Subscription', 'channel')
  subscribers: any[];

  @OneToMany('View', 'user')
  views: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    // Only hash password if it exists (for Google OAuth users, password might be null)
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
