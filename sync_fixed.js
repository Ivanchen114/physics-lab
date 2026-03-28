import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT       = path.join(__dirname, '..')
const COMICS_OUT = path.join(__dirname, 'public', 'comics')
const SIMS_OUT   = path.join(__dirname, 'src', 'simulations')

// Using hardcoded topics list because root readdirSync fails with EPERM
const topicDirs = [
  '01_黑體輻射',
  '02_光電效應',
  '03_物質波',
  '04_原子線譜與量子態',
  '05_不確定性原理'
]

console.log(`\n🔍 手動指定同步主題：${topicDirs.join(', ')}\n`)

const configPath = path.join(__dirname, 'src', 'topicsConfig.js')
let existingConfig = ''
if (fs.existsSync(configPath)) {
  existingConfig = fs.readFileSync(configPath, 'utf8')
}

const topicsData = []

for (const dir of topicDirs) {
  const topicPath = path.join(ROOT, dir)
  if (!fs.existsSync(topicPath)) {
    console.log(`⚠️  找不到資料夾 ${dir}，跳過`)
    continue
  }
  const files = fs.readdirSync(topicPath)

  const pngs = files
    .filter(f => f.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

  const jsxFiles = files.filter(f => f.toLowerCase().endsWith('.jsx'))

  if (!pngs.length && !jsxFiles.length) {
    console.log(`⚠️  ${dir}：沒有 PNG 或 JSX，跳過`)
    continue
  }

  const comicsDir = path.join(COMICS_OUT, dir)
  fs.mkdirSync(comicsDir, { recursive: true })

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
    const defaultTitle = png.replace(/^\d+[-_]/, '').replace(/\.png$/i, '').replace(/_/g, ' ')
    const title = existingComicMap[filePath] || defaultTitle
    comicEntries.push({ file: filePath, title })
  }
  console.log(`  🖼  ${dir}：複製 ${pngs.length} 張漫畫`)

  let simImport = null
  const simFileName = dir.replace(/\s+/g, '') + 'Simulation'
  const simVarName = simFileName.replace(/^\d+_?/, '')
  for (const f of jsxFiles) {
    const dest = path.join(SIMS_OUT, simFileName + '.jsx')
    fs.copyFileSync(path.join(topicPath, f), dest)
    simImport = { varName: simVarName, fileName: simFileName }
    console.log(`  🎮  ${dir}：複製模擬 ${f} → ${simFileName}.jsx`)
    break
  }

  if (!simImport) {
    const existingSim = path.join(SIMS_OUT, simFileName + '.jsx')
    if (fs.existsSync(existingSim)) {
      simImport = { varName: simVarName, fileName: simFileName }
      console.log(`  🎮  ${dir}：沿用既有模擬 ${simFileName}.jsx`)
    }
  }

  topicsData.push({ dir, comicEntries, simImport })
}

const importLines = topicsData
  .filter(t => t.simImport)
  .map(t => `import ${t.simImport.varName} from './simulations/${t.simImport.fileName}'`)
  .join('\n')

const topicObjects = topicsData.map(({ dir, comicEntries, simImport }) => {
  const id = dir.toLowerCase().replace(/\s+/g, '-')
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
