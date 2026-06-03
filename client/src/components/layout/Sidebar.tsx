import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Users,
  User,
  LogOut,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/auth.store';
import { useSocketStore } from '@/store/socket.store';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/questions', icon: BookOpen, label: 'Questions' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/rooms', icon: Users, label: 'Study Rooms' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { disconnect } = useSocketStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    disconnect();
    logout();
    navigate('/login');
    toast.success('Logged out');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col border-r border-border bg-bg-subtle z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Zap size={14} className="text-bg-base" fill="currentColor" />
          </div>
          <span className="font-semibold text-text-primary tracking-tight">OfferQuest</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-accent-muted text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-bg-overlay border border-border overflow-hidden flex items-center justify-center">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-text-secondary">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/5 transition-all duration-150"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}