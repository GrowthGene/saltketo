import { useState, useMemo } from 'react';
import { Calendar, BarChart2, Trash2, Clock, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

const Stats = () => {
    const { logs, removeLog, goal } = useData();
    const [range, setRange] = useState('day'); // day, week, month, 6month

    // --- Helper Functions ---
    const getRangeData = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return logs.filter(log => {
            if (!log.timestamp) return false;
            const logDate = new Date(log.timestamp);
            const logDay = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());

            if (range === 'day') {
                return logDay.getTime() === today.getTime();
            } else if (range === 'week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                return logDay >= weekAgo;
            } else if (range === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                return logDay >= monthAgo;
            } else if (range === '6month') {
                const sixMonthAgo = new Date(today);
                sixMonthAgo.setMonth(today.getMonth() - 6);
                return logDay >= sixMonthAgo;
            }
            return false;
        });
    };

    const filteredLogs = useMemo(() => getRangeData(), [logs, range]);

    // Sorting: Newest first
    const sortedLogs = [...filteredLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Stats Calculation
    const totalAmount = filteredLogs.reduce((acc, log) => acc + log.amount, 0);
    const divisors = { day: 1, week: 7, month: 30, '6month': 180 };
    const averageAmount = filteredLogs.length > 0 ? (totalAmount / divisors[range]).toFixed(1) : 0;

    // --- Chart Data Preparation (Simple grouping) ---
    // Group by Date for Weekly/Monthly view
    const chartData = useMemo(() => {
        if (range === 'day') return [];

        const groups = {};
        filteredLogs.forEach(log => {
            const dateStr = new Date(log.timestamp).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
            if (!groups[dateStr]) groups[dateStr] = 0;
            groups[dateStr] += log.amount;
        });

        // Fill in missing days? (Optional, skipping for simplicity)
        return Object.entries(groups).map(([date, amount]) => ({ date, amount })).reverse();
    }, [filteredLogs, range]);


    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>데이터 분석 📈</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>연구 기록 분석 및 관리</p>
            </header>

            {/* Range Selector Tabs */}
            <div style={{
                display: 'flex', background: '#F5F5F5', borderRadius: '12px', padding: '4px', marginBottom: '24px'
            }}>
                {['day', 'week', 'month', '6month'].map(r => (
                    <button key={r} onClick={() => setRange(r)} style={{
                        flex: 1, border: 'none', background: range === r ? 'white' : 'transparent',
                        padding: '8px 0', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                        color: range === r ? 'var(--primary-600)' : '#90A4AE',
                        boxShadow: range === r ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                        {r === 'day' && '오늘'}
                        {r === 'week' && '1주일'}
                        {r === 'month' && '1개월'}
                        {r === '6month' && '6개월'}
                    </button>
                ))}
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#90A4AE', marginBottom: '4px' }}>총 섭취량</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-600)' }}>
                        {totalAmount.toFixed(1)}<span style={{ fontSize: '14px' }}>g</span>
                    </div>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#90A4AE', marginBottom: '4px' }}>{range === 'day' ? '목표 달성률' : '일일 평균'}</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#FF9800' }}>
                        {range === 'day' ? Math.min((totalAmount / goal) * 100, 100).toFixed(0) + '%' : averageAmount + 'g'}
                    </div>
                </div>
            </div>

            {/* Chart (For Week/Month/6Month) */}
            {range !== 'day' && (
                <div className="card" style={{ marginBottom: '24px', minHeight: '200px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart2 size={16} /> 기간별 섭취 추이
                    </h3>
                    {chartData.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '8px', overflowX: 'auto' }}>
                            {chartData.map((d, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '30px' }}>
                                    <div style={{
                                        width: '12px',
                                        height: `${Math.min((d.amount / goal) * 100, 100)}%`,
                                        background: d.amount > goal ? '#FF5252' : '#4CAF50',
                                        borderRadius: '6px',
                                        marginBottom: '6px'
                                    }} />
                                    <div style={{ fontSize: '10px', color: '#ccc', writingMode: 'vertical-rl' }}>{d.date}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>데이터가 부족합니다</div>
                    )}
                </div>
            )}

            {/* Detail List (Log Management) - Always Visible but optimized for Day */}
            <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> {range === 'day' ? '오늘의 타임라인 (관리)' : '상세 기록'}
                </h3>

                {sortedLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#ccc', padding: '30px', fontSize: '13px' }}>
                        기록이 없습니다.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {sortedLogs.map((log, index) => (
                            <div key={log.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 0', borderBottom: '1px solid #f0f0f0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        background: log.type === 'exercise' ? '#E3F2FD' : log.type === 'meal' ? '#E8F5E9' : '#ECEFF1',
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                                    }}>
                                        {log.type === 'exercise' ? '🏃' : log.type === 'meal' ? '🍽️' : '🧂'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#37474F' }}>
                                            {log.label || (log.type === 'exercise' ? '운동' : '소금 섭취')}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#90A4AE' }}>
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        fontWeight: 700,
                                        color: log.amount > 0 ? 'var(--primary-600)' : log.amount < 0 ? '#1976D2' : '#78909C'
                                    }}>
                                        {log.amount > 0 ? '+' : ''}{log.amount}g
                                    </span>
                                    {/* Delete Button available only in 'day' view or for all? User requested delete feature. Better to allow always. */}
                                    <button onClick={() => { if (confirm('이 기록을 삭제하시겠습니까?')) removeLog(log.id) }} style={{
                                        background: '#FFEBEE', border: 'none', borderRadius: '8px',
                                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}>
                                        <Trash2 size={14} color="#F44336" />
                                    </button>
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
