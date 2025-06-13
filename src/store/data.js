

// VIP套餐数据
export const mockVIPPlans = [
  {
    id: 1,
    name: '月度会员',
    price: 30,
    originalPrice: 45,
    duration: 1,
    features: [
      '1080P高清画质',
      '去除广告',
      '支持投屏',
      '优先客服'
    ]
  },
  {
    id: 2,
    name: '季度会员',
    price: 88,
    originalPrice: 135,
    duration: 3,
    features: [
      '1080P高清画质',
      '去除广告',
      '支持投屏',
      '优先客服',
      '赠送电影券x2'
    ]
  },
  {
    id: 3,
    name: '年度会员',
    price: 298,
    originalPrice: 540,
    duration: 12,
    features: [
      '4K超清画质',
      '去除广告',
      '支持投屏',
      'VIP专属客服',
      '赠送电影券x12',
      '生日特权'
    ],
    recommended: true
  }
]





// 轮播图数据
export const mockBanners = [
  {
    id: 1,
    title: '流浪地球2',
    subtitle: '2023开年科幻巨制',
    description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。',
    image: '/uploads/banners/163789.jpg',
    link: '/movie/1',
    score: 8.6,
    year: 2023,
    quality: '4K',
    resolution: 'ULTRA HD',
    tags: ['科幻', '冒险'],
    active: true
  },
  {
    id: 2,
    title: '满江红',
    subtitle: '张艺谋悬疑巨作',
    description: '南宋绍兴年间，岳飞死后四年，秦桧率领的贪腐集团逐渐瓦解。一个汴京城小兵，为了给兄长报仇，与一个落魄的御前带刀侍卫联手，调查一桩离奇命案，深入危机四伏的权力之局。',
    image: '/uploads/banners/full-river-red.jpg',
    link: '/movie/2',
    score: 8.2,
    year: 2023,
    quality: '4K',
    resolution: 'ULTRA HD',
    tags: ['悬疑', '剧情'],
    active: true
  },
  {
    id: 3,
    title: '铃芽之旅',
    subtitle: '新海诚最新力作',
    description: '将门锁住是为了保护谁？少女铃芽邂逅了正在寻找神秘之门的青年草太，并跟随他踏上了一段奇妙的旅程。',
    image: '/uploads/banners/suzume.jpg',
    link: '/movie/7',
    score: 8.3,
    quality: '4K',
    resolution: 'ULTRA HD',
    tags: ['动画', '奇幻'],
    active: true
  },
  {
    id: 4,
    title: '新会员特惠',
    subtitle: '限时优惠',
    description: '新用户注册即可享受会员7天免费试用，还可获得观影券一张。活动期间开通年度会员还可享受8.8折优惠。',
    image: '/uploads/banners/vip-promotion.jpg',
    link: '/user/vip',
    type: 'promotion',
    active: true
  }
]
