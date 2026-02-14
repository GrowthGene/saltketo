import { Plus, Zap, Droplet, Utensils, Beaker, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import EnergyCore from '../components/EnergyCore';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const {
        user,
        logs,
        addLog,
        addWater,
        waterIntake,
        recordMeal,
        getEngineStatus,
        goal
    } = useData();

    const navigate = useNavigate();

    // Calculate total salt intake today
    const totalSalt = logs
        .filter(log => {
            if (!log.timestamp) return false;
            const logDate = new Date(log.timestamp).toLocaleDateString();
            const today = new Date().toLocaleDateString();
            return logDate === today;
        })
        .reduce((acc, log) => acc + log.amount, 0);

    const quickActions = [
        { label: '소금물', amount: 2.0, icon: Droplet, color: '#2196F3' },
        { label: '캡슐', amount: 0.5, icon: Beaker, color: '#FF9800' },
        { label: '식사', amount: 1.5, icon: Utensils, color: '#4CAF50' },
        { label: '부스터', amount: 3.0, icon: Zap, color: '#F44336' },
    ];

    const statusData = getEngineStatus ? getEngineStatus() : { status: 'idle', color: '#90A4AE', message: '로딩중...' };
    const statusMsg = statusData.message;

    return (
        <div style={{ paddingBottom: '20px' }}>
            {/* Header / ID Card Snippet */}
            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'
            }}>
                <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>
                        <span style={{ color: 'var(--primary-600)' }}>{user.title}</span> {user.name}님
                    </div>
                </div>
                <div onClick={() => navigate('/profile')} style={{
                    background: '#ECEFF1', padding: '6px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer'
                }}>
                    <span>Lv.{user.level}</span>
                    <div style={{ background: '#CFD8DC', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, color: '#455A64' }}>
                        {user.rp} RP
                    </div>
                </div>
            </header>

            {/* Main Widget: Energy Core */}
            <section className="card" onClick={() => alert('엔진 상세 정보: ' + statusMsg)} style={{
                marginBottom: '20px', textAlign: 'center', padding: '40px 20px', cursor: 'pointer',
                background: `linear-gradient(135deg, #ffffff 0%, ${statusData.color}15 100%)`,
                border: `1px solid ${statusData.color}30`
            }}>
                <div style={{ marginBottom: '20px', fontWeight: 700, color: statusData.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Activity size={18} /> {statusMsg}
                </div>
                <EnergyCore percentage={statusData.status === 'burning' ? 100 : statusData.status === 'warming' ? 60 : 20} status={statusData.status} color={statusData.color} />
                <div style={{ marginTop: '20px', fontSize: '13px', color: '#78909C' }}>
                    목표치까지 {Math.max(0, goal - totalSalt).toFixed(1)}g 남았습니다
                </div>
            </section>

            {/* Water Tracking Display */}
            <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#E1F5FE', padding: '10px', borderRadius: '12px' }}>
                        <Droplet size={24} color="#03A9F4" />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#78909C', fontWeight: 600 }}>순수 수분 섭취 (맹물)</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0288D1' }}>
                            {waterIntake} <span style={{ fontSize: '14px' }}>ml</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => addWater(250)} style={{
                    background: '#03A9F4', color: 'white', border: 'none', borderRadius: '12px',
                    padding: '8px 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}>
                    + 물 250ml
                </button>
            </div>

            {/* Quick Actions Grid */}
            <section style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} fill="#FFD700" color="#FFD700" /> 빠른 투입 (에너지 & 식단)
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                    {/* Custom Action Buttons */}
                    {[
                        { label: '소금물 500ml', amount: 0.5, icon: Droplet, color: '#29B6F6', type: 'salt' },
                        { label: '소금 캡슐', amount: 1.0, icon: Beaker, color: '#AB47BC', type: 'salt' },
                        { label: '클린 식단', amount: 0, icon: Utensils, color: '#66BB6A', type: 'meal_clean' },
                        { label: '일반 식사', amount: 0, icon: Utensils, color: '#FFCA28', type: 'meal_safe' },
                    ].map((action) => (
                        <button key={action.label}
                            onClick={() => {
                                if (action.type === 'meal_clean') {
                                    recordMeal(1);
                                    alert('🥗 클린 식단 기록! (엔진 효율 상승)');
                                } else if (action.type === 'meal_safe') {
                                    recordMeal(2);
                                    alert('🍛 일반 식사 기록.');
                                } else {
                                    addLog(action.amount, action.label);
                                }
                            }}
                            style={{
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
