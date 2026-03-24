import { useState } from 'react'
import HomePage from './pages/HomePage'
import TopicPage from './pages/TopicPage'

export default function App() {
  // 簡單的 hash-based 路由，不需要 React Router
  const [currentTopic, setCurrentTopic] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {currentTopic
        ? <TopicPage topic={currentTopic} onBack={() => setCurrentTopic(null)} />
        : <HomePage onSelectTopic={setCurrentTopic} />
      }
    </div>
  )
}
