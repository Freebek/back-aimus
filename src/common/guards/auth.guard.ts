import { IS_PUBLIC_KEY } from './../../types/global/constants';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Config from '../config/app.config';
import { UserService } from '../../modules/user/user.service';
import { DefaultStatusEnum } from '../../types/global/constants';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    // if (isPublic) {
    //   return true;
    // }

    const request = context.switchToHttp().getRequest();
    // const method = request.method;

    // const path = (
    //   request.route?.path || this.getPathFromUrl(request.url)
    // )?.split('v1')?.[1];

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('No bearer token provided');
      throw new UnauthorizedException('Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = this.jwtService.verify(token, {
        secret: Config.JwtConfig.secret,
      });
      this.logger.debug('Token verified successfully');
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.id) {
      this.logger.warn('Token missing id');
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const user = await this.userService.getById(payload.id);
      request.user_id = user._id.toString();

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      this.logger.error(`Error during permission check: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
