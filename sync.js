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

// 先讀現有 config，以便後續保留 title / metadata
const configPath = path.join(__dirname, 'src', 'topicsConfig.js')
let existingConfig = ''
if (fs.existsSync(configPath)) {
  existingConfig = fs.readFileSync(configPath, 'utf8')
}

const topicsData = []

for (const dir of topicDirs) {
  const topicPath = path.join(ROOT, dir)
  const files = fs.readdirSync(topicPath)

  // ── 找 PNG 圖片，排除封面圖，按名稱排序 ──
  const pngs = files
    .filter(f => {
      const isPng = f.toLowerCase().endsWith('.png');
      const isCover = path.parse(f).name.toLowerCase() === 'cover';
      return isPng && !isCover;
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

  // ── 找 JSX 模擬檔 ──
  const jsxFiles = files.filter(f => f.toLowerCase().endsWith('.jsx') || f.toLowerCase().endsWith('.rtf'))

  if (!pngs.length && !jsxFiles.length) {
    console.log(`⚠️  ${dir}：沒有 PNG 或 JSX，跳過`)
    continue
  }

  // ── 複製 PNG 到 public/comics/[dir]/ ──
  const comicsDir = path.join(COMICS_OUT, dir)
  fs.mkdirSync(comicsDir, { recursive: true })

  // ── 複製 cover.png / cover (如果有) ──
  const possibleCovers = ['cover.png', 'cover.jpg', 'cover.jpeg', 'cover']
  let coverSrc = null
  for (const name of possibleCovers) {
    const p = path.join(topicPath, name)
    if (fs.existsSync(p)) {
      coverSrc = p
      break
    }
  }

  let coverRelPath = 'null'
  if (coverSrc) {
    const coversDir = path.join(__dirname, 'public', 'covers')
    if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true })
    const ext = path.extname(coverSrc) || '.png'
    const coverDest = path.join(coversDir, dir + ext)
    fs.copyFileSync(coverSrc, coverDest)
    coverRelPath = `'/covers/${encodeURIComponent(dir)}${ext}'`
    console.log(`  🖼  ${dir}：複製封面圖 (${path.basename(coverSrc)})`)
  }

  // 從現有 config 取出這個主題的 comics 陣列（用於保留已手動設定的 title）
  const existingComicMap = {}
  if (existingConfig) {
    const comicLineRe = /file:\s*['"]([^'"]+)['"]\s*,\s*title:\s*['"]([^'"]+)['"]/g
    let m
    while ((m = comicLineRe.exec(existingConfig)) !== null) {
      existingComicMap[m[1]] = m[2]
    }
  }

  const comicEntries = []
  for (const png of pngs) {
    fs.copyFileSync(path.join(topicPath, png), path.join(comicsDir, png))
    const filePath = `./comics/${dir}/${png}`
    // 優先使用已存在的 title，否則從檔名推導
    const defaultTitle = png.replace(/^\d+[-_]/, '').replace(/\.png$/i, '').replace(/_/g, ' ')
    const title = existingComicMap[filePath] || defaultTitle
    comicEntries.push({ file: filePath, title })
  }
  console.log(`  🖼  ${dir}：複製 ${pngs.length} 張漫畫`)

  // ── 複製 JSX 到 src/simulations/ ──
  let simImport = null
  // 檔案名稱保留完整資料夾名（例如 01_黑體輻射Simulation.jsx）
  const simFileName = dir.replace(/\s+/g, '') + 'Simulation'
  // JS 識別符不能以數字開頭，移除前綴數字和底線（例如 "01_" → ""）
  const simVarName = simFileName.replace(/^\d+_?/, '') + (simFileName.match(/^\d+_?/) ? '' : '')
  // 優先從主題資料夾找 JSX
  for (const f of jsxFiles) {
    if (f.toLowerCase().endsWith('.jsx')) {
      const dest = path.join(SIMS_OUT, simFileName + '.jsx')
      fs.copyFileSync(path.join(topicPath, f), dest)
      simImport = { varName: simVarName, fileName: simFileName }
      console.log(`  🎮  ${dir}：複製模擬 ${f} → ${simFileName}.jsx`)
      break
    }
  }
  // Fallback：如果主題資料夾沒有 JSX，看 src/simulations/ 是否已有對應檔案
  if (!simImport) {
    const existingSim = path.join(SIMS_OUT, simFileName + '.jsx')
    if (fs.existsSync(existingSim)) {
      simImport = { varName: simVarName, fileName: simFileName }
      console.log(`  🎮  ${dir}：沿用既有模擬 ${simFileName}.jsx`)
    }
  }

  topicsData.push({ dir, comicEntries, simImport, coverRelPath })
}

// ─── 產生 topicsConfig.js ────────────────────────────────────────────────────
// configPath / existingConfig 已在上方宣告

const importLines = topicsData
  .filter(t => t.simImport)
  .map(t => `import ${t.simImport.varName} from './simulations/${t.simImport.fileName}'`)
  .join('\n')

const topicObjects = topicsData.map(({ dir, comicEntries, simImport, coverRelPath }) => {
  const id = dir.toLowerCase().replace(/\s+/g, '-')
  
  // 嘗試從現有設定中抓取 metadata，若無則用預設值
  let subtitle = '', emoji = '📘', tag = '物理', tagColor = 'bg-indigo-600', description = '點擊查看漫畫與互動模擬。'
  
  if (existingConfig) {
    const sectionRegex = new RegExp(`id:\\s*['"]${id}['"].*?},`, 's')
    const match = existingConfig.match(sectionRegex)
    if (match) {
      const section = match[0]
      subtitle    = (section.match(/subtitle:\s*['"](.*?)['"]/) || [null, subtitle])[1]
      emoji       = (section.match(/emoji:\s*['"](.*?)['"]/) || [null, emoji])[1]
      tag         = (section.match(/tag:\s*['"](.*?)['"]/) || [null, tag])[1]
      tagColor    = (section.match(/tagColor:\s*['"](.*?)['"]/) || [null, tagColor])[1]
      description = (section.match(/description:\s*['"](.*?)['"]/) || [null, description])[1]
      
      const coverMatch = section.match(/cover:\s*(null|['"][^'"]*['"])/)
      if (coverMatch && coverRelPath === 'null') {
        coverRelPath = coverMatch[1]
      }
    }
  }

  const comics = comicEntries
    .map(c => `    { file: '${c.file}', title: '${c.title}' }`)
    .join(',\n')

  return `  {
    id: '${id}',
    title: '${dir}',
    subtitle: '${subtitle.replace(/'/g, "\\'")}',
    emoji: '${emoji}',
    tag: '${tag}',
    tagColor: '${tagColor}',
    description: '${description.replace(/'/g, "\\'")}',
    cover: ${coverRelPath},
    comics: [
${comics}
    ],
    Simulation: ${simImport ? simImport.varName : 'null'},
  }`
}).join(',\n\n')

const config = `// =============================================
// topicsConfig.js — 由 sync.js 自動產生
// 如需修改說明文字、emoji，請直接在 topicsConfig.js 編輯
// 下次執行 sync.js 會自動保留這些欄位
// =============================================

${importLines}

const topics = [
${topicObjects}
]

export default topics
`

fs.writeFileSync(configPath, config, 'utf8')
console.log('\n✅ topicsConfig.js 已更新！')
console.log('👉 接著執行 npm run build 產生網站\n')
