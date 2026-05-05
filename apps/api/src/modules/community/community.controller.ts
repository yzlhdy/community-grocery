import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import { CommunityService } from "./community.service";
import { UpsertCommunityDto } from "./dto/upsert-community.dto";

@ApiTags("communities")
@Controller("communities")
/**
 * Community endpoints for client selection and admin management.
 */
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  /**
   * Lists communities available for customer pickup selection.
   */
  findMany() {
    return this.communityService.findMany();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard("admin"))
  /**
   * Creates or updates a community. Requires admin authentication.
   */
  upsert(@Body() dto: UpsertCommunityDto) {
    return this.communityService.upsert(dto);
  }
}
