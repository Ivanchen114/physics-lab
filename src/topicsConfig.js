// =============================================
// topicsConfig.js — 由 sync.js 自動產生
// 如需修改說明文字、emoji，請直接在 topicsConfig.js 編輯
// 下次執行 sync.js 會自動保留這些欄位
// =============================================

import 光電效應Simulation from './simulations/光電效應Simulation'
import 黑體輻射Simulation from './simulations/黑體輻射Simulation'

const topics = [
  {
    id: '光電效應',
    title: '光電效應',
    subtitle: '愛因斯坦的光子革命',
    emoji: '⚡',
    tag: '量子物理',
    tagColor: 'bg-yellow-500',
    description: '用金屬夜店的類比，親眼見證波動說的失敗與光子說的誕生，理解為什麼光是一顆一顆的。',
    comics: [
    { file: './comics/光電效應/1_金屬夜店門口.png', title: '金屬夜店門口' },
    { file: './comics/光電效應/2_波動說的預測.png', title: '波動說的預測' },
    { file: './comics/光電效應/3_等待.png', title: '等待' },
    { file: './comics/光電效應/4_頻率才是關鍵.png', title: '頻率才是關鍵' },
    { file: './comics/光電效應/5_光子保鑣登場.png', title: '光子保鑣登場' },
    { file: './comics/光電效應/6_剛好過門檻.png', title: '剛好過門檻' },
    { file: './comics/光電效應/7_停止電壓.png', title: '停止電壓' },
    { file: './comics/光電效應/8_愛因斯坦的諾貝爾獎.png', title: '愛因斯坦的諾貝爾獎' }
    ],
    Simulation: 光電效應Simulation,
  },

  {
    id: '黑體輻射',
    title: '黑體輻射',
    subtitle: '破解紫外災難的百年謎團',
    emoji: '🌡️',
    tag: '量子物理',
    tagColor: 'bg-purple-600',
    description: '用園遊會扭蛋機類比，理解普朗克如何用「能量量子化」解決紫外災難，推開量子力學的大門。',
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
