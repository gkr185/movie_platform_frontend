import request from '@/utils/request'

const BASE_URL = '/api/payment'

export const paymentApi = {
  /**
   * 生成支付订单和二维码
   * @param {Object} data - 支付请求数据
   * @param {number} data.userId - 用户ID
   * @param {number} data.planId - VIP套餐ID (1:月度 2:季度 3:年度)
   * @param {number} data.amount - 支付金额
   * @param {number} data.paymentMethod - 支付方式 (0:微信 1:支付宝 2:银行卡)
   */
  generateQRCode(data) {
    return request({
      url: `${BASE_URL}/generate-qrcode`,
      method: 'post',
      data
    })
  },

  /**
   * 查询支付状态
   * @param {string} orderId - 订单号
   */
  getPaymentStatus(orderId) {
    return request({
      url: `${BASE_URL}/status/${orderId}`,
      method: 'get'
    })
  },

  /**
   * 支付回调处理
   * @param {Object} data - 回调数据
   * @param {string} data.orderId - 订单号
   * @param {string} data.status - 支付状态 (SUCCESS:成功 FAILED:失败)
   */
  handlePaymentCallback(data) {
    return request({
      url: `${BASE_URL}/callback`,
      method: 'post',
      data
    })
  },

  /**
   * 获取用户订单列表
   * @param {number} userId - 用户ID
   * @param {number} page - 页码，从0开始
   * @param {number} size - 每页大小
   */
  getUserOrders(userId, page = 0, size = 10) {
    return request({
      url: `${BASE_URL}/users/${userId}/orders`,
      method: 'get',
      params: { page, size }
    })
  },

  /**
   * 根据订单号获取订单详情
   * @param {string} orderNumber - 订单号
   */
  getOrderByNumber(orderNumber) {
    return request({
      url: `${BASE_URL}/orders/by-number/${orderNumber}`,
      method: 'get'
    })
  },

  /**
   * 取消订单
   * @param {number} orderId - 订单ID
   */
  cancelOrder(orderId) {
    return request({
      url: `${BASE_URL}/orders/${orderId}/cancel`,
      method: 'put'
    })
  },

  /**
   * 获取订单详情
   * @param {number} orderId - 订单ID
   */
  getOrderDetail(orderId) {
    return request({
      url: `${BASE_URL}/orders/${orderId}`,
      method: 'get'
    })
  }
}

export default paymentApi 