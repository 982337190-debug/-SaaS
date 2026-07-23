import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto, ChangePasswordDto, SendSmsDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
            avatar: string;
        };
    }>;
    register(registerDto: any): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    }>;
    changePassword(changePasswordDto: ChangePasswordDto, userId: string): Promise<{
        message: string;
    }>;
    sendSms(sendSmsDto: SendSmsDto): Promise<{
        message: string;
        code: string;
    }>;
    validateToken(token: string): Promise<{
        userId: string;
        phone: string;
        name: string;
    }>;
}
