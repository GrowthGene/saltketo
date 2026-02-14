import { useState, useMemo } from 'react';
import { Calendar, Trash2, Clock, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

// --- Animated Counter Component ---
const AnimatedCounter = ({ value, unit, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '24px', fontWeight: 800, color }}
        >
            {value}<span style={{ fontSize: '14px', color: '#90A4AE' }}>{unit}</span>
        </motion.div>
    );
};

const Stats = () => {
    const { logs, removeLog, goal } = useData();
    const [range, setRange] = useState('week'); // Default to week for chart demo

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

    // Sorting: Newest first for list
    const sortedLogs = [...filteredLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Stats Calculation
    const totalAmount = filteredLogs.reduce((acc, log) => acc + log.amount, 0);
    const divisors = { day: 1, week: 7, month: 30, '6month': 180 };
    const averageAmount = filteredLogs.length > 0 ? (totalAmount / divisors[range]).toFixed(1) : 0;

    // --- Chart Data Preparation ---
    const chartData = useMemo(() => {
        if (range === 'day') return [];

        const groups = {};
        // Initialize last 7/30 days with 0
        const days = range === 'week' ? 7 : range === 'month' ? 30 : 180;
        const now = new Date();
        for (let i = 0; i < days; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
            groups[key] = { date: key, amount: 0, fullDate: d };
        }

        filteredLogs.forEach(log => {
            const dateStr = new Date(log.timestamp).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
            if (groups[dateStr]) {
                groups[dateStr].amount += log.amount;
            }
        });

        return Object.values(groups).sort((a, b) => a.fullDate - b.fullDate);
    }, [filteredLogs, range]);

    // --- Heatmap Data (Last 365 days mostly, but let's do simple Monthly Grid) ---
    // For simplicity/demo: Last 28 days grid
    const heatmapData = useMemo(() => {
        const data = [];
        const now = new Date();
        for (let i = 0; i < 28; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - (27 - i));
            const dateStr = d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });

            // Find logs for this day
            const logsForDay = logs.filter(l =>
                new Date(l.timestamp).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) === dateStr
            );
            const total = logsForDay.reduce((sum, l) => sum + (l.type !== 'exercise' ? l.amount : 0), 0); // Exclude exercise for "Intake" heatmap

            let status = 'empty';
            if (total > 0) status = 'low';
            if (total >= goal) status = 'goal';

            data.push({ date: dateStr, status, total });
        }
        return data;
    }, [logs, goal]);


    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>데이터 분석 📈</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>연구 기록 시각화</p>
            </header>

            {/* Range Selector Tabs */}
            <div style={{
                display: 'flex', background: '#F5F5F5', borderRadius: '12px', padding: '4px', marginBottom: '24px'
            }}>
                {['day', 'week', 'month'].map(r => (
                    <motion.button
                        key={r}
                        onClick={() => setRange(r)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            flex: 1, border: 'none', background: range === r ? 'white' : 'transparent',
                            padding: '8px 0', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                            color: range === r ? 'var(--primary-600)' : '#90A4AE',
                            boxShadow: range === r ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        {r === 'day' && '오늘'}
                        {r === 'week' && '1주일'}
                        {r === 'month' && '1개월'}
                    </motion.button>
                ))}
            </div>

            {/* Animated Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#90A4AE', marginBottom: '4px' }}>총 섭취량</div>
                    <AnimatedCounter value={totalAmount.toFixed(1)} unit="g" color="var(--primary-600)" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                    className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#90A4AE', marginBottom: '4px' }}>{range === 'day' ? '목표 달성률' : '일일 평균'}</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#FF9800' }}>
                        {range === 'day'
                            ? Math.min((totalAmount / goal) * 100, 100).toFixed(0) + '%'
                            : averageAmount + 'g'}
                    </div>
                </motion.div>
            </div>

            {/* Advanced Chart Section */}
            {range !== 'day' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="card" style={{ marginBottom: '24px', height: '300px', padding: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={16} /> 주간 섭취 트렌드
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF9800" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#FF9800" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#90A4AE' }} interval="preserveStartEnd" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#FF9800"
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                                strokeWidth={3}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            )}

            {/* Consistency Heatmap (Contribution Graph style) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="card" style={{ marginBottom: '24px', padding: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} /> 최근 28일 꾸준함 (나만의 잔디)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                    {heatmapData.map((day, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.02 }}
                            style={{
                                aspectRatio: '1/1',
                                borderRadius: '4px',
                                background: day.status === 'goal' ? '#4CAF50' : day.status === 'low' ? '#C8E6C9' : '#F5F5F5',
                                border: day.date === new Date().toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) ? '2px solid #2196F3' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '10px', color: day.status === 'goal' ? 'white' : '#90A4AE',
                                cursor: 'pointer'
                            }}
                            title={`${day.date}: ${day.total}g`}
                        >
                            {/* Optional: Show date only for today or specifically */}
                        </motion.div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', fontSize: '10px', color: '#90A4AE' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#F5F5F5', borderRadius: 2 }} /> 기록 없음</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#C8E6C9', borderRadius: 2 }} /> 부족</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#4CAF50', borderRadius: 2 }} />
                        <span style={{ fontWeight: 700, color: '#4CAF50' }}>달성!</span>
                    </span>
                </div>
            </motion.div>

            {/* Detail List */}
            <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> {range === 'day' ? '오늘의 타임라인' : '상세 기록'}
                </h3>
                {sortedLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#ccc', padding: '30px', fontSize: '13px' }}>
                        기록이 없습니다.
                    </div>
                ) : (
                    <AnimatePresence>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {sortedLogs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    layout
                                    style={{
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
                                        <button onClick={() => { if (confirm('이 기록을 삭제하시겠습니까?')) removeLog(log.id) }} style={{
                                            background: '#FFEBEE', border: 'none', borderRadius: '8px',
                                            width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}>
                                            <Trash2 size={14} color="#F44336" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Stats;
