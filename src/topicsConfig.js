// =============================================
// topicsConfig.js — 由 sync.js 自動產生
// 如需修改說明文字、emoji，請直接在 topicsConfig.js 編輯
// 下次執行 sync.js 會自動保留這些欄位
// =============================================

import 黑體輻射Simulation from './simulations/01_黑體輻射Simulation'
import 光電效應Simulation from './simulations/02_光電效應Simulation'

const topics = [
  {
    id: '01_黑體輻射',
    title: '01_黑體輻射',
    subtitle: '破解紫外災難的百年謎團',
    emoji: '🌡️',
    tag: '量子物理',
    tagColor: 'bg-purple-600',
    description: '用園遊會扭蛋機類比，理解普朗克如何用「能量量子化」解決紫外災難，推開量子力學的大門。',
    comics: [
    { file: './comics/01_黑體輻射/1.png', title: '黑體園遊會開場' },
    { file: './comics/01_黑體輻射/10.png', title: '越高頻，越難被啟動' },
    { file: './comics/01_黑體輻射/11.png', title: '兩股力量同時存在' },
    { file: './comics/01_黑體輻射/12.png', title: '低頻、中頻、高頻各自扮演不同角色' },
    { file: './comics/01_黑體輻射/13.png', title: '峰值不是巧合，而是平衡點' },
    { file: './comics/01_黑體輻射/14.png', title: '古典曲線錯在哪裡？' },
    { file: './comics/01_黑體輻射/15.png', title: '黑體輻射曲線真正的樣子' },
    { file: './comics/01_黑體輻射/2.png', title: '高頻區為什麼機台特別多？' },
    { file: './comics/01_黑體輻射/3.png', title: '把園遊會翻成物理語言' },
    { file: './comics/01_黑體輻射/4.png', title: '古典理論的直覺：能量可以平均分' },
    { file: './comics/01_黑體輻射/5.png', title: '合理的想法，為什麼會變成災難？' },
    { file: './comics/01_黑體輻射/6.png', title: '紫外災難爆發' },
    { file: './comics/01_黑體輻射/7.png', title: '真正的問題：能量被分得太隨便' },
    { file: './comics/01_黑體輻射/8.png', title: '小普登場：能量不能無限切割' },
    { file: './comics/01_黑體輻射/9.png', title: '規則一改，高頻區 suddenly 冷下來' }
    ],
    Simulation: 黑體輻射Simulation,
  },

  {
    id: '02_光電效應',
    title: '02_光電效應',
    subtitle: '愛因斯坦的光子革命',
    emoji: '⚡',
    tag: '量子物理',
    tagColor: 'bg-yellow-500',
    description: '用金屬夜店的類比，親眼見證波動說的失敗與光子說的誕生，理解為什麼光是一顆一顆的。',
    comics: [
    { file: './comics/02_光電效應/1.png', title: '金屬夜店裡，那些藍色小人呈現出來的是什麼？' },
    { file: './comics/02_光電效應/10.png', title: '先跨過門檻，再談剩下多少：電子的速度從哪裡來？' },
    { file: './comics/02_光電效應/11.png', title: '最大動能公式出現：KEmax = hν − φ' },
    { file: './comics/02_光電效應/12.png', title: '新的問題來了：電子出去後到底剩多少，怎麼量？' },
    { file: './comics/02_光電效應/13.png', title: '停止電壓：把它剛好擋住，就量到了臨界點' },
    { file: './comics/02_光電效應/14.png', title: 'eV₀ = KEmax：量到電壓，就量到了最大動能' },
    { file: './comics/02_光電效應/15.png', title: '從夜店門檻到停止電壓，整個光電效應終於接起來了' },
    { file: './comics/02_光電效應/2.png', title: '電子不是不能動，而是被出口前的門檻擋住' },
    { file: './comics/02_光電效應/3.png', title: '阿波的想法：光一直推，電子應該能慢慢累積能量' },
    { file: './comics/02_光電效應/4.png', title: '低頻很強、照很久，出口前卻還是沒人成功' },
    { file: './comics/02_光電效應/5.png', title: '低頻再亮也沒用，時間沒有替它翻盤' },
    { file: './comics/02_光電效應/6.png', title: '真正改變結果的，不是更亮，而是頻率變高' },
    { file: './comics/02_光電效應/7.png', title: '如果不是慢慢累積，那能量到底怎麼傳過去？' },
    { file: './comics/02_光電效應/8.png', title: '先分清楚兩件事：數量多，不代表每一個都夠強' },
    { file: './comics/02_光電效應/9.png', title: '光子模型登場：每一顆光的能量，由頻率決定' }
    ],
    Simulation: 光電效應Simulation,
  },

  {
    id: '03_物質波',
    title: '03_物質波',
    subtitle: '德布羅意的革命：粒子也是波',
    emoji: '🌊',
    tag: '量子物理',
    tagColor: 'bg-cyan-600',
    description: '電子為什麼有干涉條紋？棒球為什麼沒有？用雙縫實驗親眼看懂量子世界的機率本質。',
    comics: [
    { file: './comics/03_物質波/1.png', title: '如果光可以像粒子，那電子會不會也像波？' },
    { file: './comics/03_物質波/10.png', title: '量子力學的新圖像：波函數會同時沿兩條路徑展開' },
    { file: './comics/03_物質波/11.png', title: '兩條路徑疊加後，有些地方增強，有些地方抵消' },
    { file: './comics/03_物質波/12.png', title: '單次偵測看到的是點，很多次重複後浮出的是分布' },
    { file: './comics/03_物質波/13.png', title: '物質波新聞：池塘水波，更像一張機率地圖' },
    { file: './comics/03_物質波/14.png', title: '平常感覺不到物質波，不是因為它不存在' },
    { file: './comics/03_物質波/15.png', title: '量子世界不是違反規律，而是規律本來就和直覺開玩笑' },
    { file: './comics/03_物質波/2.png', title: '德布羅意的想法：只要有動量，就能對應一個波長' },
    { file: './comics/03_物質波/3.png', title: '過度平凡的日常：為什麼我們看不到物質波？' },
    { file: './comics/03_物質波/4.png', title: '要證明它像波，就要去找只有波才做得到的現象' },
    { file: './comics/03_物質波/5.png', title: '實驗開始：一次只射一顆電子' },
    { file: './comics/03_物質波/6.png', title: '每一次都只是一個點，但位置卻不固定' },
    { file: './comics/03_物質波/7.png', title: '一顆一顆看像亂，全部疊起來卻不是亂' },
    { file: './comics/03_物質波/8.png', title: '一次只來一顆，那它到底是跟誰干涉？' },
    { file: './comics/03_物質波/9.png', title: '如果它只是選左縫或右縫，最後不會長成這樣' }
    ],
    Simulation: null,
  },

  {
    id: '04_原子線譜與量子態',
    title: '04_原子線譜與量子態',
    subtitle: '從軌道到能階的微觀跳躍',
    emoji: '⚛️',
    tag: '量子物理',
    tagColor: 'bg-blue-600',
    description: '為什麼原子只發出特定顏色的光？從拉塞福的崩潰到波耳的能階，看見電子如何在微觀世界跳舞。',
    comics: [
    { file: './comics/04_原子線譜與量子態/1.png', title: '這支氣體管為什麼會發光？跟黑體輻射一樣嗎？' },
    { file: './comics/04_原子線譜與量子態/10.png', title: '能階不是硬規定，而是穩定波形自己篩出來的' },
    { file: './comics/04_原子線譜與量子態/11.png', title: '小薛登場：電子不是沿軌道跑，而是以分布的方式存在' },
    { file: './comics/04_原子線譜與量子態/12.png', title: '不同穩定解，不只是不同形狀，也是不同能量' },
    { file: './comics/04_原子線譜與量子態/13.png', title: '量子態之間的能量差，才是光真正的來源' },
    { file: './comics/04_原子線譜與量子態/14.png', title: '顏色不是裝飾，而是在透露它跳了多大一步' },
    { file: './comics/04_原子線譜與量子態/15.png', title: '回到一開始：亮線之間的黑暗，也是在說話' },
    { file: './comics/04_原子線譜與量子態/2.png', title: '黑體輻射是整體熱輻射，氣體線譜是原子在放特定的光' },
    { file: './comics/04_原子線譜與量子態/3.png', title: '這支發光氣體管的光，拆開後怎麼只剩幾條線？' },
    { file: './comics/04_原子線譜與量子態/4.png', title: '如果原子真的像小太陽系，事情會直接出事' },
    { file: './comics/04_原子線譜與量子態/5.png', title: '舊模型不只一種，但它們都不夠' },
    { file: './comics/04_原子線譜與量子態/6.png', title: '小波先抓住結果：電子只能待某幾層' },
    { file: './comics/04_原子線譜與量子態/7.png', title: '真正的問題來了：為什麼穩定狀態只出現在那些層？' },
    { file: './comics/04_原子線譜與量子態/8.png', title: '如果電子不只是小球，而也帶著波的性格' },
    { file: './comics/04_原子線譜與量子態/9.png', title: '只有接得起來的狀態，才可能穩定存在' }
    ],
    Simulation: null,
  },

  {
    id: '05_不確定性原理',
    title: '05_不確定性原理',
    subtitle: '微觀世界的內建模糊限度',
    emoji: '🌫️',
    tag: '量子物理',
    tagColor: 'bg-slate-600',
    description: '拍得越清楚就真的知道越多嗎？理解海森堡的不確定性，發現那是微觀世界的內建規則，而非技術失敗。',
    comics: [
    { file: './comics/05_不確定性原理/1.png', title: '拍得越清楚，就能知道得越多嗎？' },
    { file: './comics/05_不確定性原理/10.png', title: '波長一多，動量就不可能只剩一個值' },
    { file: './comics/05_不確定性原理/11.png', title: '位置越準，動量分布就越散' },
    { file: './comics/05_不確定性原理/12.png', title: '這不是失誤，而是量子態本來的樣子' },
    { file: './comics/05_不確定性原理/13.png', title: '海森堡關係式登場' },
    { file: './comics/05_不確定性原理/14.png', title: '不是你看不清，而是世界不讓你同時那樣存在' },
    { file: './comics/05_不確定性原理/15.png', title: '不確定性不是技術失敗，而是微觀世界的結構本身' },
    { file: './comics/05_不確定性原理/2.png', title: '快門開著時，照片裡看到的是點，還是軌跡？' },
    { file: './comics/05_不確定性原理/3.png', title: '軌跡變明顯了，可是位置反而糊了' },
    { file: './comics/05_不確定性原理/4.png', title: '那就把快門縮短，不就好了？' },
    { file: './comics/05_不確定性原理/5.png', title: '這只是拍照技術問題嗎？' },
    { file: './comics/05_不確定性原理/6.png', title: '拍照也是量測，而量測不是零代價' },
    { file: './comics/05_不確定性原理/7.png', title: '真正麻煩的地方，不只在干擾' },
    { file: './comics/05_不確定性原理/8.png', title: '把粒子想成波包，事情就不一樣了' },
    { file: './comics/05_不確定性原理/9.png', title: '想把位置壓窄，就不能只用單一波長' }
    ],
    Simulation: null,
  }
]

export default topics
