import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { CartService } from "./cart.service";
import { UpsertCartItemDto } from "./dto/upsert-cart-item.dto";

@ApiTags("cart")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("customer"))
@Controller("cart")
/**
 * Customer cart endpoints.
 */
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  /**
   * Reads the authenticated customer's cart.
   */
  findMine(@CurrentUser() user: AuthUser) {
    return this.cartService.findMine(user.sub);
  }

  @Put("items")
  /**
   * Adds or updates a SKU quantity in the authenticated customer's cart.
   */
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertCartItemDto) {
    return this.cartService.upsert(user.sub, dto);
  }

  @Delete("items/:skuId")
  /**
   * Deletes one SKU from the authenticated customer's cart.
   */
  remove(@CurrentUser() user: AuthUser, @Param("skuId") skuId: string) {
    return this.cartService.remove(user.sub, skuId);
  }
}
