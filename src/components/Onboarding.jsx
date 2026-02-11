import { useState } from 'react';
import { useData } from '../context/DataContext';

const Onboarding = () => {
    const { updateUser } = useData();
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            updateUser({ name, isOnboarded: true });
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'white', zIndex: 9999, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '40px'
        }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🧪</div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>비밀연구소에 오신 것을<br />환영합니다!</h1>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '40px' }}>
                연구원님의 성함을 알려주세요.<br />ID 카드를 발급해 드립니다.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <input
                    type="text" placeholder="이름 / 닉네임"
                    value={name} onChange={e => setName(e.target.value)}
                    style={{
                        width: '100%', padding: '16px', borderRadius: '16px', border: '2px solid #eee',
                        fontSize: '18px', fontWeight: 700, marginBottom: '16px', textAlign: 'center'
                    }}
                    autoFocus
                />
                <button className="btn-primary">연구 시작하기 🚀</button>
            </form>
        </div>
    );
};

export default Onboarding;
