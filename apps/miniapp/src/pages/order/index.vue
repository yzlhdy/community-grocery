<template>
  <view class="page">
    <view class="status-card">
      <view class="status">待自提</view>
      <view class="code-label">自提码</view>
      <view class="code">2685</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
}

.status-card {
  padding: 36rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #eaf9e5 0%, #ffffff 100%);
}

.status {
  color: #15911b;
  font-size: 36rpx;
  font-weight: 700;
}

.code-label {
  margin-top: 32rpx;
  color: #7c8878;
  font-size: 24rpx;
}

.code {
  margin-top: 8rpx;
  font-size: 64rpx;
  font-weight: 800;
  letter-spacing: 8rpx;
}
</style>
