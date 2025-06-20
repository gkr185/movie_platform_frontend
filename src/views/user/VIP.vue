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

<style lang="scss" scoped>
.vip-container {
  min-height: 100%;
  background: var(--vip-bg);
  padding: 0;
  overflow-x: hidden;
}

.vip-header {
  position: relative;
  background: var(--vip-header-gradient);
  padding: 60px 0 40px;
  margin-bottom: 40px;
  text-align: center;
  overflow: hidden;

  // 装饰性背景图案
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    opacity: var(--vip-header-pattern-opacity);
  }

  h2 {
    position: relative;
    z-index: 1;
    margin: 0 0 20px;
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    text-shadow: var(--vip-header-text-shadow);
    letter-spacing: 1px;
  }

  .vip-status {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;

    .el-tag {
      font-size: 16px;
      padding: 8px 16px;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .expire-date {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      font-weight: 500;
      text-shadow: var(--vip-header-text-shadow);
    }
  }
}

.vip-benefits {
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 0 20px;

  h3 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-color);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: var(--vip-header-gradient);
      border-radius: 2px;
    }
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  .benefit-item {
    background: var(--vip-benefit-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 40px 30px;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s;
    }

    &:hover {
      transform: translateY(-8px) scale(1.02);
      background: var(--vip-benefit-hover-bg);
      box-shadow: var(--vip-card-hover-shadow);

      &::before {
        left: 100%;
      }

      .el-icon {
        transform: scale(1.2) rotate(360deg);
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 48px;
      color: var(--vip-benefit-icon-color);
      margin-bottom: 20px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: block;
    }

    h4 {
      margin: 0 0 15px;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
    }

    p {
      margin: 0;
      color: var(--text-color-light);
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

.vip-plans {
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 0 20px;

  h3 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-color);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: var(--vip-header-gradient);
      border-radius: 2px;
    }
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    align-items: stretch;
  }

  .plan-card {
    background: var(--vip-card-bg);
    border: 2px solid var(--border-color);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    height: 100%;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      transform: translateY(-10px);
      box-shadow: var(--vip-card-hover-shadow);
      border-color: var(--el-color-primary);

      &::before {
        opacity: 1;
      }
    }

    &.recommended {
      transform: scale(1.08);
      border-color: var(--el-color-primary);
      box-shadow: var(--vip-plan-recommended-shadow);
      z-index: 2;

      &:hover {
        transform: scale(1.08) translateY(-10px);
      }

      .popular-ribbon {
        background: var(--vip-plan-recommended-bg);
      }
    }

    :deep(.el-card__header) {
      padding: 30px 25px 15px; // 增加顶部padding为推荐标签留空间
      background: transparent;
      border-bottom: 1px solid var(--border-color);
      position: relative;
      overflow: visible; // 确保推荐标签可见
    }

    :deep(.el-card__body) {
      padding: 25px;
      display: flex;
      flex-direction: column;
      height: calc(100% - 80px);
    }
  }

  .popular-ribbon {
    position: absolute;
    top: 7px;
    right: -22px;
    background: var(--vip-plan-recommended-bg);
    color: white;
    padding: 5px 30px;
    font-size: 11px;
    font-weight: 700;
    transform: rotate(45deg);
    z-index: 4; // 提高z-index确保在最上层
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.5px;
    white-space: nowrap; // 防止文字换行
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding-top: 5px; // 为推荐标签留出空间

    h4 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
      flex: 1;
      padding-right: 10px; // 避免与右侧标签重叠
    }
  }

  .plan-badge {
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 700;
    color: white;
    letter-spacing: 0.5px;
    position: relative;
    z-index: 1; // 确保在推荐标签下方
    margin-top: 3px; // 稍微向下偏移避免重叠

    &.basic {
      background: var(--vip-plan-basic-bg);
    }

    &.popular {
      background: var(--vip-plan-recommended-bg);
      margin-right: 15px; // 为推荐标签留出更多空间
    }

    &.premium {
      background: var(--vip-plan-premium-bg);
    }
  }

  .plan-price {
    text-align: center;
    margin: 30px 0 20px;
    padding: 20px;
    background: var(--vip-price-bg);
    border-radius: 15px;
    position: relative;

    .currency {
      font-size: 20px;
      font-weight: 600;
      vertical-align: super;
      color: var(--vip-price-color);
    }

    .amount {
      font-size: 3rem;
      font-weight: 800;
      color: var(--vip-price-color);
      margin: 0 5px;
    }

    .period {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color-light);
    }
  }

  .plan-discount {
    text-align: center;
    margin-bottom: 25px;
    padding: 8px;
    background: var(--vip-discount-bg);
    border-radius: 10px;

    span {
      color: var(--vip-discount-color);
      font-size: 14px;
      font-weight: 700;
    }
  }

  .plan-features {
    flex: 1;
    margin: 20px 0;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
      color: var(--text-color);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;

      .el-icon {
        color: var(--el-color-success);
        font-size: 16px;
        flex-shrink: 0;
      }
    }
  }

  .buy-button {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    margin-top: auto;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
    }
  }
}

