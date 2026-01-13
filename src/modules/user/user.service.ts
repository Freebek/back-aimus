import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import getCurrentTimeHelper from 'src/common/helpers/get-current-time.helper';
import { User, UserDocument } from 'src/models/schemas/user.schema';
import { UserRoleEnum } from 'src/types/global';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      this.logger.debug(`Method: ${this.getById.name} - User Not Found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateOfertaRead(userId: string, ofertaRead: boolean) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { oferta_read: ofertaRead },
      { new: true },
    );

    if (!user) {
      this.logger.debug(
        `Method: ${this.updateOfertaRead.name} - User Not Found`,
      );
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
