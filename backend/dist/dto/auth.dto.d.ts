export declare class LoginDto {
    phone: string;
    password?: string;
    sms_code?: string;
}
export declare class LoginWithCodeDto {
    phone: string;
    code: string;
}
export declare class RegisterDto {
    phone: string;
    password: string;
    name: string;
    email?: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class SendSmsDto {
    phone: string;
}
