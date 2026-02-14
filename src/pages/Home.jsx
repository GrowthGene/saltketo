import { useNavigate } from 'react-router-dom';
import { Droplet, Plus, Minus, Battery, Activity, Flame, Utensils, Beaker, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import EnergyCore from '../components/EnergyCore';


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
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {new Date().toLocaleDateString()} <span style={{ opacity: 0.5 }}>v3.1</span>
                    </div>
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
                background: `linear-gradient(135deg, var(--surface) 0%, ${statusData.color}15 100%)`,
                border: `1px solid ${statusData.color}30`
            }}>
                <div style={{ marginBottom: '20px', fontWeight: 700, color: statusData.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Activity size={18} /> {statusMsg}
                </div>
                <EnergyCore percentage={statusData.status === 'burning' ? 100 : statusData.status === 'warming' ? 60 : 20} status={statusData.status} color={statusData.color} />
                <div style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    목표치까지 {Math.max(0, goal - totalSalt).toFixed(1)}g 남았습니다
                </div>
            </section>

            {/* Water Tracking Display */}
            <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#E1F5FE', padding: '10px', borderRadius: '12px', position: 'relative', overflow: 'hidden', width: '44px', height: '44px' }}>
                        <motion.div
                            animate={{
                                top: `${100 - Math.min((waterIntake / 2000) * 100, 100)}%`,
                                rotate: [0, 360]
                            }}
                            transition={{
                                top: { type: "spring", stiffness: 20 },
                                rotate: { duration: 5, repeat: Infinity, ease: "linear" }
                            }}
                            style={{
                                position: 'absolute', left: '-50%', width: '200%', height: '200%',
                                background: 'rgba(3, 169, 244, 0.3)', borderRadius: '40%',
                            }}
                        />
                        <motion.div
                            animate={{
                                top: `${100 - Math.min((waterIntake / 2000) * 100, 100) + 10}%`,
                                rotate: [0, -360]
                            }}
                            transition={{
                                top: { type: "spring", stiffness: 30 },
                                rotate: { duration: 7, repeat: Infinity, ease: "linear" }
                            }}
                            style={{
                                position: 'absolute', left: '-50%', width: '200%', height: '200%',
                                background: 'rgba(3, 169, 244, 0.5)', borderRadius: '45%',
                            }}
                        />
                        <Droplet size={24} color="#0277BD" style={{ position: 'relative', zIndex: 1 }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#78909C', fontWeight: 600 }}>순수 수분 섭취 (맹물)</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0288D1' }}>
                            {waterIntake} <span style={{ fontSize: '14px' }}>ml</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => addWater(-250)} style={{
                        background: '#FFEBEE', color: '#F44336', border: 'none', borderRadius: '12px',
                        padding: '8px 12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                        <span>-250ml</span>
                    </button>
                    {/* +250ml is in the grid below */}
                </div>
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
                        { label: '클린 식사', amount: 0, icon: Utensils, color: '#66BB6A', type: 'meal_clean' },
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
                                    // If Salt Water 500ml, also add water
                                    if (action.label === '소금물 500ml') {
                                        addWater(500);
                                    }
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
            </section>

            {/* Exercise & Water - Updated for V3 */}
            <section style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#263238' }}>에너지 소비 & 수분</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                    {/* Exercise Level 1: Light */}
                    <button onClick={() => addLog(-0.5, '가벼운 산책', 'exercise')} style={{
                        padding: '20px', borderRadius: '16px', border: 'none', background: '#E3F2FD',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '24px' }}>🚶</div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1565C0' }}>가벼운 산책 (-0.5g)</span>
                    </button>

                    {/* Exercise Level 2: Moderate */}
                    <button onClick={() => addLog(-1.0, '중강도 운동', 'exercise')} style={{
                        padding: '20px', borderRadius: '16px', border: 'none', background: '#E3F2FD',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '24px' }}>🏃</div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1565C0' }}>중강도 운동 (-1.0g)</span>
                    </button>

                    {/* Exercise Level 3: Intense */}
                    <button onClick={() => addLog(-2.0, '고강도 운동', 'exercise')} style={{
                        padding: '20px', borderRadius: '16px', border: 'none', background: '#E3F2FD',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '24px' }}>🔥</div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1565C0' }}>고강도 운동 (-2.0g)</span>
                    </button>

                    {/* Water Check (moved here for grid layout) */}
                    <button onClick={() => addWater(250)} style={{
                        padding: '20px', borderRadius: '16px', border: 'none', background: '#E0F7FA',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: '24px' }}>💧</div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#00838F' }}>물 한잔 (+250ml)</span>
                    </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#90A4AE' }}>
                    오늘 마신 물: <b style={{ color: '#00BCD4' }}>{waterIntake}ml</b>
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
                                    <span>
                                        {log.type === 'salt' ? '소금' :
                                            log.type === 'exercise' ? '운동' :
                                                log.type === 'meal' ? log.label : log.type}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ fontWeight: 700 }}>{log.amount > 0 ? '+' : ''}{log.amount}g</span>
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
        </div >
    );
};

export default Home;
