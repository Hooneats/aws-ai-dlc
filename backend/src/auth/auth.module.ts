import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
import { TableEntity } from '../table/entities/table.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StoreModule } from '../store/store.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, TableEntity]),
    StoreModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '16h') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
