import { Body, Controller, Delete, Get, Param, Patch, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtRoleGuard } from "../../common/guards/jwt-role.guard";
import type { AuthUser } from "../../common/types/authenticated-request";
import { CartService } from "./cart.service";
import { UpdateCartItemSelectedDto } from "./dto/update-cart-item-selected.dto";
import { UpsertCartItemDto } from "./dto/upsert-cart-item.dto";

@ApiTags("购物车")
@ApiBearerAuth()
@UseGuards(JwtRoleGuard("customer"))
@Controller("cart")
/**
 * 小程序用户购物车接口。
 */
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "查询我的购物车" })
  /**
   * 查询当前登录用户的购物车。
   */
  findMine(@CurrentUser() user: AuthUser) {
    return this.cartService.findMine(user.sub);
  }

  @Get("summary")
  @ApiOperation({ summary: "查询购物车结算汇总" })
  /**
   * 查询当前登录用户购物车的结算金额和选中商品。
   */
  getSummary(@CurrentUser() user: AuthUser) {
    return this.cartService.getSummary(user.sub);
  }

  @Put("items")
  @ApiOperation({ summary: "新增或修改购物车商品" })
  /**
   * 新增或修改当前登录用户购物车中的 SKU 数量。
   */
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertCartItemDto) {
    return this.cartService.upsert(user.sub, dto);
  }

  @Patch("items/:skuId/selected")
  @ApiOperation({ summary: "修改购物车选中状态" })
  /**
   * 修改购物车中单个 SKU 的选中状态。
   */
  updateSelected(
    @CurrentUser() user: AuthUser,
    @Param("skuId") skuId: string,
    @Body() dto: UpdateCartItemSelectedDto,
  ) {
    return this.cartService.updateSelected(user.sub, skuId, dto);
  }

  @Patch("items/selected-all")
  @ApiOperation({ summary: "全选或取消全选购物车" })
  /**
   * 批量修改购物车商品选中状态。
   */
  updateAllSelected(@CurrentUser() user: AuthUser, @Body() dto: UpdateCartItemSelectedDto) {
    return this.cartService.updateAllSelected(user.sub, dto.selected);
  }

  @Delete("items/:skuId")
  @ApiOperation({ summary: "删除购物车商品" })
  /**
   * 删除当前登录用户购物车中的一个 SKU。
   */
  remove(@CurrentUser() user: AuthUser, @Param("skuId") skuId: string) {
    return this.cartService.remove(user.sub, skuId);
  }
}
