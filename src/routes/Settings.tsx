import { useState } from 'react'
import { motion } from 'motion/react'
import { Volume2, Music, Eye, Zap, Languages } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'
import { useProgressStore } from '../stores/useProgressStore'
import { soundManager } from '../audio/soundManager'

const AVATARS = ['👶', '👧', '👦', '🐱', '🐶', '🐰', '🦊', '🐧', '🦉'];

export default function Settings() {
  const settings = useSettingsStore();
  const profiles = useProgressStore((s) => s.profiles);
  const activeProfileId = useProgressStore((s) => s.activeProfileId);
  const createProfile = useProgressStore((s) => s.createProfile);
  const deleteProfile = useProgressStore((s) => s.deleteProfile);
  const setActiveProfile = useProgressStore((s) => s.setActiveProfile);

  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);

  const handleCreateProfile = () => {
    if (newName.trim()) {
      createProfile(newName.trim(), newAvatar);
      setNewName('');
      setShowNewProfile(false);
    }
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-kids-text mb-4">⚙️ 设置</h2>

      <div className="flex flex-col gap-4">
        {/* Sound toggle */}
        <SettingRow
          icon={<Volume2 size={24} />}
          label="音效"
          active={settings.soundEnabled}
          onToggle={() => {
            settings.update({ soundEnabled: !settings.soundEnabled });
            soundManager.setEnabled(!settings.soundEnabled);
          }}
        />

        {/* Music toggle */}
        <SettingRow
          icon={<Music size={24} />}
          label="背景音乐"
          active={settings.musicEnabled}
          onToggle={() => settings.update({ musicEnabled: !settings.musicEnabled })}
        />

        {/* High contrast */}
        <SettingRow
          icon={<Eye size={24} />}
          label="高对比度"
          active={settings.highContrast}
          onToggle={() => settings.update({ highContrast: !settings.highContrast })}
        />

        {/* Reduce motion */}
        <SettingRow
          icon={<Zap size={24} />}
          label="减少动画"
          active={settings.reduceMotion}
          onToggle={() => settings.update({ reduceMotion: !settings.reduceMotion })}
        />

        {/* Language */}
        <SettingRow
          icon={<Languages size={24} />}
          label={settings.language === 'zh' ? '中文' : 'English'}
          active={false}
          isToggle={false}
          onToggle={() => settings.update({
            language: settings.language === 'zh' ? 'en' : 'zh',
          })}
        />

        {/* Profiles */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-kids-text mb-3">👤 角色</h3>
          {profiles.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 py-2 px-2 rounded-xl ${
                p.id === activeProfileId ? 'bg-kids-teal/10' : ''
              }`}
            >
              <span className="text-2xl">{p.avatar}</span>
              <span className="flex-1 font-semibold text-kids-text">{p.name}</span>
              <button
                onClick={() => setActiveProfile(p.id)}
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  p.id === activeProfileId
                    ? 'bg-kids-teal text-white'
                    : 'bg-gray-200 text-kids-text'
                }`}
              >
                {p.id === activeProfileId ? '当前' : '切换'}
              </button>
              {profiles.length > 1 && (
                <button
                  onClick={() => deleteProfile(p.id)}
                  className="text-kids-coral text-sm px-2"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}

          {/* Add profile */}
          {!showNewProfile ? (
            <button
              onClick={() => setShowNewProfile(true)}
              className="mt-3 w-full py-3 rounded-xl bg-kids-light/30 text-kids-text font-semibold active:scale-[0.98] transition-transform"
            >
              ➕ 添加角色
            </button>
          ) : (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 space-y-3"
            >
              {/* Avatar picker */}
              <div className="flex gap-2 flex-wrap">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setNewAvatar(a)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center ${
                      a === newAvatar ? 'bg-kids-teal/30 ring-2 ring-kids-teal' : 'bg-gray-100'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              {/* Name input - using emoji-based selection to avoid text input for kids */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="输入名字（家长帮写）"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-kids-text outline-none focus:ring-2 focus:ring-kids-teal"
                />
                <button
                  onClick={handleCreateProfile}
                  disabled={!newName.trim()}
                  className="px-6 py-3 bg-kids-teal text-white rounded-xl font-bold disabled:opacity-40"
                >
                  创建
                </button>
              </div>
              <button
                onClick={() => setShowNewProfile(false)}
                className="text-sm text-kids-text-light"
              >
                取消
              </button>
            </motion.div>
          )}
        </div>

        {/* Reset all data */}
        <div className="pt-4 border-t border-kids-light/30">
          <button
            onClick={() => {
              if (window.confirm('确定要清除所有数据吗？这无法撤销！')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full py-4 rounded-2xl bg-kids-coral/10 text-kids-coral font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            🗑️ 清除所有数据
          </button>
          <p className="text-center text-xs text-kids-text-light mt-2">
            ♟️ 国际象棋小课堂 v0.1
          </p>
        </div>
      </div>
    </div>
  )
}

function SettingRow({
  icon, label, active, onToggle, isToggle = true,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
  isToggle?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform touch-target"
    >
      <div className={active ? 'text-kids-teal' : 'text-kids-text-light'}>{icon}</div>
      <span className="flex-1 text-left font-semibold text-kids-text">{label}</span>
      {isToggle && (
        <div className={`w-14 h-8 rounded-full transition-colors ${active ? 'bg-kids-teal' : 'bg-gray-300'}`}>
          <motion.div
            className="w-6 h-6 bg-white rounded-full shadow-md mt-1"
            animate={{ marginLeft: active ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      )}
      {!isToggle && <span className="text-sm text-kids-text-light">→ 切换</span>}
    </button>
  )
}
