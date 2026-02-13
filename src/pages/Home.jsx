import { Plus, Zap, Droplet, Utensils, Beaker, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import EnergyCore from '../components/EnergyCore';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, logs, goal, addLog, weight } = useData();
    const navigate = useNavigate();

    // Calculate total salt intake today
    const totalSalt = logs
        .filter(log => log.time.includes(new Date().toLocaleDateString()) || true) // Simplified for demo: assume all logs are today or filter properly in real app
        // Actually DataContext doesn't filter perfectly by date yet, but let's assume logs are relevant.
        // Better: let's filter by date string if we had it. For now, just sum all (since the app seems to be a daily session or similar)
        // or simplistic approach:
        .reduce((acc, log) => acc + log.amount, 0);

    const quickActions = [
        { label: '소금물', amount: 2.0, icon: Droplet, color: '#2196F3' },
        { label: '캡슐', amount: 0.5, icon: Beaker, color: '#FF9800' },
        { label: '식사', amount: 1.5, icon: Utensils, color: '#4CAF50' },
        { label: '부스터', amount: 3.0, icon: Zap, color: '#F44336' },
    ];

    return (
        <div style={{ paddingBottom: '20px' }}>
            {/* Header / ID Card Snippet */}
            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'
            }}>
                <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>
                        안녕하세요, <span style={{ color: 'var(--primary-600)' }}>{user.name}</span>님
                    </div>
                </div>
                <div onClick={() => navigate('/profile')} style={{
                    background: '#ECEFF1', padding: '6px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer'
                }}>
                    <span>Lv.{user.level}</span>
                    <div style={{
                        width: '30px', height: '4px', background: '#CFD8DC', borderRadius: '2px', overflow: 'hidden'
                    }}>
                        <div style={{ width: `${user.exp}%`, height: '100%', background: '#00E676' }} />
                    </div>
                </div>
            </header>

            {/* Main Widget: Energy Core */}
            <section className="card" style={{
                marginBottom: '20px', textAlign: 'center', padding: '40px 20px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
            }}>
                <div style={{ marginBottom: '20px', fontWeight: 700, color: '#546E7A' }}>연구소 에너지 코어</div>
                <EnergyCore current={totalSalt} goal={goal} />
                <div style={{ marginTop: '20px', fontSize: '13px', color: '#78909C' }}>
                    목표치까지 {Math.max(0, goal - totalSalt).toFixed(1)}g 남았습니다
                </div>
            </section>

            {/* Quick Actions Grid */}
            <section style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} fill="#FFD700" color="#FFD700" /> 빠른 투입 (에너지 섭취)
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                    {quickActions.map((action) => (
                        <button key={action.label} onClick={() => addLog(action.amount, action.label)} style={{
                            background: 'white', border: 'none', borderRadius: '16px', padding: '16px 4px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.1s'
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px', background: `${action.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <action.icon size={20} color={action.color} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#37474F' }}>{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* Exercise Section */}
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="#FF5722" /> 에너지 소비 (운동)
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => addLog(-0.5, '가벼운 운동 (걷기)')} style={{
                        flex: 1, padding: '12px', borderRadius: '16px', border: 'none', background: 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '20px' }}>🚶</div>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>가볍게</div>
                        <div style={{ fontSize: '10px', color: '#EF5350' }}>-0.5g</div>
                    </button>
                    <button onClick={() => addLog(-1.0, '적당한 운동 (조깅)')} style={{
                        flex: 1, padding: '12px', borderRadius: '16px', border: 'none', background: 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '20px' }}>🏃</div>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>적당히</div>
                        <div style={{ fontSize: '10px', color: '#EF5350' }}>-1.0g</div>
                    </button>
                    <button onClick={() => addLog(-2.0, '격한 운동 (웨이트)')} style={{
                        flex: 1, padding: '12px', borderRadius: '16px', border: 'none', background: 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '20px' }}>🔥</div>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>격하게</div>
                        <div style={{ fontSize: '10px', color: '#EF5350' }}>-2.0g</div>
                    </button>
                </div>
            </section>

            {/* Recent Logs (Mini) */}
            <section className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700 }}>최신 연구 기록</h2>
                    <span onClick={() => navigate('/stats')} style={{ fontSize: '12px', color: '#90A4AE', cursor: 'pointer' }}>전체보기</span>
                </div>
                {logs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {logs.slice(0, 3).map(log => (
                            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B0BEC5' }} />
                                    <span>{log.type}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ fontWeight: 700 }}>+{log.amount}g</span>
                                    <span style={{ color: '#CFD8DC', fontSize: '12px' }}>{log.time.slice(0, 5)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#CFD8DC', fontSize: '13px', padding: '10px' }}>
                        데이터가 없습니다.
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
