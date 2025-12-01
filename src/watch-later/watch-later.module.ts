import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchLaterController } from './watch-later.controller';
import { WatchLaterService } from './watch-later.service';
import { WatchLater } from './entities/watch-later.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WatchLater])],
  controllers: [WatchLaterController],
  providers: [WatchLaterService],
  exports: [WatchLaterService],
})
export class WatchLaterModule {}
