import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const showNav = !location.pathname.startsWith('/learn/') || location.pathname === '/learn';

  return (
    <div className="h-full flex flex-col overflow-hidden bg-kids-bg">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto overflow-x-hidden px-4 pb-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {showNav && <BottomNav />}
    </div>
  )
}
