import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginDto) {
    // `password` is select:false on the entity, so request it explicitly.
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // User-facing text is German; the app has no other UI language.
      throw new UnauthorizedException('Benutzername oder Passwort ist falsch');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      access_token,
      user: { id: user.id, username: user.username },
    };
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  static hashPassword(plain: string) {
    return bcrypt.hash(plain, 10);
  }
}
