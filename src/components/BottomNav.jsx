import { Home, BarChart2, Stethoscope, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: Stethoscope, label: '자가진단', path: '/analysis' },
    { icon: BarChart2, label: '기록', path: '/stats' },
    { icon: User, label: '마이룸', path: '/profile' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      maxWidth: '480px',
      background: 'var(--surface)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(0,0,0,0.05)',
      padding: '12px 0 24px 0',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 100,
      transition: 'background 0.3s ease'
    }}>
      {navItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? 'var(--primary-500)' : 'var(--text-muted)',
            fontSize: '11px',
            gap: '4px',
            fontWeight: isActive ? 700 : 500,
            transition: 'color 0.2s ease'
          })}
        >
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
