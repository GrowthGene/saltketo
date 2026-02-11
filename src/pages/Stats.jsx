import { Droplet, Cookie, UtensilsCrossed, Soup } from 'lucide-react';
import EnergyGauge from '../components/EnergyGauge';
import { useData } from '../context/DataContext';

const Stats = () => {
    const { logs, addLog } = useData();

    const totalSalt = logs.reduce((acc, log) => acc + log.amount, 0);
    const goal = 10;
    const percent = Math.min((totalSalt / goal) * 100, 120);

    let statusText = "에너지 충전 중...";
    if (percent >= 100) statusText = "MAX POWER! ⚡";
    else if (percent >= 80) statusText = "거의 다 왔어요! 🔥";

    const [showExercise, setShowExercise] = useState(false);

    const addExercise = (intensity) => {
        let salt = 0;
        let diff = "가볍게";
        if (intensity === 'low') { salt = 0.5; diff = "가볍게"; }
        if (intensity === 'mid') { salt = 1.0; diff = "적당히"; }
        if (intensity === 'high') { salt = 2.0; diff = "격하게"; }

        addLog(salt, `운동 (${diff})`);

        // Optional: We could also log water separately if needed, but for now we aggregate "Electrolyte Energy"
        // If we want to be explicit about water:
        // addLog(intensity === 'high' ? 3 : (intensity === 'mid' ? 2 : 1), '물(추가)');

        setShowExercise(false);
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>통합 기록 📊</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>소금, 물, 식단을 한눈에</p>
            </header>

            <EnergyGauge percent={percent} status={statusText} label="전해질 에너지" />

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>빠른 기록</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[
                        { icon: Droplet, label: '소금물', val: 2.0, color: '#2196F3' },
                        { icon: Cookie, label: '캡슐', val: 0.5, color: '#FF9800' },
                        { icon: UtensilsCrossed, label: '식사', val: 1.5, color: '#4CAF50' },
                        { icon: Soup, label: '국물', val: 3.0, color: '#F44336' },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => addLog(item.val, item.label)}
                            style={{
                                background: 'var(--background)', border: 'none', borderRadius: '12px', padding: '12px 4px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                            }}
                        >
                            <item.icon color={item.color} size={24} />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Exercise Button */}
                <button
                    onClick={() => setShowExercise(!showExercise)}
                    className="btn-primary"
                    style={{ marginTop: '12px', background: '#263238', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <span>🏃‍♂️ 운동 완료 (전해질 보충)</span>
                </button>

                {/* Exercise Intensity Selector */}
                {showExercise && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', animation: 'fadeIn 0.3s' }}>
                        <button onClick={() => addExercise('low')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}>
                            <div style={{ fontSize: '20px' }}>🚶</div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>가볍게</div>
                            <div style={{ fontSize: '10px', color: '#999' }}>+0.5g</div>
                        </button>
                        <button onClick={() => addExercise('mid')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}>
                            <div style={{ fontSize: '20px' }}>🏃</div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>적당히</div>
                            <div style={{ fontSize: '10px', color: '#999' }}>+1.0g</div>
                        </button>
                        <button onClick={() => addExercise('high')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}>
                            <div style={{ fontSize: '20px' }}>🔥</div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>격하게</div>
                            <div style={{ fontSize: '10px', color: '#999' }}>+2.0g</div>
                        </button>
                    </div>
                )}
            </div>

            {/* Log List */}
            <div className="card">
                <h2 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>오늘의 타임라인</h2>
                {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '20px' }}>아직 기록이 없어요.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {logs.map(log => (
                            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ color: '#ccc' }}>·</span>
                                    <span>{log.type}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>+{log.amount}g</span>
                                    <span style={{ color: '#999', fontSize: '12px' }}>{log.time.slice(0, 5)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stats;
