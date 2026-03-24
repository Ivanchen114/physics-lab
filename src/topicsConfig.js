// =============================================
// 主題設定檔（由 sync.js 自動更新）
// 手動新增主題時也可以直接編輯這裡
// =============================================

import BlackbodySimulation from './simulations/BlackbodySimulation'

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

  // ---- 新增主題範例（取消註解並填寫）----
  // {
  //   id: 'photoelectric',
  //   title: '光電效應',
  //   subtitle: '愛因斯坦的光子革命',
  //   emoji: '⚡',
  //   tag: '量子物理',
  //   tagColor: 'bg-yellow-600',
  //   description: '...',
  //   comics: [ ... ],
  //   Simulation: PhotoelectricSimulation,
  // },
]

export default topics
