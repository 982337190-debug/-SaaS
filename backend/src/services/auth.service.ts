import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto, ChangePasswordDto, SendSmsDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { phone, password, sms_code } = loginDto;
    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new Error('用户不存在');
    }

    if (user.status !== 'active') {
      throw new Error('用户已被禁用');
    }

    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('密码错误');
      }
    } else if (sms_code) {
      if (sms_code !== '123456') {
        throw new Error('验证码错误');
      }
    } else {
      throw new Error('请输入密码或验证码');
    }

    const payload = { userId: user.id, phone: user.phone };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async register(registerDto: any) {
    const { phone, password, name, email } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { phone } });

    if (existingUser) {
      throw new Error('该手机号已注册');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      phone,
      password: hashedPassword,
      name,
      email,
    });

    await this.userRepository.save(user);

    const payload = { userId: user.id, phone: user.phone };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('旧密码错误');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: '密码修改成功' };
  }

  async sendSms(sendSmsDto: SendSmsDto) {
    const { phone } = sendSmsDto;
    return { message: '验证码已发送', code: '123456' };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });

      if (!user) {
        throw new Error('用户不存在');
      }

      return {
        userId: user.id,
        phone: user.phone,
        name: user.name,
      };
    } catch {
      throw new Error('无效的token');
    }
  }
}