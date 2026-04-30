<template>
  <view class="page">
    <view class="title">购物车</view>
    <view class="card">
      <view class="label">自提点</view>
      <view class="value">幸福里小区东门</view>
      <view class="hint">今日18:00后可取</view>
    </view>
  </view>
</template>

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

.card {
  padding: 28rpx;
  border-radius: 20rpx;
  background: #fff;
}

.label {
  color: #7c8878;
  font-size: 24rpx;
}

.value {
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.hint {
  margin-top: 8rpx;
  color: #35ad31;
  font-size: 24rpx;
}
</style>
