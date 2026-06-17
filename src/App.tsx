import { Routes, Route } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import AppShell from './components/shell/AppShell'
import { soundManager } from './audio/soundManager'
import { useSettingsStore } from './stores/useSettingsStore'

// Lazy-load route pages for code splitting
const Home = lazy(() => import('./routes/Home'))
const LessonList = lazy(() => import('./routes/LessonList'))
const LessonPlayer = lazy(() => import('./routes/LessonPlayer'))
const PlayAI = lazy(() => import('./routes/PlayAI'))
const MiniGameHub = lazy(() => import('./routes/MiniGameHub'))
const MiniGamePlayer = lazy(() => import('./routes/MiniGamePlayer'))
const Progress = lazy(() => import('./routes/Progress'))
const Settings = lazy(() => import('./routes/Settings'))

function App() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  useEffect(() => {
    soundManager.init();
  }, []);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  return (
    <AppShell>
      <Suspense fallback={<div className="flex items-center justify-center h-full text-4xl">🎠</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<LessonList />} />
          <Route path="/learn/:chapterId" element={<LessonPlayer />} />
          <Route path="/play" element={<PlayAI />} />
          <Route path="/games" element={<MiniGameHub />} />
          <Route path="/games/:gameId" element={<MiniGamePlayer />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}

export default App
