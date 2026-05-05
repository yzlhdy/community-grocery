import { Module } from "@nestjs/common";
import { PointsModule } from "../points/points.module";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
  imports: [PointsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
/**
 * 商品评价模块。
 */
export class ReviewModule {}
