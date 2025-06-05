<template>
  <div class="vip-center">
    <h2>会员中心</h2>
    
    <!-- 当前会员状态 -->
    <el-card class="vip-status">
      <div class="status-header">
        <div class="user-info">
          <img src="@/assets/vip-icon.png" class="vip-icon">
          <div class="info">
            <h3>普通会员</h3>
            <p>有效期至：2024-12-31</p>
          </div>
        </div>
        <div class="vip-benefits">
          <ul>
            <li><i class="el-icon-video-play"></i> 1080P高清视频</li>
            <li><i class="el-icon-download"></i> 支持下载</li>
            <li><i class="el-icon-close"></i> 无广告打扰</li>
          </ul>
        </div>
      </div>
    </el-card>

    <!-- 会员套餐 -->
    <div class="vip-plans">
      <h3>开通会员</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="(plan, index) in vipPlans" :key="index">
          <el-card class="plan-card" :class="{ 'recommended': plan.recommended }">
            <div class="plan-header">
              <h4>{{ plan.name }}</h4>
              <div class="price">
                <span class="currency">¥</span>
                <span class="amount">{{ plan.price }}</span>
                <span class="period">/{{ plan.period }}</span>
              </div>
            </div>
            <div class="plan-features">
              <p v-for="(feature, idx) in plan.features" :key="idx">
                <i class="el-icon-check"></i> {{ feature }}
              </p>
            </div>
            <el-button type="primary" class="buy-button" :class="{ 'is-recommended': plan.recommended }">
              立即开通
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserVIP',
  data() {
    return {
      vipPlans: [
        {
          name: '月度会员',
          price: '30',
          period: '月',
          features: [
            '1080P高清视频',
            '支持下载',
            '无广告'
          ]
        },
        {
          name: '年度会员',
          price: '298',
          period: '年',
          recommended: true,
          features: [
            '1080P高清视频',
            '支持下载',
            '无广告',
            '专属客服',
            '节省498元'
          ]
        },
        {
          name: '终身会员',
          price: '1598',
          period: '永久',
          features: [
            '1080P高清视频',
            '支持下载',
            '无广告',
            '专属客服',
            'VIP专享活动'
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.vip-center {
  h2, h3 {
    margin-bottom: 20px;
  }

  .vip-status {
    margin-bottom: 30px;

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;

      .vip-icon {
        width: 60px;
        height: 60px;
      }

      .info {
        h3 {
          margin: 0 0 5px;
        }
        p {
          margin: 0;
          color: #666;
        }
      }
    }

    .vip-benefits {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 8px;
          color: #666;

          i {
            color: #409EFF;
            margin-right: 5px;
          }
        }
      }
    }
  }

  .vip-plans {
    .plan-card {
      height: 100%;
      transition: all 0.3s;

      &.recommended {
        transform: translateY(-10px);
        border-color: #409EFF;
      }

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
    }

    .plan-header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;

      h4 {
        margin: 0 0 15px;
        font-size: 18px;
      }

      .price {
        .currency {
          font-size: 20px;
          vertical-align: super;
        }
        .amount {
          font-size: 36px;
          font-weight: bold;
          color: #409EFF;
        }
        .period {
          color: #999;
        }
      }
    }

    .plan-features {
      padding: 20px 0;

      p {
        margin: 10px 0;
        color: #666;

        i {
          color: #67C23A;
          margin-right: 5px;
        }
      }
    }

    .buy-button {
      width: 100%;

      &.is-recommended {
        background-color: #409EFF;
        border-color: #409EFF;
      }
    }
  }
}
</style> 