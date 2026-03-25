// =============================================
// 主題設定檔（由 sync.js 自動更新）
// 手動新增主題時也可以直接編輯這裡
// =============================================

import BlackbodySimulation from './simulations/BlackbodySimulation'
import PhotoelectricSimulation from './simulations/PhotoelectricSimulation'

const topics = [
  {
    id: 'blackbody',
    title: '黑體輻射',
    subtitle: '破解紫外災難的百年謎團',
    emoji: '🌡️',
    tag: '量子物理',
    tagColor: 'bg-purple-600',
    description: '用園遊會扭蛋機類比，理解普朗克如何用「能量量子化」解決紫外災難，推開量子力學的大門。',
    comics: [
      { file: './comics/黑體輻射/01_黑體園遊會登場.png',   title: '第一幕：黑體園遊會登場' },
      { file: './comics/黑體輻射/02_古典物理登場.png',     title: '第二幕：古典物理登場' },
      { file: './comics/黑體輻射/03_紫外災難爆發.png',     title: '第三幕：紫外災難爆發' },
      { file: './comics/黑體輻射/04_普朗克的救贖.png',     title: '第四幕：普朗克的救贖' },
      { file: './comics/黑體輻射/05_波茲曼的冷酷現實.png', title: '第五幕：波茲曼的冷酷現實' },
      { file: './comics/黑體輻射/06_完美的黑體輻射曲線.png', title: '最終幕：完美的黑體輻射曲線' },
    ],
    Simulation: BlackbodySimulation,
  },
  {
    id: 'photoelectric',
    title: '光電效應',
    subtitle: '愛因斯坦的光子革命',
    emoji: '⚡',
    tag: '量子物理',
    tagColor: 'bg-yellow-500',
    description: '用金屬夜店的類比，跟著老師走進去，親眼見證波動說的失敗與光子說的誕生，理解為什麼光是一顆一顆的。',
    comics: [
      { file: './comics/光電效應/01_金屬夜店門口.png',     title: '第一幕：金屬夜店門口' },
      { file: './comics/光電效應/02_波動說的預測.png',     title: '第二幕：波動說的預測' },
      { file: './comics/光電效應/03_等待.png',             title: '第三幕：等待' },
      { file: './comics/光電效應/04_頻率才是關鍵.png',     title: '第四幕：頻率才是關鍵' },
      { file: './comics/光電效應/05_光子保鑣登場.png',     title: '第五幕：光子保鑣登場' },
      { file: './comics/光電效應/06_剛好過門檻.png',       title: '第六幕：剛好過門檻' },
      { file: './comics/光電效應/07_停止電壓.png',         title: '第七幕：停止電壓' },
      { file: './comics/光電效應/08_愛因斯坦的諾貝爾獎.png', title: '第八幕：愛因斯坦的諾貝爾獎' },
    ],
    Simulation: PhotoelectricSimulation,
  },
]

export default topics
