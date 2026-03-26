// =============================================
// topicsConfig.js — 由 sync.js 自動產生
// 如需修改說明文字、emoji，請直接在 topicsConfig.js 編輯
// 下次執行 sync.js 會自動保留這些欄位
// =============================================

import 光電效應Simulation from './simulations/光電效應Simulation'
import 物質波Simulation from './simulations/物質波Simulation'
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
    id: '物質波',
    title: '物質波',
    subtitle: '德布羅意的革命：粒子也是波',
    emoji: '🌊',
    tag: '量子物理',
    tagColor: 'bg-cyan-600',
    description: '電子為什麼有干涉條紋？棒球為什麼沒有？用雙縫實驗親眼看懂量子世界的機率本質。',
    comics: [
    { file: './comics/物質波/01_每個人都有波長：德布羅意的大膽猜想.png', title: '每個人都有波長：德布羅意的大膽猜想' },
    { file: './comics/物質波/02_電子為什麼看不到波：波長太短，無法察覺.png', title: '電子為什麼看不到波：波長太短，無法察覺' },
    { file: './comics/物質波/03_棒球的波長：比原子核還小的荒謬數字.png', title: '棒球的波長：比原子核還小的荒謬數字' },
    { file: './comics/物質波/04_雙縫實驗：電子真的同時通過兩條縫.png', title: '雙縫實驗：電子真的同時通過兩條縫' },
    { file: './comics/物質波/05_一顆一顆射：隨機的落點，規律的條紋.png', title: '一顆一顆射：隨機的落點，規律的條紋' },
    { file: './comics/物質波/06_偷看就消失：觀測本身改變了結果.png', title: '偷看就消失：觀測本身改變了結果' },
    { file: './comics/物質波/07_物質波的本質：機率波，不是真實的振動.png', title: '物質波的本質：機率波，不是真實的振動' },
    { file: './comics/物質波/08_物質波的振幅，不是電子變大變小也不是電子震動.png', title: '物質波的振幅，不是電子變大變小也不是電子震動' },
    { file: './comics/物質波/09_亮紋與暗紋，其實是在看 |ψ|² 有多大.png', title: '亮紋與暗紋，其實是在看 |ψ|² 有多大' },
    { file: './comics/物質波/10_物質波告訴我們：世界不是只有一種看法.png', title: '物質波告訴我們：世界不是只有一種看法' }
    ],
    Simulation: 物質波Simulation,
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
    { file: './comics/黑體輻射/01_黑體園遊會登場.png', title: '黑體園遊會登場' },
    { file: './comics/黑體輻射/02_為什麼高頻區的機台比較多.png', title: '為什麼高頻區的機台比較多' },
    { file: './comics/黑體輻射/03_園遊會的物理翻譯.png', title: '園遊會的物理翻譯' },
    { file: './comics/黑體輻射/04_古典物理_能量可以無限切分.png', title: '古典物理 能量可以無限切分' },
    { file: './comics/黑體輻射/05_紫外災難爆發.png', title: '紫外災難爆發' },
    { file: './comics/黑體輻射/06_小普的新規則_不找零不切割.png', title: '小普的新規則 不找零不切割' },
    { file: './comics/黑體輻射/07_波茲曼的冷酷現實_越貴越難被啟動.png', title: '波茲曼的冷酷現實 越貴越難被啟動' },
    { file: './comics/黑體輻射/08_完美的黑體輻射曲線.png', title: '完美的黑體輻射曲線' }
    ],
    Simulation: 黑體輻射Simulation,
  }
]

export default topics
