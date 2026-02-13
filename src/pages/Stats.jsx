import { useState } from 'react';
import { Droplet, Cookie, UtensilsCrossed, Soup, Activity } from 'lucide-react';
import EnergyGauge from '../components/EnergyGauge';
import { useData } from '../context/DataContext';

const Stats = () => {
    const { logs, addLog, goal } = useData();
    const [showExercise, setShowExercise] = useState(false);

    // Safety check and sort logs by timestamp (newest first)
    const safeLogs = Array.isArray(logs) ? [...logs].sort((a, b) => {
        // Fallback to ID sorting if timestamp is missing (legacy data)
        if (b.timestamp && a.timestamp) return new Date(b.timestamp) - new Date(a.timestamp);
        return b.id - a.id;
    }) : [];

    const totalSalt = safeLogs
        .filter(log => log.time.includes(new Date().toLocaleDateString()) || true) // Simplified daily filter
        .reduce((acc, log) => acc + log.amount, 0);

    const percent = Math.min((totalSalt / goal) * 100, 120);

    let statusText = "에너지 충전 중...";
    if (percent >= 100) statusText = "MAX POWER! ⚡";
    else if (percent >= 80) statusText = "거의 다 왔어요! 🔥";

    const addExercise = (intensity) => {
        let salt = 0;
        let diff = "가볍게";
        // Exercise actually *depletes* salt/water, but in this gamified logic, 
        // we might be tracking "Intake needed" or just logging it.
        // The original code ADDED salt amount. Let's keep it consistent: 
        // "Exercise completed (Replenishment needed)" -> Adds a log that counts towards the goal? 
        // Actually, usually exercise MEANS you need MORE salt. 
        // So adding to the "Intake" log might be confusing if it implies you ATE salt.
        // But for "Secret Lab" context, maybe we are logging "Activity" which requires "Fuel"?
        // Let's stick to the original logic: It adds to the log list.
        if (intensity === 'low') { salt = 0.5; diff = "가볍게"; }
        if (intensity === 'mid') { salt = 1.0; diff = "적당히"; }
        if (intensity === 'high') { salt = 2.0; diff = "격하게"; }

        addLog(salt, `운동 (${diff})`);
        setShowExercise(false);
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>통합 기록 📊</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>연구 데이터 로그</p>
            </header>

            <EnergyGauge percent={percent} status={statusText} label={`전해질 에너지 (${totalSalt.toFixed(1)}/${goal}g)`} />

            {/* Exercise Button */}
            <div className="card" style={{ marginBottom: '20px', marginTop: '20px' }}>
                <div onClick={() => setShowExercise(!showExercise)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#E0F7FA', padding: '8px', borderRadius: '10px' }}>
                            <Activity size={20} color="#00BCD4" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>운동 에너지 소비</div>
                            <div style={{ fontSize: '12px', color: '#90A4AE' }}>활동량을 기록하여 목표를 조정하세요</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '20px' }}>{showExercise ? '▲' : '▼'}</div>
                </div>

                {/* Exercise Intensity Selector */}
                {showExercise && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', animation: 'fadeIn 0.3s' }}>
                        <button onClick={() => addExercise('low')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}>
                            <div style={{ fontSize: '20px' }}>🚶</div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>가볍게</div>
                            <div style={{ fontSize: '10px', color: '#999' }}>+0.5g 필요</div>
                        </button>
                        <button onClick={() => addExercise('mid')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}>
                            <div style={{ fontSize: '20px' }}>🏃</div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>적당히</div>
                            <div style={{ fontSize: '10px', color: '#999' }}>+1.0g 필요</div>
                        </button>
                        <button onClick={() => addExercise('high')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}>
                            <div style={{ fontSize: '20px' }}>🔥</div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>격하게</div>
                            <div style={{ fontSize: '10px', color: '#999' }}>+2.0g 필요</div>
                        </button>
                    </div>
                )}
            </div>

            {/* Log List */}
            <div className="card">
                <h2 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>오늘의 타임라인</h2>
                {safeLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '20px' }}>
                        아직 기록된 데이터가 없습니다.<br />홈 화면에서 '빠른 투입'을 진행해주세요.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {safeLogs.map((log, index) => (
                            <div key={log.id} style={{
                                display: 'flex', justifyContent: 'space-between', fontSize: '14px',
                                padding: '12px 0',
                                borderBottom: index !== safeLogs.length - 1 ? '1px solid #f0f0f0' : 'none'
                            }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ color: '#90A4AE', fontSize: '12px', width: '40px' }}>
                                        {log.time.split(' ')[0]}<br />{log.time.split(' ')[1].slice(0, 5)}
                                    </span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600, color: '#455A64' }}>{log.type}</span>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>+{log.amount}g</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stats;
