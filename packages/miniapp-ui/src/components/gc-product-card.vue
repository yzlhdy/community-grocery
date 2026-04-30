<template>
  <view class="gc-product-card">
    <view class="gc-product-card__image" />
    <view class="gc-product-card__content">
      <view class="gc-product-card__name">{{ name }}</view>
      <view class="gc-product-card__unit">{{ unit }}</view>
      <view class="gc-product-card__footer">
        <text class="gc-product-card__price">¥{{ price }}</text>
        <button class="gc-product-card__add">+</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  price: string;
  unit: string;
}>();
</script>

<style lang="scss" scoped>
.gc-product-card {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background: #fff;
  box-shadow: 0 12rpx 32rpx rgba(31, 73, 28, 0.08);
}

.gc-product-card__image {
  width: 160rpx;
  height: 160rpx;
  flex: none;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #eaf9e5 0%, #fff 100%);
}

.gc-product-card__content {
  flex: 1;
  min-width: 0;
}

.gc-product-card__name {
  color: #172014;
  font-size: 30rpx;
  font-weight: 700;
}

.gc-product-card__unit {
  margin-top: 8rpx;
  color: #7c8878;
  font-size: 24rpx;
}

.gc-product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 28rpx;
}

.gc-product-card__price {
  color: #ff4b1f;
  font-size: 34rpx;
  font-weight: 700;
}

.gc-product-card__add {
  width: 52rpx;
  height: 52rpx;
  margin: 0;
  padding: 0;
  border-radius: 999rpx;
  background: #35ad31;
  color: #fff;
  font-size: 34rpx;
  line-height: 52rpx;
}
</style>
