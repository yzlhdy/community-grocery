<template>
  <view class="page">
    <view class="hero">
      <view>
        <view class="title">社区买菜</view>
        <view class="subtitle">幸福里小区 · 今日新鲜到家</view>
      </view>
      <button class="hero-button">立即参与</button>
    </view>

    <view class="section">
      <view class="section-title">邻里热卖</view>
      <gc-product-card name="上海青" price="2.49" unit="约500g" />
    </view>
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

.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 280rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #eaf9e5 0%, #c8efb4 100%);
}

.title {
  color: #15911b;
  font-size: 44rpx;
  font-weight: 700;
}

.subtitle {
  margin-top: 12rpx;
  color: #386335;
  font-size: 26rpx;
}

.hero-button {
  margin: 0;
  border-radius: 999rpx;
  background: #35ad31;
  color: #fff;
  font-size: 26rpx;
}

.section {
  margin-top: 32rpx;
}

.section-title {
  margin-bottom: 20rpx;
  font-size: 34rpx;
  font-weight: 700;
}
</style>
