<template>
  <div class="vip-container">
    <template v-if="isLoggedIn">
      <div class="vip-header">
        <h2>VIP会员</h2>
        <div class="vip-status" v-if="isVIP">
          <el-tag type="warning" size="large">VIP会员</el-tag>
          <span class="expire-date">到期时间：{{ vipExpireDate }}</span>
        </div>
      </div>

      <div class="vip-benefits">
        <h3>会员特权</h3>
        <div class="benefits-grid">
          <div class="benefit-item">
            <el-icon><VideoPlay /></el-icon>
            <h4>4K超清画质</h4>
            <p>享受极致观影体验</p>
          </div>
          <div class="benefit-item">
            <el-icon><MuteNotification /></el-icon>
            <h4>无广告打扰</h4>
            <p>沉浸式观影体验</p>
          </div>
          <div class="benefit-item">
            <el-icon><Download /></el-icon>
            <h4>离线缓存</h4>
            <p>随时随地观看</p>
          </div>
          <div class="benefit-item">
            <el-icon><Service /></el-icon>
            <h4>专属客服</h4>
            <p>优先解决问题</p>
          </div>
        </div>
      </div>

      <div class="vip-plans">
        <h3>开通会员</h3>
        <div class="plans-grid">
          <el-card 
            v-for="plan in vipPlans" 
            :key="plan.id"
            :class="['plan-card', { 'recommended': plan.recommended }]"
          >
            <template #header>
              <div class="plan-header">
                <h4>{{ plan.name }}</h4>
                <el-tag v-if="plan.recommended" type="warning">推荐</el-tag>
              </div>
            </template>
            <div class="plan-price">
              <span class="currency">¥</span>
              <span class="amount">{{ plan.price }}</span>
              <span class="original-price">¥{{ plan.originalPrice }}</span>
            </div>
            <div class="plan-features">
              <ul>
                <li v-for="(feature, index) in plan.features" :key="index">
                  <el-icon><Check /></el-icon>
                  {{ feature }}
                </li>
              </ul>
            </div>
            <el-button 
              type="primary" 
              class="buy-button"
              :disabled="isVIP"
              @click="handleBuyPlan(plan)"
            >
              {{ isVIP ? '已是会员' : '立即开通' }}
            </el-button>
          </el-card>
        </div>
      </div>

      <el-dialog
        v-model="paymentDialogVisible"
        title="确认支付"
        width="400px"
        center
      >
        <div class="payment-dialog">
          <div class="payment-info">
            <p class="plan-name">{{ selectedPlan?.name }}</p>
            <p class="plan-price">¥{{ selectedPlan?.price }}</p>
          </div>
          <div class="payment-methods">
            <h4>选择支付方式</h4>
            <el-radio-group v-model="paymentMethod">
              <el-radio label="wechat">微信支付</el-radio>
              <el-radio label="alipay">支付宝</el-radio>
            </el-radio-group>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="paymentDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleConfirmPayment">
              确认支付
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
    <el-empty v-else description="请先登录" />
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import {
  VideoPlay,
  MuteNotification,
  Download,
  Service,
  Check
} from '@element-plus/icons-vue'

export default {
  name: 'UserVIP',
  components: {
    VideoPlay,
    MuteNotification,
    Download,
    Service,
    Check
  },
  setup() {
    const store = useStore()
    const paymentDialogVisible = ref(false)
    const paymentMethod = ref('wechat')
    const selectedPlan = ref(null)
    
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const isVIP = computed(() => store.getters['user/isVIP'])
    const vipExpireDate = computed(() => store.getters['user/vipExpireDate'])
    const vipPlans = computed(() => store.getters['user/vipPlans'] || [])

    onMounted(async () => {
      try {
        await store.dispatch('user/fetchVIPPlans')
      } catch (error) {
        ElMessage.error('获取会员套餐失败')
      }
    })

    const handleBuyPlan = (plan) => {
      selectedPlan.value = plan
      paymentDialogVisible.value = true
    }

    const handleConfirmPayment = async () => {
      try {
        await store.dispatch('user/purchaseVIP', {
          planId: selectedPlan.value.id,
          paymentMethod: paymentMethod.value
        })
        ElMessage.success('支付成功！')
        paymentDialogVisible.value = false
        // 刷新用户信息
        await store.dispatch('user/fetchUserInfo')
      } catch (error) {
        ElMessage.error('支付失败，请重试')
      }
    }

    return {
      isLoggedIn,
      isVIP,
      vipExpireDate,
      vipPlans,
      paymentDialogVisible,
      paymentMethod,
      selectedPlan,
      handleBuyPlan,
      handleConfirmPayment
    }
  }
}
</script>

<style scoped>
.vip-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.vip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.vip-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.vip-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.expire-date {
  color: var(--el-text-color-secondary);
}

.vip-benefits {
  margin-bottom: 40px;
}

.vip-benefits h3,
.vip-plans h3 {
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.benefit-item {
  text-align: center;
  padding: 30px;
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-5px);
}

.benefit-item .el-icon {
  font-size: 36px;
  color: var(--el-color-primary);
  margin-bottom: 15px;
}

.benefit-item h4 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
}

.benefit-item p {
  margin: 0;
  color: var(--el-text-color-secondary);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.plan-card {
  transition: transform 0.3s ease;
}

.plan-card.recommended {
  transform: scale(1.05);
  border-color: var(--el-color-warning);
}

.plan-card:not(.recommended):hover {
  transform: translateY(-5px);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-header h4 {
  margin: 0;
  font-size: 18px;
}

.plan-price {
  text-align: center;
  margin: 20px 0;
}

.currency {
  font-size: 20px;
  vertical-align: super;
}

.amount {
  font-size: 36px;
  font-weight: bold;
  color: var(--el-color-danger);
}

.original-price {
  margin-left: 10px;
  color: var(--el-text-color-secondary);
  text-decoration: line-through;
}

.plan-features {
  margin: 20px 0;
}

.plan-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: var(--el-text-color-regular);
}

.plan-features .el-icon {
  color: var(--el-color-success);
}

.buy-button {
  width: 100%;
}

.payment-dialog {
  text-align: center;
}

.payment-info {
  margin-bottom: 20px;
}

.payment-info .plan-name {
  font-size: 18px;
  margin: 0 0 10px 0;
}

.payment-info .plan-price {
  font-size: 24px;
  color: var(--el-color-danger);
  margin: 0;
}

.payment-methods {
  text-align: left;
}

.payment-methods h4 {
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .vip-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .plan-card.recommended {
    transform: none;
  }
}
</style> 