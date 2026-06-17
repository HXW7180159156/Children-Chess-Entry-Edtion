import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react'

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-kids-bg/90 backdrop-blur-sm border-b border-kids-light/30 shrink-0">
      <div className="w-12">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="touch-target w-12 h-12 flex items-center justify-center rounded-full hover:bg-kids-light/40 transition-colors"
            aria-label="返回"
          >
            <ArrowLeft size={28} className="text-kids-text" />
          </button>
        )}
      </div>

      <h1 className="text-xl font-bold text-kids-text tracking-wide">
        ♟️ 国际象棋小课堂
      </h1>

      <div className="w-12 flex justify-end">
        <button
          onClick={() => navigate('/settings')}
          className="touch-target w-12 h-12 flex items-center justify-center rounded-full hover:bg-kids-light/40 transition-colors"
          aria-label="设置"
        >
          <SettingsIcon size={28} className="text-kids-text" />
        </button>
      </div>
    </header>
  )
}
