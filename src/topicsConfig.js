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
    { file: './comics/光電效應/01_夜店裡很熱鬧：那些藍色小人到底是誰.png', title: '夜店裡很熱鬧：那些藍色小人到底是誰' },
    { file: './comics/光電效應/02_出口前的那一階：電子不是不能動，是卡在最後這一下.png', title: '出口前的那一階：電子不是不能動，是卡在最後這一下' },
    { file: './comics/光電效應/03_阿波的想法：如果光一直推，電子應該能慢慢存夠力氣.png', title: '阿波的想法：如果光一直推，電子應該能慢慢存夠力氣' },
    { file: './comics/光電效應/04_等了又等：很強、很久，卻還是沒人出去.png', title: '等了又等：很強、很久，卻還是沒人出去' },
    { file: './comics/光電效應/05_轉折：不是更大聲，而是頻率變高了.png', title: '轉折：不是更大聲，而是頻率變高了' },
    { file: './comics/光電效應/06_講不通了：如果不是慢慢存，能量到底怎麼過去的.png', title: '講不通了：如果不是慢慢存，能量到底怎麼過去的' },
    { file: './comics/光電效應/07_先分清楚兩件事：來得多，不代表每一個都夠強.png', title: '先分清楚兩件事：來得多，不代表每一個都夠強' },
    { file: './comics/光電效應/08_光子登場：每一顆光帶多少能量，要看它的頻率.png', title: '光子登場：每一顆光帶多少能量，要看它的頻率' },
    { file: './comics/光電效應/09_先過門檻，再談剩多少：電子帶出去的速度從哪裡來.png', title: '先過門檻，再談剩多少：電子帶出去的速度從哪裡來' },
    { file: './comics/光電效應/10_把它剛好擋住：停止電壓是怎麼量出來的.png', title: '把它剛好擋住：停止電壓是怎麼量出來的' },
    { file: './comics/光電效應/11_從夜店門檻到停止電壓：光電效應終於串起來了.png', title: '從夜店門檻到停止電壓：光電效應終於串起來了' }
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
