import request from '@/utils/request'
import { API_URLS } from './config'

// 获取图片广告列表
export const getImageAds = () => {
  console.log('调用获取图片广告API:', API_URLS.AD.IMAGES)
  return request({
    url: API_URLS.AD.IMAGES,
    method: 'get'
  })
}

// 获取随机视频广告
export const getVideoAds = () => {
  console.log('调用获取随机视频广告API:', API_URLS.AD.VIDEO_RANDOM)
  return request({
    url: API_URLS.AD.VIDEO_RANDOM,
    method: 'get'
  })
}

// 随机获取一个视频广告
export const getRandomVideoAd = async () => {
  try {
    console.log('请求随机视频广告')
    const response = await adApi.get(API_URLS.AD.VIDEO_RANDOM)
    console.log('随机视频广告响应:', response.data)
    return response.data
  } catch (error) {
    console.error('获取随机视频广告失败:', error.message)
    throw error
  }
}

export default {
  getImageAds,
  getRandomVideoAd
}
