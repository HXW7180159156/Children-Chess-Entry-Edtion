import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, BookOpen, Swords, Gamepad2, Trophy } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', icon: Home, label: '主页' },
  { path: '/learn', icon: BookOpen, label: '学习' },
  { path: '/play', icon: Swords, label: '对弈' },
  { path: '/games', icon: Gamepad2, label: '游戏' },
  { path: '/progress', icon: Trophy, label: '进度' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="shrink-0 bg-white/80 backdrop-blur-sm border-t border-kids-light/30 px-2 py-2 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 touch-target w-16 h-16 justify-center"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-kids-teal/15 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                size={28}
                className={isActive ? 'text-kids-teal' : 'text-kids-text-light'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-xs font-semibold ${
                  isActive ? 'text-kids-teal' : 'text-kids-text-light'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  )
}
