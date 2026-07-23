import { AuthService } from '../services/auth.service';
import { LoginDto, LoginWithCodeDto, RegisterDto, ChangePasswordDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    loginWithCode(loginWithCodeDto: LoginWithCodeDto): Promise<{
        phone: string;
        code: string;
        message: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
        };
    }>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<{
        oldPassword: string;
        newPassword: string;
        message: string;
    }>;
}
