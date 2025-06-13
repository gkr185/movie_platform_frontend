<template>
  <div class="payment-sandbox">
    <div class="sandbox-header">
      <h3>{{ paymentMethod === 'wechat' ? '微信支付' : '支付宝' }}沙箱环境</h3>
      <el-tag type="warning">测试环境</el-tag>
    </div>

    <div class="payment-info">
      <div class="order-info">
        <p class="label">订单号：</p>
        <p class="value">{{ orderId }}</p>
      </div>
      <div class="order-info">
        <p class="label">支付金额：</p>
        <p class="value price">¥{{ amount }}</p>
      </div>
    </div>

    <div class="payment-actions">
      <el-button 
        type="success" 
        @click="handlePaySuccess"
        :loading="loading"
      >
        模拟支付成功
      </el-button>
      <el-button 
        type="danger" 
        @click="handlePayFail"
        :loading="loading"
      >
        模拟支付失败
      </el-button>
    </div>

    <div class="sandbox-tips">
      <h4>沙箱环境说明：</h4>
      <ul>
        <li>此页面仅用于测试支付流程</li>
        <li>不会产生实际支付行为</li>
        <li>可以使用测试账号进行支付测试</li>
        <li>支付结果会实时反馈到订单页面</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'PaymentSandbox',
  props: {
    orderId: {
      type: String,
      required: true
    },
    amount: {
      type: [Number, String],
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      validator: (value) => ['wechat', 'alipay'].includes(value)
    }
  },
  emits: ['payment-result'],
  setup(props, { emit }) {
    const loading = ref(false)

    const handlePaySuccess = async () => {
      loading.value = true
      try {
        // 模拟支付延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        emit('payment-result', {
          orderId: props.orderId,
          status: 'SUCCESS'
        })
        ElMessage.success('支付成功')
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        loading.value = false
      }
    }

    const handlePayFail = async () => {
      loading.value = true
      try {
        // 模拟支付延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        emit('payment-result', {
          orderId: props.orderId,
          status: 'FAILED'
        })
        ElMessage.error('支付失败')
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      handlePaySuccess,
      handlePayFail
    }
  }
}
</script>

<style scoped>
.payment-sandbox {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.sandbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.sandbox-header h3 {
  margin: 0;
  color: #303133;
}

.payment-info {
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.order-info {
  display: flex;
  margin-bottom: 10px;
}

.order-info:last-child {
  margin-bottom: 0;
}

.label {
  width: 80px;
  color: #606266;
  margin: 0;
}

.value {
  flex: 1;
  margin: 0;
  color: #303133;
}

.value.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

.payment-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.payment-actions .el-button {
  flex: 1;
}

.sandbox-tips {
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
}

.sandbox-tips h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.sandbox-tips ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.sandbox-tips li {
  margin-bottom: 5px;
}

.sandbox-tips li:last-child {
  margin-bottom: 0;
}
</style> 