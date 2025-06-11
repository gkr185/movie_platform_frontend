// 电影数据
export const mockMovies = {
  hot: [
    { 
      id: 1, 
      title: '流浪地球2', 
      score: 8.6, 
      cover: '/uploads/posters/OIP-C.jpg',
      year: 2023,
      quality: '4K',
      resolution: 'ULTRA HD',
      tags: ['科幻', '冒险'],
      description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。',
      duration: '2小时53分钟',
      videoUrl: '/uploads/videos/movie-1.mp4',
      needVIP: true,
      supportedQualities: ['1080p', '4K'],
      defaultQuality: '1080p',
      subtitles: [
        { language: 'zh', url: '/uploads/subtitles/movie-1-zh.vtt' },
        { language: 'en', url: '/uploads/subtitles/movie-1-en.vtt' }
      ]
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
      description: '将门锁住是为了保护谁？少女铃芽邂逅了正在寻找神秘之门的青年草太，并跟随他踏上了一段奇妙的旅程。',
      duration: '2小时2分钟',
      videoUrl: '/uploads/videos/movie-7.mp4',
      needVIP: true,
      supportedQualities: ['1080p', '4K'],
      defaultQuality: '1080p',
      subtitles: [
        { language: 'zh', url: '/uploads/subtitles/movie-7-zh.vtt' },
        { language: 'en', url: '/uploads/subtitles/movie-7-en.vtt' }
      ]
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
      description: '一场谋杀案使银行家安迪蒙冤入狱，在肖申克监狱中他与瑞德结为好友，同时不断地谋划着逃跑的计划。',
      duration: '2小时22分钟',
      videoUrl: '/uploads/videos/movie-13.mp4'
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
      poster: '/uploads/posters/wdzsj.jpg',
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
    username: '123',
    password: '123123',
    name: '测试用户',
    avatar:  '/uploads/avatars/avatar.jpg',
    email: 'test123@example.com',
    vip: true,
    vipExpireDate: '2024-12-31',
    watchHistory: [
      {
        id: 1,
        title: '流浪地球2',
        cover: '/uploads/posters/wdzsj.jpg',
        watchTime: '2024-01-20T14:30:00.000Z',
        progress: 0.8,
        duration: '173分钟',
        quality: '4K',
        lastPosition: 8280 // 173分钟 * 0.8 * 60
      },
      {
        id: 2,
        title: '满江红',
        cover: 'https://img.movie.com/full-river-red.jpg',
        watchTime: '2024-01-19T20:00:00.000Z',
        progress: 1,
        duration: '159分钟',
        quality: '4K',
        lastPosition: 9540 // 159分钟 * 60
      },
      {
        id: 3,
        title: '无名',
        cover: 'https://img.movie.com/anonymous.jpg',
        watchTime: '2024-01-18T19:15:00.000Z',
        progress: 0.6,
        duration: '128分钟',
        quality: '4K',
        lastPosition: 4608 // 128分钟 * 0.6 * 60
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
  },
  admin: {
    id: 2,
    username: 'aaa',
    password: '123123',
    name: '管理员',
    avatar:  '/uploads/avatars/avatar.jpg',
    email: 'admin@example.com',
    vip: true,
    vipExpireDate: '2025-12-31',
    watchHistory: [],
    favorites: [],
    settings: {
      theme: 'dark',
      playbackQuality: '4K',
      autoPlay: true,
      notifications: true
    }
  },
  user1: {
    id: 3,
    username: '111',
    password: '123123',
    name: '普通用户',
    avatar: '',
    email: 'user1@example.com',
    vip: false,
    watchHistory: [],
    favorites: [],
    settings: {
      theme: 'light',
      playbackQuality: '1080p',
      autoPlay: true,
      notifications: true
    }
  }
}

// 注册用户存储
export const registeredUsers = new Map()
Object.values(mockUsers).forEach(user => {
  registeredUsers.set(user.username, user)
})

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

// 评论数据
export const mockComments = new Map([
  [1, [ // 电影ID为1的评论
    {
      id: 101,
      content: '特效太震撼了！郭帆导演和团队的工业精神令人敬佩，这就是中国科幻电影的未来！',
      score: 9,
      createTime: '2024-01-20T14:30:00.000Z',
      likes: 256,
      isLiked: false,
      isPrivate: false,
      user: {
        id: 1,
        name: '测试用户',
        avatar: '/uploads/avatars/avatar.jpg',
        isVIP: true
      },
      replies: [
        {
          id: 1001,
          content: '同意！尤其是月球基地那段，太震撼了！',
          createTime: '2024-01-20T15:00:00.000Z',
          user: {
            id: 3,
            name: '普通用户',
            avatar: '',
            isVIP: false
          }
        },
        {
          id: 1002,
          content: '期待流浪地球3！',
          createTime: '2024-01-20T15:30:00.000Z',
          user: {
            id: 2,
            name: '管理员',
            avatar: '/uploads/avatars/avatar.jpg',
            isVIP: true
          },
          replyTo: {
            id: 3,
            name: '普通用户'
          }
        }
      ],
      replyCount: 2
    },
    {
      id: 102,
      content: '剧情紧凑，演员演技在线。吴京和刘德华的对手戏很精彩，李雪健老师的表演更是实力派！',
      score: 8.5,
      createTime: '2024-01-21T09:15:00.000Z',
      likes: 128,
      isLiked: false,
      isPrivate: false,
      user: {
        id: 2,
        name: '管理员',
        avatar: '/uploads/avatars/avatar.jpg',
        isVIP: true
      },
      replies: [],
      replyCount: 0
    },
    {
      id: 103,
      content: '故事情节有些复杂，但是制作水准确实很高。',
      score: 7.5,
      createTime: '2024-01-21T10:20:00.000Z',
      likes: 64,
      isLiked: false,
      isPrivate: false,
      user: {
        id: 3,
        name: '普通用户',
        avatar: '',
        isVIP: false
      },
      replies: [],
      replyCount: 0
    }
  ]],
  [2, [ // 电影ID为2的评论
    {
      id: 201,
      content: '张艺谋导演的悬疑手法越来越成熟了，节奏把控得很好！',
      score: 8.5,
      createTime: '2024-01-22T13:40:00.000Z',
      likes: 189,
      isLiked: false,
      isPrivate: false,
      user: {
        id: 1,
        name: '测试用户',
        avatar: '/uploads/avatars/avatar.jpg',
        isVIP: true
      },
      replies: [],
      replyCount: 0
    }
  ]],
  [3, [ // 电影ID为3的评论
    {
      id: 301,
      content: '王一博的表演有突破，整体节奏很紧凑，是一部不错的谍战片！',
      score: 8.0,
      createTime: '2024-01-23T16:50:00.000Z',
      likes: 145,
      isLiked: false,
      isPrivate: false,
      user: {
        id: 2,
        name: '管理员',
        avatar: '/uploads/avatars/avatar.jpg',
        isVIP: true
      },
      replies: [],
      replyCount: 0
    }
  ]]
])

// 评论回复的模拟数据
export const mockReplies = new Map([
  [101, [ // 评论ID为101的回复
    {
      id: 1001,
      content: '同意！尤其是月球基地那段，太震撼了！',
      createTime: '2024-01-20T15:00:00.000Z',
      user: {
        id: 3,
        name: '普通用户',
        avatar: '',
        isVIP: false
      }
    },
    {
      id: 1002,
      content: '期待流浪地球3！',
      createTime: '2024-01-20T15:30:00.000Z',
      user: {
        id: 2,
        name: '管理员',
        avatar: '/uploads/avatars/avatar.jpg',
        isVIP: true
      },
      replyTo: {
        id: 3,
        name: '普通用户'
      }
    }
  ]]
])

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
