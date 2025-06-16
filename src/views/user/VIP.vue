<template>
  <div class="vip-container">
    <template v-if="isLoggedIn">
      <div class="vip-header">
        <h2>VIP会员</h2>
        <div class="vip-status" v-if="userInfo.isVip">
          <el-tag type="warning" size="large">VIP会员</el-tag>
          <span class="expire-date">到期时间：{{ formatDate(userInfo.vipExpireTime) }}</span>
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
          <!-- 月度会员 -->
          <el-card class="plan-card">
            <template #header>
              <div class="plan-header">
                <h4>月度会员</h4>
                <div class="plan-badge basic">基础版</div>
              </div>
            </template>
            <div class="plan-price">
              <span class="currency">¥</span>
              <span class="amount">{{ vipPlans.monthly.price }}</span>
              <span class="period">/月</span>
            </div>
            <div class="plan-features">
              <ul>
                <li><el-icon><Check /></el-icon>{{ vipPlans.monthly.duration }}天有效期</li>
                <li><el-icon><Check /></el-icon>高清画质观看</li>
                <li><el-icon><Check /></el-icon>无广告播放</li>
                <li><el-icon><Check /></el-icon>离线下载功能</li>
              </ul>
            </div>
            <el-button 
              type="primary" 
              class="buy-button"
              :disabled="userInfo.isVip"
              @click="handleBuyPlan(vipPlans.monthly)"
            >
              {{ userInfo.isVip ? '已是会员' : '立即开通' }}
            </el-button>
          </el-card>

          <!-- 季度会员 -->
          <el-card class="plan-card recommended">
            <div class="popular-ribbon">推荐</div>
            <template #header>
              <div class="plan-header">
                <h4>季度会员</h4>
                <div class="plan-badge popular">热门版</div>
              </div>
            </template>
            <div class="plan-price">
              <span class="currency">¥</span>
              <span class="amount">{{ vipPlans.quarterly.price }}</span>
              <span class="period">/季</span>
            </div>
            <div class="plan-discount">
              <span>相比月度节省 ¥{{ getMonthlySavings('quarterly') }}</span>
            </div>
            <div class="plan-features">
              <ul>
                <li><el-icon><Check /></el-icon>{{ vipPlans.quarterly.duration }}天有效期</li>
                <li><el-icon><Check /></el-icon>超高清4K画质</li>
                <li><el-icon><Check /></el-icon>无广告播放</li>
                <li><el-icon><Check /></el-icon>离线下载功能</li>
                <li><el-icon><Check /></el-icon>多端同时观看</li>
              </ul>
            </div>
            <el-button 
              type="primary" 
              class="buy-button"
              :disabled="userInfo.isVip"
              @click="handleBuyPlan(vipPlans.quarterly)"
            >
              {{ userInfo.isVip ? '已是会员' : '立即开通' }}
            </el-button>
          </el-card>

          <!-- 年度会员 -->
          <el-card class="plan-card">
            <template #header>
              <div class="plan-header">
                <h4>年度会员</h4>
                <div class="plan-badge premium">至尊版</div>
              </div>
            </template>
            <div class="plan-price">
              <span class="currency">¥</span>
              <span class="amount">{{ vipPlans.yearly.price }}</span>
              <span class="period">/年</span>
            </div>
            <div class="plan-discount">
              <span>相比月度节省 ¥{{ getMonthlySavings('yearly') }}</span>
            </div>
            <div class="plan-features">
              <ul>
                <li><el-icon><Check /></el-icon>{{ vipPlans.yearly.duration }}天有效期</li>
                <li><el-icon><Check /></el-icon>超高清4K画质</li>
                <li><el-icon><Check /></el-icon>无广告播放</li>
                <li><el-icon><Check /></el-icon>离线下载功能</li>
                <li><el-icon><Check /></el-icon>多端同时观看</li>
                <li><el-icon><Check /></el-icon>专属客服服务</li>
              </ul>
            </div>
            <el-button 
              type="primary" 
              class="buy-button"
              :disabled="userInfo.isVip"
              @click="handleBuyPlan(vipPlans.yearly)"
            >
              {{ userInfo.isVip ? '已是会员' : '立即开通' }}
            </el-button>
          </el-card>
        </div>
      </div>

      <!-- 我的订单 -->
      <div class="my-orders" v-if="userOrders.length > 0">
        <h3>我的订单</h3>
        <div class="orders-list">
          <el-card v-for="order in userOrders" :key="order.id" class="order-card">
            <div class="order-info">
              <div class="order-header">
                <span class="order-number">订单号：{{ order.orderNumber }}</span>
                <el-tag :type="getOrderStatusType(order.status)" size="small">
                  {{ order.statusName }}
                </el-tag>
              </div>
              <div class="order-details">
                <p><strong>{{ order.vipTypeName }}</strong></p>
                <p>支付金额：<span class="amount">¥{{ order.amount }}</span></p>
                <p>支付方式：{{ order.paymentMethodName }}</p>
                <p>创建时间：{{ formatDateTime(order.createTime) }}</p>
                <p v-if="order.payTime">支付时间：{{ formatDateTime(order.payTime) }}</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 支付对话框 -->
      <el-dialog
        v-model="paymentDialogVisible"
        title="确认支付"
        width="500px"
        center
        :close-on-click-modal="false"
      >
        <div class="payment-dialog">
          <div class="payment-info">
            <h4>{{ selectedPlan?.name }}</h4>
            <div class="price-info">
              <span class="current-price">¥{{ selectedPlan?.price }}</span>
              <span class="period">{{ selectedPlan?.period }}</span>
            </div>
            <p class="duration">有效期：{{ selectedPlan?.duration }}天</p>
          </div>
          
          <div class="payment-methods">
            <h4>选择支付方式</h4>
            <el-radio-group v-model="paymentMethod">
              <el-radio :label="0">
                <div class="payment-option">
                  <el-icon><ChatDotSquare /></el-icon>
                  <span>微信支付</span>
                </div>
              </el-radio>
              <el-radio :label="1">
                <div class="payment-option">
                  <el-icon><Money /></el-icon>
                  <span>支付宝</span>
                </div>
              </el-radio>
              <el-radio :label="2">
                <div class="payment-option">
                  <el-icon><CreditCard /></el-icon>
                  <span>银行卡</span>
                </div>
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 支付二维码 -->
          <div v-if="qrCodeInfo" class="qrcode-section">
            <h4>扫码支付</h4>
            <div class="qrcode-container">
              <img :src="qrCodeInfo.qrCodeUrl" alt="支付二维码" class="qrcode-image" />
              <p class="qrcode-tip">请使用{{ getPaymentMethodName(paymentMethod) }}扫描二维码完成支付</p>
              <div class="payment-status">
                <el-tag :type="getPaymentStatusType()" size="large">
                  {{ getPaymentStatusText() }}
                </el-tag>
              </div>
              <div class="order-details">
                <p>订单号：{{ qrCodeInfo.orderId }}</p>
                <p>支付金额：<span class="amount">¥{{ qrCodeInfo.amount }}</span></p>
                <p>过期时间：{{ formatDateTime(qrCodeInfo.expireTime) }}</p>
              </div>
            </div>
          </div>

          <!-- 支付状态 -->
          <div v-if="paymentStatus" class="payment-result">
            <div v-if="paymentStatus === 'success'" class="status-success">
              <el-icon><CircleCheck /></el-icon>
              <span>支付成功！VIP权限已开通</span>
            </div>
            <div v-else-if="paymentStatus === 'failed'" class="status-failed">
              <el-icon><CircleClose /></el-icon>
              <span>支付失败，请重试</span>
            </div>
            <div v-else-if="paymentStatus === 'expired'" class="status-expired">
              <el-icon><Clock /></el-icon>
              <span>订单已过期，请重新下单</span>
            </div>
          </div>
        </div>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="handleCancelPayment">取消</el-button>
            <el-button 
              v-if="!qrCodeInfo"
              type="primary" 
              @click="handleConfirmPayment"
              :loading="generating"
            >
              {{ generating ? '生成中...' : '确认支付' }}
            </el-button>
            <el-button 
              v-else-if="currentOrderStatus === 0"
              type="success" 
              @click="handleSimulatePayment"
              :loading="simulating"
            >
              {{ simulating ? '处理中...' : '模拟支付成功' }}
            </el-button>
            <el-button 
              v-if="qrCodeInfo && currentOrderStatus === 0"
              type="info" 
              @click="handleCheckStatus"
              :loading="checking"
            >
              {{ checking ? '查询中...' : '查询状态' }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </template>
    <el-empty v-else description="请先登录" />
  </div>
</template>

<script>
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import {
  VideoPlay,
  MuteNotification,
  Download,
  Service,
  Check,
  CircleCheck,
  CircleClose,
  Clock,
  ChatDotSquare,
  Money,
  CreditCard
} from '@element-plus/icons-vue'
import { paymentApi } from '@/api/payment'

export default {
  name: 'UserVIP',
  components: {
    VideoPlay,
    MuteNotification,
    Download,
    Service,
    Check,
    CircleCheck,
    CircleClose,
    Clock,
    ChatDotSquare,
    Money,
    CreditCard
  },
  setup() {
    const store = useStore()
    const paymentDialogVisible = ref(false)
    const paymentMethod = ref(0) // 0:微信 1:支付宝 2:银行卡
    const selectedPlan = ref(null)
    const paymentStatus = ref('')
    const qrCodeInfo = ref(null)
    const currentOrderStatus = ref(-1) // -1:未开始 0:待支付 1:已支付 2:已取消 3:已过期
    const generating = ref(false)
    const simulating = ref(false)
    const checking = ref(false)
    const userOrders = ref([])
    
    // 轮询定时器
    let statusPollingTimer = null
    
    // VIP套餐配置（根据API接口说明）
    const vipPlans = reactive({
      monthly: {
        id: 1,
        name: '月度会员',
        price: 29.90,
        duration: 30,
        period: '/月',
        type: 1
      },
      quarterly: {
        id: 2,
        name: '季度会员',
        price: 88.00,
        duration: 90,
        period: '/季',
        type: 2
      },
      yearly: {
        id: 3,
        name: '年度会员',
        price: 328.00,
        duration: 365,
        period: '/年',
        type: 3
      }
    })

    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    const userInfo = computed(() => store.getters['user/userInfo'] || {})

    // 获取用户订单
    const fetchUserOrders = async () => {
      if (!isLoggedIn.value || !userInfo.value.id) return
      
      try {
        const response = await paymentApi.getUserOrders(userInfo.value.id, 0, 5)
        const data = response.data || response
        userOrders.value = data.content || []
      } catch (error) {
        console.error('获取用户订单失败:', error)
      }
    }

    onMounted(async () => {
      if (isLoggedIn.value) {
        await fetchUserOrders()
      }
    })

    // 计算节省金额
    const getMonthlySavings = (planType) => {
      if (planType === 'quarterly') {
        const monthlyTotal = vipPlans.monthly.price * 3
        return (monthlyTotal - vipPlans.quarterly.price).toFixed(2)
      } else if (planType === 'yearly') {
        const monthlyTotal = vipPlans.monthly.price * 12
        return (monthlyTotal - vipPlans.yearly.price).toFixed(2)
      }
      return 0
    }

    // 处理购买套餐
    const handleBuyPlan = (plan) => {
      if (!isLoggedIn.value) {
        ElMessage.warning('请先登录')
        return
      }
      
      selectedPlan.value = plan
      paymentDialogVisible.value = true
      paymentStatus.value = ''
      qrCodeInfo.value = null
      currentOrderStatus.value = -1
    }

    // 确认支付
    const handleConfirmPayment = async () => {
      if (!selectedPlan.value || !isLoggedIn.value) return
      
      try {
        generating.value = true
        
        const response = await paymentApi.generateQRCode({
          userId: userInfo.value.id,
          planId: selectedPlan.value.type,
          amount: selectedPlan.value.price,
          paymentMethod: paymentMethod.value
        })
        
        const data = response.data || response
        qrCodeInfo.value = data
        currentOrderStatus.value = 0
        
        ElMessage.success('支付二维码生成成功')
        
        // 开始轮询支付状态
        startStatusPolling()
        
      } catch (error) {
        console.error('生成支付二维码失败:', error)
        ElMessage.error(error.message || '生成支付二维码失败')
      } finally {
        generating.value = false
      }
    }

    // 模拟支付成功（用于测试）
    const handleSimulatePayment = async () => {
      if (!qrCodeInfo.value) return
      
      try {
        simulating.value = true
        
        await paymentApi.handlePaymentCallback({
          orderId: qrCodeInfo.value.orderId,
          status: 'SUCCESS'
        })
        
        currentOrderStatus.value = 1
        paymentStatus.value = 'success'
        
        ElMessage.success('支付成功！')
        
        // 刷新用户信息和订单
        await store.dispatch('user/getUserInfo')
        await fetchUserOrders()
        
        // 停止轮询
        stopStatusPolling()
        
      } catch (error) {
        console.error('模拟支付失败:', error)
        ElMessage.error('模拟支付失败')
      } finally {
        simulating.value = false
      }
    }

    // 查询支付状态
    const handleCheckStatus = async () => {
      if (!qrCodeInfo.value) return
      
      try {
        checking.value = true
        
        const response = await paymentApi.getPaymentStatus(qrCodeInfo.value.orderId)
        const data = response.data || response
        
        currentOrderStatus.value = data.status
        
        if (data.status === 1) {
          paymentStatus.value = 'success'
          ElMessage.success('支付已完成')
          await store.dispatch('user/getUserInfo')
          await fetchUserOrders()
          stopStatusPolling()
        } else if (data.status === 2) {
          paymentStatus.value = 'failed'
          ElMessage.warning('订单已取消')
          stopStatusPolling()
        } else if (data.status === 3) {
          paymentStatus.value = 'expired'
          ElMessage.warning('订单已过期')
          stopStatusPolling()
        } else {
          ElMessage.info('订单待支付')
        }
        
      } catch (error) {
        console.error('查询支付状态失败:', error)
        ElMessage.error('查询支付状态失败')
      } finally {
        checking.value = false
      }
    }

    // 开始状态轮询
    const startStatusPolling = () => {
      if (statusPollingTimer) {
        clearInterval(statusPollingTimer)
      }
      
      statusPollingTimer = setInterval(async () => {
        if (currentOrderStatus.value !== 0) {
          stopStatusPolling()
          return
        }
        
        try {
          const response = await paymentApi.getPaymentStatus(qrCodeInfo.value.orderId)
          const data = response.data || response
          
          currentOrderStatus.value = data.status
          
          if (data.status === 1) {
            paymentStatus.value = 'success'
            ElMessage.success('支付完成！')
            await store.dispatch('user/getUserInfo')
            await fetchUserOrders()
            stopStatusPolling()
          } else if (data.status === 2) {
            paymentStatus.value = 'failed'
            ElMessage.warning('订单已取消')
            stopStatusPolling()
          } else if (data.status === 3) {
            paymentStatus.value = 'expired'
            ElMessage.warning('订单已过期')
            stopStatusPolling()
          }
        } catch (error) {
          console.error('轮询支付状态失败:', error)
        }
      }, 3000) // 每3秒查询一次
    }

    // 停止状态轮询
    const stopStatusPolling = () => {
      if (statusPollingTimer) {
        clearInterval(statusPollingTimer)
        statusPollingTimer = null
      }
    }

    // 取消支付
    const handleCancelPayment = () => {
      paymentDialogVisible.value = false
      stopStatusPolling()
      qrCodeInfo.value = null
      paymentStatus.value = ''
      currentOrderStatus.value = -1
    }

    // 获取支付方式名称
    const getPaymentMethodName = (method) => {
      const names = {
        0: '微信支付',
        1: '支付宝',
        2: '银行卡'
      }
      return names[method] || '未知'
    }

    // 获取支付状态类型
    const getPaymentStatusType = () => {
      if (currentOrderStatus.value === 0) return 'warning'
      if (currentOrderStatus.value === 1) return 'success'
      return 'danger'
    }

    // 获取支付状态文本
    const getPaymentStatusText = () => {
      const texts = {
        [-1]: '未开始',
        [0]: '待支付',
        [1]: '已支付',
        [2]: '已取消',
        [3]: '已过期'
      }
      return texts[currentOrderStatus.value] || '未知'
    }

    // 获取订单状态类型
    const getOrderStatusType = (status) => {
      const types = {
        0: 'warning',
        1: 'success',
        2: 'danger',
        3: 'info'
      }
      return types[status] || 'info'
    }

    // 格式化日期
    const formatDate = (dateTime) => {
      if (!dateTime) return '-'
      return new Date(dateTime).toLocaleDateString('zh-CN')
    }

    // 格式化日期时间
    const formatDateTime = (dateTime) => {
      if (!dateTime) return '-'
      return new Date(dateTime).toLocaleString('zh-CN')
    }

    onUnmounted(() => {
      stopStatusPolling()
    })

    return {
      isLoggedIn,
      userInfo,
      vipPlans,
      userOrders,
      paymentDialogVisible,
      paymentMethod,
      selectedPlan,
      paymentStatus,
      qrCodeInfo,
      currentOrderStatus,
      generating,
      simulating,
      checking,
      getMonthlySavings,
      handleBuyPlan,
      handleConfirmPayment,
      handleSimulatePayment,
      handleCheckStatus,
      handleCancelPayment,
      getPaymentMethodName,
      getPaymentStatusType,
      getPaymentStatusText,
      getOrderStatusType,
      formatDate,
      formatDateTime
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
.vip-plans h3,
.my-orders h3 {
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.plan-card {
  position: relative;
  transition: transform 0.3s ease;
}

.plan-card.recommended {
  transform: scale(1.05);
  border: 2px solid var(--el-color-warning);
}

.plan-card:not(.recommended):hover {
  transform: translateY(-5px);
}

.popular-ribbon {
  position: absolute;
  top: 15px;
  right: -8px;
  background: linear-gradient(45deg, #409eff, #67c23a);
  color: white;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 3px;
  z-index: 1;
}

.popular-ribbon::after {
  content: '';
  position: absolute;
  bottom: -4px;
  right: 0;
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-top: 4px solid #2980b9;
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

.plan-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.plan-badge.basic {
  background: linear-gradient(45deg, #909399, #c0c4cc);
}

.plan-badge.popular {
  background: linear-gradient(45deg, #409eff, #67c23a);
}

.plan-badge.premium {
  background: linear-gradient(45deg, #f56c6c, #e6a23c);
}

.plan-price {
  text-align: center;
  margin: 20px 0 10px 0;
}

.currency {
  font-size: 16px;
  vertical-align: super;
  color: var(--el-text-color-secondary);
}

.amount {
  font-size: 36px;
  font-weight: bold;
  color: var(--el-color-danger);
}

.period {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.plan-discount {
  text-align: center;
  margin-bottom: 20px;
}

.plan-discount span {
  color: var(--el-color-success);
  font-size: 14px;
  font-weight: bold;
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

.my-orders {
  margin-top: 40px;
}

.orders-list {
  display: grid;
  gap: 15px;
}

.order-card {
  transition: transform 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-info {
  padding: 10px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-number {
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.order-details p {
  margin: 5px 0;
  color: var(--el-text-color-regular);
}

.order-details .amount {
  color: var(--el-color-danger);
  font-weight: bold;
}

.payment-dialog {
  text-align: center;
}

.payment-info {
  margin-bottom: 25px;
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
}

.payment-info h4 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: var(--el-text-color-primary);
}

.price-info {
  margin-bottom: 10px;
}

.current-price {
  font-size: 28px;
  font-weight: bold;
  color: var(--el-color-danger);
}

.period {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin-left: 5px;
}

.duration {
  margin: 0;
  color: var(--el-text-color-secondary);
}

.payment-methods {
  text-align: left;
  margin-bottom: 25px;
}

.payment-methods h4 {
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-option .el-icon {
  font-size: 18px;
}

.qrcode-section {
  margin: 25px 0;
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
}

.qrcode-section h4 {
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.qrcode-container {
  text-align: center;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  margin-bottom: 15px;
}

.qrcode-tip {
  color: var(--el-text-color-secondary);
  margin-bottom: 15px;
}

.payment-status {
  margin-bottom: 15px;
}

.order-details {
  text-align: left;
  background-color: var(--el-fill-color-light);
  padding: 15px;
  border-radius: 6px;
}

.order-details p {
  margin: 5px 0;
  color: var(--el-text-color-regular);
}

.order-details .amount {
  color: var(--el-color-danger);
  font-weight: bold;
}

.payment-result {
  margin: 20px 0;
  text-align: center;
}

.status-success,
.status-failed,
.status-expired {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
}

.status-success {
  color: var(--el-color-success);
  background-color: var(--el-color-success-light-9);
}

.status-failed {
  color: var(--el-color-danger);
  background-color: var(--el-color-danger-light-9);
}

.status-expired {
  color: var(--el-color-warning);
  background-color: var(--el-color-warning-light-9);
}

.status-success .el-icon,
.status-failed .el-icon,
.status-expired .el-icon {
  font-size: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
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

  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style> 