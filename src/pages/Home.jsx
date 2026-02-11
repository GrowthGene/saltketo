import { Plus, Heart } from 'lucide-react';
import { useData } from '../context/DataContext';

const Home = () => {
    const { weight, updateWeight, condition, updateCondition } = useData();

    return (
        <div>
            <header style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</div>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>오늘의 비밀연구소 🧪</h1>
            </header>

            {/* Weight Card */}
            <section className="card" style={{ background: '#FF8A65', color: 'white', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>오늘 내 체중은?</div>

                {weight > 0 ? (
                    <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '16px' }}>{weight}kg</div>
                ) : (
                    <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '16px', opacity: 0.5 }}>00.0kg</div>
                )}

                <button
                    onClick={() => {
                        const val = prompt("체중을 입력해주세요 (kg)");
                        if (val) updateWeight(Number(val));
                    }}
                    style={{
                        background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none',
                        borderRadius: '20px', padding: '12px 30px', fontSize: '16px', fontWeight: 700
                    }}
                >
                    기록하기
                </button>
            </section>

            {/* Condition Card */}
            <section className="card" style={{ background: '#FFF3E0', marginBottom: '16px', textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#E65100', marginBottom: '16px' }}>
                    {condition ? `오늘 기분: ${condition}` : "컨디션과 몸 상태는 어떤가요?"}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {['좋음', '보통', '나쁨'].map(status => (
                        <button key={status} onClick={() => updateCondition(status)} style={{
                            padding: '10px 20px', borderRadius: '20px', border: 'none',
                            background: condition === status ? '#FF9800' : 'white',
                            color: condition === status ? 'white' : '#FF9800', fontWeight: 700
                        }}>
                            {status === '좋음' ? '🥰' : (status === '보통' ? '🙂' : '😫')}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
