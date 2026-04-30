<template>
  <view class="page">
    <view class="title">新鲜蔬菜</view>
    <gc-product-card name="西红柿" price="3.49" unit="约500g" />
  </view>
</template>

<script setup lang="ts">
import GcProductCard from "@community-grocery/miniapp-ui/components/gc-product-card.vue";
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
}

.title {
  margin-bottom: 24rpx;
  font-size: 36rpx;
  font-weight: 700;
}
</style>
