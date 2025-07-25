import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './users.dto';
import { ConflictException } from 'src/common/exceptions/conflict.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUser: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUser.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email is already in use.',
        'USER_ALREADY_EXISTS',
        'Please use a different email address.',
      );
    }
    const hashedPassword = await bcrypt.hash(createUser.password, 10);
  }
}
