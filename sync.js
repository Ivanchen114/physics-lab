/**
 * sync.js — 物理漫遊實驗室自動同步腳本
 *
 * 使用方式：在 website/ 目錄下執行
 *   node sync.js
 *
 * 功能：
 *   1. 掃描上層的主題資料夾（每個子資料夾 = 一個主題）
 *   2. 複製 PNG 漫畫圖片到 public/comics/
 *   3. 複製 JSX 模擬程式碼到 src/simulations/
 *   4. 更新 src/topicsConfig.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT       = path.join(__dirname, '..')          // 物理漫遊實驗室/
const COMICS_OUT = path.join(__dirname, 'public', 'comics')
const SIMS_OUT   = path.join(__dirname, 'src', 'simulations')

// 不掃描這個資料夾本身
const SKIP_DIRS = ['website', '.git', '.skills', '.auto-memory', '.remote-plugins', 'node_modules']

// ─── 主程式 ──────────────────────────────────────────────────────────────────
const topicDirs = fs.readdirSync(ROOT).filter(name => {
  const full = path.join(ROOT, name)
  return fs.statSync(full).isDirectory() && !SKIP_DIRS.includes(name)
})

console.log(`\n🔍 找到 ${topicDirs.length} 個主題資料夾：${topicDirs.join(', ')}\n`)

const topicsData = []

for (const dir of topicDirs) {
  const topicPath = path.join(ROOT, dir)
  const files = fs.readdirSync(topicPath)

  // ── 找 PNG 圖片，按名稱排序 ──
  const pngs = files
    .filter(f => f.toLowerCase().endsWith('.png'))
    .sort()

  // ── 找 JSX 模擬檔 ──
  const jsxFiles = files.filter(f => f.toLowerCase().endsWith('.jsx') || f.toLowerCase().endsWith('.rtf'))

  if (!pngs.length && !jsxFiles.length) {
    console.log(`⚠️  ${dir}：沒有 PNG 或 JSX，跳過`)
    continue
  }

  // ── 複製 PNG 到 public/comics/[dir]/ ──
  const comicsDir = path.join(COMICS_OUT, dir)
  fs.mkdirSync(comicsDir, { recursive: true })
  const comicEntries = []
  for (const png of pngs) {
    fs.copyFileSync(path.join(topicPath, png), path.join(comicsDir, png))
    const title = png.replace(/^\d+_/, '').replace(/\.png$/i, '').replace(/_/g, ' ')
    comicEntries.push({ file: `./comics/${dir}/${png}`, title })
  }
  console.log(`  🖼  ${dir}：複製 ${pngs.length} 張漫畫`)

  // ── 複製 JSX 到 src/simulations/ ──
  let simImport = null
  const simName = dir.replace(/\s+/g, '') + 'Simulation'
  for (const f of jsxFiles) {
    if (f.toLowerCase().endsWith('.jsx')) {
      const dest = path.join(SIMS_OUT, simName + '.jsx')
      fs.copyFileSync(path.join(topicPath, f), dest)
      simImport = simName
      console.log(`  🎮  ${dir}：複製模擬 ${f} → ${simName}.jsx`)
      break
    }
  }

  topicsData.push({ dir, comicEntries, simImport })
}

// ─── 產生 topicsConfig.js ────────────────────────────────────────────────────
const importLines = topicsData
  .filter(t => t.simImport)
  .map(t => `import ${t.simImport} from './simulations/${t.simImport}'`)
  .join('\n')

const topicObjects = topicsData.map(({ dir, comicEntries, simImport }) => {
  const id    = dir.toLowerCase().replace(/\s+/g, '-')
  const emoji = '📘' // 預設 emoji，可手動改
  const comics = comicEntries
    .map(c => `    { file: '${c.file}', title: '${c.title}' }`)
    .join(',\n')
  return `  {
    id: '${id}',
    title: '${dir}',
    subtitle: '',
    emoji: '${emoji}',
    tag: '物理',
    tagColor: 'bg-indigo-600',
    description: '點擊查看漫畫與互動模擬。',
    comics: [
${comics}
    ],
    Simulation: ${simImport || 'null'},
  }`
}).join(',\n\n')

const config = `// =============================================
// topicsConfig.js — 由 sync.js 自動產生
// 如需自訂 emoji、說明文字，請直接在此編輯
// =============================================

${importLines}

const topics = [
${topicObjects}
]

export default topics
`

fs.writeFileSync(path.join(__dirname, 'src', 'topicsConfig.js'), config, 'utf8')
console.log('\n✅ topicsConfig.js 已更新！')
console.log('👉 接著執行 npm run build 產生網站\n')
