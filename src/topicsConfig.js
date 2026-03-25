// =============================================
// topicsConfig.js — 由 sync.js 自動產生
// 如需自訂 emoji、說明文字，請直接在此編輯
// =============================================

import 光電效應Simulation from './simulations/光電效應Simulation'
import 黑體輻射Simulation from './simulations/黑體輻射Simulation'

const topics = [
  {
    id: '光電效應',
    title: '光電效應',
    subtitle: '',
    emoji: '📘',
    tag: '物理',
    tagColor: 'bg-indigo-600',
    description: '點擊查看漫畫與互動模擬。',
    comics: [
    { file: './comics/光電效應/1.png', title: '1' },
    { file: './comics/光電效應/2.png', title: '2' },
    { file: './comics/光電效應/3.png', title: '3' },
    { file: './comics/光電效應/4.png', title: '4' },
    { file: './comics/光電效應/5.png', title: '5' },
    { file: './comics/光電效應/6.png', title: '6' },
    { file: './comics/光電效應/7.png', title: '7' },
    { file: './comics/光電效應/8.png', title: '8' },
    { file: './comics/光電效應/Gemini_Generated_Image_n1mb8kn1mb8kn1mb.png', title: 'Gemini Generated Image n1mb8kn1mb8kn1mb' }
    ],
    Simulation: 光電效應Simulation,
  },

  {
    id: '黑體輻射',
    title: '黑體輻射',
    subtitle: '',
    emoji: '📘',
    tag: '物理',
    tagColor: 'bg-indigo-600',
    description: '點擊查看漫畫與互動模擬。',
    comics: [
    { file: './comics/黑體輻射/1_黑體園遊會登場.png', title: '黑體園遊會登場' },
    { file: './comics/黑體輻射/2_為什麼高頻區的機台比較多？.png', title: '為什麼高頻區的機台比較多？' },
    { file: './comics/黑體輻射/3_園遊會的物理翻譯.png', title: '園遊會的物理翻譯' },
    { file: './comics/黑體輻射/4_古典物理：能量可以無限切分.png', title: '古典物理：能量可以無限切分' },
    { file: './comics/黑體輻射/5_紫外災難爆發.png', title: '紫外災難爆發' },
    { file: './comics/黑體輻射/6_普朗克的規則：不找零、不切割.png', title: '普朗克的規則：不找零、不切割' },
    { file: './comics/黑體輻射/7_波茲曼的冷酷現實.png', title: '波茲曼的冷酷現實' },
    { file: './comics/黑體輻射/8_完美的黑體輻射曲線.png', title: '完美的黑體輻射曲線' }
    ],
    Simulation: 黑體輻射Simulation,
  }
]

export default topics
