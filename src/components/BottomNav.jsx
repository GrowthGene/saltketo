import { Home, BarChart2, Camera, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: Camera, label: '분석', path: '/analysis' },
    { icon: BarChart2, label: '기록', path: '/stats' },
    { icon: User, label: '마이룸', path: '/profile' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      maxWidth: '480px',
      background: 'white',
      borderTop: '1px solid #eee',
      padding: '12px 0 24px 0',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 100
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
            color: isActive ? 'var(--text-main)' : '#ccc',
            fontSize: '11px',
            gap: '4px',
            fontWeight: isActive ? 600 : 400
          })}
        >
          <Icon size={24} strokeWidth={2.5} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
