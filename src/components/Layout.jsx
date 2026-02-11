import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Onboarding from './Onboarding';
import { useData } from '../context/DataContext';

const Layout = () => {
    const { user } = useData();

    return (
        <div style={{ paddingBottom: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!user.isOnboarded && <Onboarding />}
            <main style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};


export default Layout;
