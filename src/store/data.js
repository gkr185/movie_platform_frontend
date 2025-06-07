// 电影数据
export const mockMovies = {
  hot: [
    { 
      id: 1, 
      title: '流浪地球2', 
      score: 8.6, 
      cover: require('@/assets/wdzsj.jpg'),
      year: 2023,
      quality: '4K',
      resolution: 'ULTRA HD',
      tags: ['科幻', '冒险'],
      description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。'
    },
    { 
      id: 2, 
      title: '满江红', 
      score: 8.2, 
      cover: 'https://img.movie.com/full-river-red.jpg',
      year: 2023,
      quality: '4K',
      resolution: 'ULTRA HD',
      tags: ['悬疑', '剧情'],
      description: '南宋绍兴年间，岳飞死后四年，秦桧率领的贪腐集团逐渐瓦解。一个汴京城小兵，为了给兄长报仇，与一个落魄的御前带刀侍卫联手，调查一桩离奇命案，深入危机四伏的权力之局。'
    },
    { 
      id: 3, 
      title: '无名', 
      score: 7.8, 
      cover: 'https://img.movie.com/anonymous.jpg',
      year: 2023,
      quality: '4K',
      resolution: 'ULTRA HD',
      tags: ['谍战', '动作'],
      description: '上世纪30年代，四位不同经历的年轻人，为了共同的信仰，在"隐身"状态下，与日本特务机关展开惊心动魄的隐秘战争。'
    },
    { id: 4, title: '中国乒乓', score: 8.1, cover: 'https://img.movie.com/ping-pong.jpg' },
    { id: 5, title: '保你平安', score: 7.9, cover: 'https://img.movie.com/safe-with-me.jpg' },
    { id: 6, title: '交换人生', score: 8.0, cover: 'https://img.movie.com/life-swap.jpg' }
  ],
  new: [
    { 
      id: 7, 
      title: '铃芽之旅', 
      score: 8.3, 
      cover: 'https://img.movie.com/suzume.jpg',
      year: 2023,
      quality: '4K',
      resolution: 'ULTRA HD',
      tags: ['动画', '奇幻'],
      description: '将门锁住是为了保护谁？少女铃芽邂逅了正在寻找神秘之门的青年草太，并跟随他踏上了一段奇妙的旅程。'
    },
    { 
      id: 8, 
      title: '蚁人与黄蜂女', 
      score: 7.5, 
      cover: 'https://img.movie.com/ant-man.jpg',
      year: 2023,
      quality: '4K',
      resolution: 'ULTRA HD',
      tags: ['科幻', '动作'],
      description: '蚁人斯科特和女儿凯茜、黄蜂女霍普和皮姆博士一家意外进入量子领域，开启了一场惊心动魄的冒险。'
    },
    { id: 9, title: '阿凡达2', score: 8.7, cover: 'https://img.movie.com/avatar-2.jpg' },
    { id: 10, title: '泰坦尼克号重映', score: 9.5, cover: 'https://img.movie.com/titanic.jpg' },
    { id: 11, title: '深海', score: 8.2, cover: 'https://img.movie.com/deep-sea.jpg' },
    { id: 12, title: '熊出没·伴我熊芯', score: 7.8, cover: 'https://img.movie.com/boonie-bears.jpg' }
  ],
  recommended: [
    { 
      id: 13, 
      title: '肖申克的救赎', 
      score: 9.7, 
      cover: 'https://img.movie.com/shawshank.jpg',
      year: 1994,
      quality: '4K',
      resolution: 'ULTRA HD',
      tags: ['剧情', '犯罪'],
      description: '一场谋杀案使银行家安迪蒙冤入狱，在肖申克监狱中他与瑞德结为好友，同时不断地谋划着逃跑的计划。'
    },
    { id: 14, title: '霸王别姬', score: 9.6, cover: 'https://img.movie.com/farewell.jpg' },
    { id: 15, title: '阿甘正传', score: 9.5, cover: 'https://img.movie.com/forrest-gump.jpg' },
    { id: 16, title: '泰坦尼克号', score: 9.4, cover: 'https://img.movie.com/titanic-old.jpg' },
    { id: 17, title: '这个杀手不太冷', score: 9.4, cover: 'https://img.movie.com/leon.jpg' },
    { id: 18, title: '千与千寻', score: 9.4, cover: 'https://img.movie.com/spirited-away.jpg' }
  ]
}

