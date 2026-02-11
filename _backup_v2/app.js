const { useState, useEffect } = React;
const { Droplets, GlassWater, ChefHat, Info, History, Moon, Sun, Sunrise, Sunset, Coffee } = lucide;

// --- Components ---

const Header = () => {
    const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
    return (
        <header style={{ textAlign: 'center', padding: '20px 0' }}>
            <h1 className="text-highlight">🧂 솔티키토 (SaltyKeto)</h1>
            <p className="text-sm" style={{ marginTop: '4px' }}>{today}</p>
        </header>
    );
};

const SaltTracker = ({ intake, setIntake }) => {
    // Goal: 8-12g. Midpoint 10g.
    const progress = Math.min((intake / 12) * 100, 100);
    
    // Status Logic
    let statusColor = 'var(--primary-500)';
    let statusText = '부족해요';
    
    if (intake >= 8 && intake <= 12) {
        statusColor = 'var(--success)';
        statusText = '완벽해요! 🎉';
    } else if (intake > 12) {
        statusColor = 'var(--danger)';
        statusText = '조금 많아요';
    }

    const addSalt = (amount) => {
        setIntake(prev => parseFloat((prev + amount).toFixed(1)));
    };

    return (
        <div className="card">
            <div className="tracker-header">
                <div>
                    <h2>오늘의 소금</h2>
                    <p className="text-sm">목표: 8~12g (약 2-3 티스푼)</p>
                </div>
                <div style={{ background: '#E3F2FD', padding: '8px', borderRadius: '50%' }}>
                    <ChefHat color="#2196F3" size={24} />
                </div>
            </div>

            <div className="stat-display">
                <span className="stat-value" style={{ color: statusColor }}>{intake}</span>
                <span className="stat-unit">g</span>
            </div>
            <p className="text-sm" style={{ color: statusColor, fontWeight: 600 }}>{statusText}</p>

            <div className="progress-container">
                <div 
                    className="progress-bar" 
                    style={{ width: `${progress}%`, background: statusColor }}
                ></div>
            </div>

            <div className="btn-group">
                <button className="btn btn-soft" onClick={() => addSalt(-0.5)}>-0.5g</button>
                <button className="btn btn-primary" onClick={() => addSalt(1.0)}>+1.0g</button>
                <button className="btn btn-primary" onClick={() => addSalt(2.0)}>+2.0g</button>
            </div>
            <p className="text-sm" style={{ marginTop: '12px', textAlign: 'center', opacity: 0.8 }}>
                * 1 티스푼 ≈ 4g
            </p>
        </div>
    );
};

const WaterTracker = ({ cups, setCups }) => {
    // Goal: 3 cups (1.5L)
    const goal = 3;
    const progress = Math.min((cups / goal) * 100, 100);
    const isGoalReached = cups >= goal;

    const addCup = () => setCups(c => c + 1);
    const removeCup = () => setCups(c => Math.max(0, c - 1));

    return (
        <div className="card" style={{ borderTop: isGoalReached ? '4px solid var(--success)' : 'none' }}>
            <div className="tracker-header">
                <div>
                    <h2>수분 섭취</h2>
                    <p className="text-sm">따뜻한 물 3잔 (1.5L) 마시기</p>
                </div>
                <div style={{ background: '#FFF3E0', padding: '8px', borderRadius: '50%' }}>
                    <GlassWater color="#FF9800" size={24} />
                </div>
            </div>

            <div className="stat-display">
                <span className="stat-value" style={{ color: isGoalReached ? 'var(--success)' : 'var(--accent-700)' }}>
                    {cups}
                </span>
                <span className="stat-unit">잔 / {goal}잔 목표</span>
            </div>

            <div className="progress-container" style={{ background: '#FFF3E0' }}>
                <div 
                    className="progress-bar" 
                    style={{ 
                        width: `${progress}%`, 
                        background: isGoalReached ? 'var(--success)' : 'var(--accent-500)' 
                    }}
                ></div>
            </div>

            <div className="btn-group">
                <button className="btn btn-soft" onClick={removeCup}>-1잔</button>
                <button className="btn btn-accent" onClick={addCup}>+ 물 1잔 (500ml)</button>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', opacity: 0.7 }}>
                <div style={{ textAlign: 'center' }}>
                    <Sunrise size={20} />
                    <p className="text-sm">기상 직후</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Coffee size={20} />
                    <p className="text-sm">식사 전후</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Moon size={20} />
                    <p className="text-sm">자기 전</p>
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

const App = () => {
    // State Initialization with LocalStorage
    const [saltIntake, setSaltIntake] = useState(() => {
        const saved = localStorage.getItem('saltIntake');
        return saved ? parseFloat(saved) : 0;
    });

    const [waterCups, setWaterCups] = useState(() => {
        const saved = localStorage.getItem('waterCups');
        return saved ? parseInt(saved) : 0;
    });

    const [lastDate, setLastDate] = useState(() => localStorage.getItem('lastDate'));

    // Check for new day reset
    useEffect(() => {
        const todayStr = new Date().toDateString();
        if (lastDate !== todayStr) {
            // New day! Reset counters? 
            // Optional: Keep history. For MVP, we just reset if user confirms or auto-reset?
            // "Youngja" style: Let's just reset smoothly or notify using simple check.
            // For now, simple auto-reset if it's a new day to keep it useful.
            if (lastDate) { 
                setSaltIntake(0);
                setWaterCups(0);
            }
            setLastDate(todayStr);
            localStorage.setItem('lastDate', todayStr);
        }
    }, []);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('saltIntake', saltIntake);
    }, [saltIntake]);

    useEffect(() => {
        localStorage.setItem('waterCups', waterCups);
    }, [waterCups]);

    // Initialize Icons
    useEffect(() => {
        window.initIcons();
    });

    return (
        <React.Fragment>
            <Header />
            <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SaltTracker intake={saltIntake} setIntake={setSaltIntake} />
                <WaterTracker cups={waterCups} setCups={setWaterCups} />
            </main>
            <footer style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '12px' }}>
                <p>Designed by Youngja with Stitch MCP 💖</p>
                <button 
                    onClick={() => {
                        if(confirm('정말 모든 기록을 초기화할까요?')) {
                            setSaltIntake(0);
                            setWaterCups(0);
                        }
                    }}
                    style={{ 
                        background: 'none', border: 'none', color: '#999', 
                        marginTop: '10px', cursor: 'pointer', textDecoration: 'underline' 
                    }}
                >
                    데이터 초기화
                </button>
            </footer>
        </React.Fragment>
    );
};

// Render
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