.my-orders {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;

  h3 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-color);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 2px;
      background: var(--vip-header-gradient);
      border-radius: 1px;
    }
  }

  .orders-list {
    display: grid;
    gap: 20px;
  }

  .order-card {
    background: var(--vip-card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--vip-card-hover-shadow);
      border-color: var(--el-color-primary-light-5);
    }
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
  }

  .order-number {
    font-weight: 700;
    color: var(--text-color);
    font-size: 16px;
  }

  .order-details {
    p {
      margin: 8px 0;
      color: var(--text-color);
      font-size: 14px;
      line-height: 1.5;

      strong {
        font-weight: 600;
        color: var(--text-color);
      }
    }

    .amount {
      color: var(--vip-price-color);
      font-weight: 700;
      font-size: 16px;
    }
  }
}

// 支付对话框样式
.payment-dialog {
  .payment-info {
    margin-bottom: 30px;
    padding: 25px;
    background: var(--vip-qrcode-bg);
    border: 1px solid var(--vip-payment-border);
    border-radius: 15px;

    h4 {
      margin: 0 0 20px;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
      text-align: center;
    }

    .price-info {
      text-align: center;
      margin-bottom: 15px;

      .current-price {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--vip-price-color);
      }

      .period {
        font-size: 18px;
        color: var(--text-color-light);
        margin-left: 8px;
      }
    }

    .duration {
      text-align: center;
      margin: 0;
      color: var(--text-color-light);
      font-size: 14px;
    }
  }

  .payment-methods {
    margin-bottom: 30px;

    h4 {
      margin-bottom: 20px;
      color: var(--text-color);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .el-radio-group {
      width: 100%;
    }

    :deep(.el-radio) {
      width: 100%;
      margin-bottom: 15px;
      padding: 15px;
      border: 2px solid var(--vip-payment-border);
      border-radius: 12px;
      transition: all 0.3s;

      &:hover {
        border-color: var(--vip-payment-hover-border);
        background: var(--vip-card-hover-bg);
      }

      &.is-checked {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }

      .el-radio__input {
        margin-right: 15px;
      }
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-color);

      .el-icon {
        font-size: 20px;
      }
    }
  }

  .qrcode-section {
    margin: 30px 0;
    padding: 30px;
    background: var(--vip-qrcode-bg);
    border: 1px solid var(--vip-payment-border);
    border-radius: 15px;

    h4 {
      margin-bottom: 25px;
      color: var(--text-color);
      font-size: 1.25rem;
      font-weight: 600;
      text-align: center;
    }

    .qrcode-container {
      text-align: center;

      .qrcode-image {
        width: 220px;
        height: 220px;
        border: 3px solid var(--border-color);
        border-radius: 15px;
        margin-bottom: 20px;
        transition: all 0.3s;

        &:hover {
          border-color: var(--el-color-primary);
          transform: scale(1.02);
        }
      }

      .qrcode-tip {
        color: var(--text-color-light);
        margin-bottom: 20px;
        font-size: 14px;
        line-height: 1.5;
      }

      .payment-status {
        margin-bottom: 20px;

        .el-tag {
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 8px;
        }
      }

      .order-details {
        background: var(--vip-card-bg);
        border: 1px solid var(--border-color);
        padding: 20px;
        border-radius: 12px;
        text-align: left;

        p {
          margin: 10px 0;
          color: var(--text-color);
          font-size: 14px;
          line-height: 1.5;

          &:first-child {
            margin-top: 0;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }

        .amount {
          color: var(--vip-price-color);
          font-weight: 700;
          font-size: 16px;
        }
      }
    }
  }

  .payment-result {
    margin: 25px 0;
    text-align: center;

    .status-success,
    .status-failed,
    .status-expired {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;

      .el-icon {
        font-size: 24px;
      }
    }

    .status-success {
      color: var(--vip-status-success-color);
      background: var(--vip-status-success-bg);
      border: 1px solid var(--vip-status-success-color);
    }

    .status-failed {
      color: var(--vip-status-danger-color);
      background: var(--vip-status-danger-bg);
      border: 1px solid var(--vip-status-danger-color);
    }

    .status-expired {
      color: var(--vip-status-warning-color);
      background: var(--vip-status-warning-bg);
      border: 1px solid var(--vip-status-warning-color);
    }
  }
}

:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;

  .el-dialog__header {
    background: var(--vip-header-gradient);
    color: white;
    padding: 20px 30px;
    text-align: center;

    .el-dialog__title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }
  }

  .el-dialog__body {
    padding: 30px;
    background: var(--vip-payment-bg);
  }

  .el-dialog__footer {
    padding: 20px 30px;
    background: var(--vip-payment-bg);
    border-top: 1px solid var(--border-color);

    .dialog-footer {
      display: flex;
      justify-content: center;
      gap: 15px;

      .el-button {
        padding: 12px 24px;
        font-weight: 600;
        border-radius: 8px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .vip-header {
    padding: 40px 20px 30px;

    h2 {
      font-size: 2rem;
    }
  }

  .vip-benefits,
  .vip-plans,
  .my-orders {
    padding: 0 15px;
  }

  .plans-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .plan-card.recommended {
    transform: none;

    &:hover {
      transform: translateY(-5px);
    }
  }
}

@media (max-width: 768px) {
  .vip-header {
    padding: 30px 15px 20px;

    h2 {
      font-size: 1.75rem;
    }

    .vip-status {
      flex-direction: column;
      gap: 10px;

      .el-tag {
        font-size: 14px;
        padding: 6px 12px;
      }
    }
  }

  .vip-benefits,
  .vip-plans,
  .my-orders {
    padding: 0 10px;

    h3 {
      font-size: 1.5rem;
    }
  }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .benefit-item {
    padding: 30px 20px;

    .el-icon {
      font-size: 40px;
    }
  }

  .plans-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .plan-price .amount {
    font-size: 2.5rem;
  }

  :deep(.el-dialog) {
    width: 95%;
    margin: 0 auto;

    .el-dialog__body {
      padding: 20px;
    }
  }

  .qrcode-section .qrcode-image {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .vip-header {
    h2 {
      font-size: 1.5rem;
    }
  }

  .benefit-item {
    padding: 25px 15px;
  }

  .plan-card :deep(.el-card__body) {
    padding: 20px;
  }

  .plan-price {
    margin: 20px 0 15px;
    padding: 15px;

    .amount {
      font-size: 2rem;
    }
  }

  .qrcode-section {
    padding: 20px;

    .qrcode-image {
      width: 160px;
      height: 160px;
    }
  }
}
</style> 