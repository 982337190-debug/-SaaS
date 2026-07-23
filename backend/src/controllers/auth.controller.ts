import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, LoginWithCodeDto, RegisterDto, ChangePasswordDto } from '../dto/auth.dto';
import { CreateUserDto } from '../dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login-with-code')
  async loginWithCode(@Body() loginWithCodeDto: LoginWithCodeDto) {
    return { message: '验证码登录功能待实现', ...loginWithCodeDto };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const createUserDto: CreateUserDto = {
      phone: registerDto.phone,
      password: registerDto.password,
      name: registerDto.name,
      email: registerDto.email,
    };
    return this.authService.register(createUserDto);
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return { message: '密码修改功能待实现', ...changePasswordDto };
  }
}