// 广告数据
export const mockAds = [
  {
    title: '新年特惠',
    description: '开通会员享受8折优惠',
    image: '/ads/new-year.jpg',
    tag: '限时',
    showInfo: true,
    link: '/vip'
  },
  {
    title: '新片推荐',
    description: '最新好莱坞大片',
    image: '/ads/new-movie.jpg',
    showInfo: true,
    link: '/movie/123'
  },
  {
    title: '活动专区',
    description: '参与互动赢取好礼',
    image: '/ads/activity.jpg',
    tag: '活动',
    showInfo: true,
    link: '/activity'
  }
]

// 排行榜数据
export const mockRankings = {
  hot: [
    {
      id: 1,
      rank: 1,
      title: "流浪地球2",
      poster: require('@/assets/wdzsj.jpg'),
      hot: 9999,
      change: 0
    },
    {
      id: 2,
      rank: 2,
      title: "满江红",
      poster: "https://img.movie.com/full-river-red.jpg",
      hot: 9888,
      change: 1
    },
    {
      id: 3,
      rank: 3,
      title: "无名",
      poster: "https://img.movie.com/anonymous.jpg",
      hot: 9777,
      change: -1
    }
  ],
  score: [
    {
      id: 13,
      rank: 1,
      title: "肖申克的救赎",
      poster: "https://img.movie.com/shawshank.jpg",
      score: 9.7,
      change: 0
    },
    {
      id: 14,
      rank: 2,
      title: "霸王别姬",
      poster: "https://img.movie.com/farewell.jpg",
      score: 9.6,
      change: 0
    },
    {
      id: 15,
      rank: 3,
      title: "阿甘正传",
      poster: "https://img.movie.com/forrest-gump.jpg",
      score: 9.5,
      change: 1
    }
  ]
}

// 用户数据
export const mockUsers = {
  test: {
    id: 1,
    name: '测试用户',
    avatar: require('@/assets/avatar.jpg'),
    email: 'test@example.com',
    vip: true,
    vipExpireDate: '2024-12-31',
    watchHistory: [
      {
        id: 1,
        title: '流浪地球2',
        cover: require('@/assets/wdzsj.jpg'),
        watchTime: '2024-01-20 14:30',
        progress: 0.8
      },
      {
        id: 2,
        title: '满江红',
        cover: 'https://img.movie.com/full-river-red.jpg',
        watchTime: '2024-01-19 20:00',
        progress: 1
      },
      {
        id: 3,
        title: '无名',
        cover: 'https://img.movie.com/anonymous.jpg',
        watchTime: '2024-01-18 19:15',
        progress: 0.6
      }
    ],
    favorites: [
      {
        id: 13,
        title: '肖申克的救赎',
        cover: 'https://img.movie.com/shawshank.jpg',
        addTime: '2024-01-15 10:30',
        score: 9.7
      },
      {
        id: 14,
        title: '霸王别姬',
        cover: 'https://img.movie.com/farewell.jpg',
        addTime: '2024-01-14 16:45',
        score: 9.6
      },
      {
        id: 15,
        title: '阿甘正传',
        cover: 'https://img.movie.com/forrest-gump.jpg',
        addTime: '2024-01-13 20:20',
        score: 9.5
      }
    ],
    settings: {
      theme: 'light',
      playbackQuality: '1080p',
      autoPlay: true,
      notifications: true
    }
  }
}

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
