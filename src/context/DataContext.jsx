import { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // --- State Initialization (Load from LocalStorage) ---
    const safeParse = (key, fallback) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : fallback;
        } catch (e) {
            console.error(`Error parsing ${key}`, e);
            return fallback;
        }
    };

    // --- V3 State Initialization ---
    const [user, setUser] = useState(() => safeParse('secretLab_user', {
        name: '김연구원',
        level: 1,
        rp: 0, // Research Points (Cumulative)
        title: '보조 연구원', // Lv.1 Intern
        goalWeight: 0
    }));

    // Daily Stats for Algorithm (Reset daily)
    const [dailyStats, setDailyStats] = useState(() => {
        const stored = safeParse('secretLab_daily', { date: new Date().toLocaleDateString() });
        if (stored.date !== new Date().toLocaleDateString()) {
            return {
                date: new Date().toLocaleDateString(),
                purityScore: 0, // 0: None, 1: Clean, 2: Safe, 3: Dirty
                fastingStart: null, // Timestamp of last meal
                condition: 0 // 1-5 Scale
            };
        }
        return stored;
    });

    const [logs, setLogs] = useState(() => {
        const parsed = safeParse('secretLab_logs', []);
        return Array.isArray(parsed) ? parsed : [];
    });

    const [waterIntake, setWaterIntake] = useState(() => {
        const stored = safeParse('secretLab_water', { date: new Date().toLocaleDateString(), amount: 0 });
        return stored.date !== new Date().toLocaleDateString() ? 0 : stored.amount;
    });

    const [settings, setSettings] = useState(() =>
        safeParse('secretLab_settings', { theme: 'light', notifications: true })
    );

    // Derived State
    const goal = user.goalWeight > 0 ? user.goalWeight : 10; // Default to 10g if not set

    // --- Persistence ---
    useEffect(() => { localStorage.setItem('secretLab_user', JSON.stringify(user)); }, [user]);
    useEffect(() => { localStorage.setItem('secretLab_daily', JSON.stringify(dailyStats)); }, [dailyStats]);
    useEffect(() => { localStorage.setItem('secretLab_logs', JSON.stringify(logs)); }, [logs]);
    useEffect(() => {
        localStorage.setItem('secretLab_water', JSON.stringify({ date: new Date().toLocaleDateString(), amount: waterIntake }));
    }, [waterIntake]);
    useEffect(() => {
        localStorage.setItem('secretLab_settings', JSON.stringify(settings));
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings]);

    // --- V3 Core Logic ---

    // 1. RP (Research Point) & Level System
    const LEVEL_THRESHOLDS = [0, 500, 2000, 5000, 15000];
    const TITLES = ['보조 연구원', '주니어 연구원', '시니어 연구원', '수석 연구원', '키토 마스터'];

    const gainRP = (amount) => {
        setUser(prev => {
            const newRP = prev.rp + amount;

            // Calculate Level based on RP
            let newLevel = 1;
            for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                if (newRP >= LEVEL_THRESHOLDS[i]) newLevel = i + 1;
            }

            const newTitle = TITLES[newLevel - 1] || TITLES[TITLES.length - 1];

            return { ...prev, rp: newRP, level: newLevel, title: newTitle };
        });
    };

    // 2. Engine Status Algorithm
    // Returns: 'idle', 'warming', 'burning', 'overheat' (warning)
    // Returns: 'idle', 'warming', 'burning', 'overheat' (warning)
    const getEngineStatus = () => {
        const SALT_GOAL = goal; // Use dynamic goal

        // Filter today's logs
        const todayLogs = logs.filter(l => {
            if (!l.timestamp) return false;
            return new Date(l.timestamp).toLocaleDateString() === new Date().toLocaleDateString();
        });

        // Calculate Salt Intake (Positive logs only)
        const todaySalt = todayLogs
            .reduce((sum, log) => sum + (log.type !== 'water' && log.amount > 0 ? log.amount : 0), 0);

        // Calculate Activity Points (Negative logs -> Absolute value)
        const activityPoints = todayLogs
            .reduce((sum, log) => sum + (log.amount < 0 ? Math.abs(log.amount) : 0), 0);

        const saltRatio = Math.min(todaySalt / SALT_GOAL, 1.5); // Cap at 150%
        const purity = dailyStats.purityScore; // 1(High), 2(Med), 3(Low/Dirty)

        // Fasting Hours
        let fastingHours = 0;
        if (dailyStats.fastingStart) {
            const diffMs = Date.now() - new Date(dailyStats.fastingStart).getTime();
            fastingHours = diffMs / (1000 * 60 * 60);
        }

        // --- Logic Core ---
        // If Dirty (3) -> Overheat (Red Warning) immediately
        if (purity === 3) return { status: 'overheat', color: '#FF5252', message: '불순물 감지! 엔진 경고!' };

        // Clean (1) or Safe (2)
        let score = 0;
        if (purity === 1) score += 50;
        if (purity === 2) score += 30;

        score += (saltRatio * 30); // Max 30-45 points
        if (fastingHours > 12) score += 20;

        // Add Activity Bonus (e.g., 20 points per 1g of salt burned/exercise)
        score += (activityPoints * 20);

        if (score >= 80) return { status: 'burning', color: '#448AFF', message: '지방 연소 엔진 풀가동! 🔥' };
        if (score >= 40) return { status: 'warming', color: '#FFCA28', message: '대사 엔진 예열 중...' };
        return { status: 'idle', color: '#90A4AE', message: '엔진 대기 상태' };
    };

    // --- Notification Logic ---
    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    };

    const sendNotification = (title, body) => {
        if (settings.notifications && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico' }); // Assuming favicon exists
        }
    };

    // Track previous status to detect upgrades
    const [prevStatus, setPrevStatus] = useState('idle');
    const [goalReachedNotified, setGoalReachedNotified] = useState(false);

    useEffect(() => {
        if (!settings.notifications) return;

        const currentStatus = getEngineStatus();

        // 1. Engine Status Upgrade Check
        const statusOrder = ['idle', 'warming', 'burning'];
        const prevIndex = statusOrder.indexOf(prevStatus);
        const currIndex = statusOrder.indexOf(currentStatus.status);

        if (currIndex > prevIndex) {
            sendNotification(
                `🔥 ${currentStatus.status === 'burning' ? '엔진 풀가동!' : '엔진 예열 완료!'}`,
                currentStatus.message
            );
        }
        setPrevStatus(currentStatus.status);

        // 2. Goal Achievement Check
        // Calculate Salt Intake (Positive logs only)
        const todayLogs = logs.filter(l => {
            if (!l.timestamp) return false;
            return new Date(l.timestamp).toLocaleDateString() === new Date().toLocaleDateString();
        });
        const todaySalt = todayLogs
            .reduce((sum, log) => sum + (log.type !== 'water' && log.amount > 0 ? log.amount : 0), 0);

        // If we crossed the goal and haven't notified yet today
        if (todaySalt >= goal && !goalReachedNotified && goal > 0) {
            sendNotification("🎉 목표 달성!", `오늘의 소금 섭취 목표 ${goal}g을 달성했습니다!`);
            setGoalReachedNotified(true);
        }

        // Reset notification flag if new day (handled loosely here, better in daily reset logic)
        // But for reactiveness, if salt drops below goal (e.g. log deletion), reset? 
        // Let's reset if intake < goal.
        if (todaySalt < goal) {
            setGoalReachedNotified(false);
        }

    }, [logs, settings.notifications, goal]); // Re-run when logs change

    // --- Actions ---
    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const updateSettings = async (updates) => {
        if (updates.notifications === true) {
            const granted = await requestNotificationPermission();
            if (!granted) {
                alert("알림 권한이 차단되어 있습니다. 브라우저 설정에서 권한을 허용해주세요.");
                return; // Don't enable if denied
            }
        }
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const updateGoal = (newGoal) => {
        setUser(prev => ({ ...prev, goalWeight: newGoal }));
    };

    const addLog = (amount, label, type = 'salt') => {
        const newLog = {
            id: Date.now(),
            amount,
            label,
            type, // 'salt', 'meal', 'exercise'
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString()
        };
        setLogs(prev => [newLog, ...prev]);

        // RP Logic based on type
        if (type === 'salt') gainRP(10);
        if (type === 'exercise') gainRP(20);
        if (type === 'meal') gainRP(5);
    };

    const addWater = (amount) => {
        setWaterIntake(prev => prev + amount);
        gainRP(5);
    };

    const removeLog = (id) => {
        setLogs(prev => prev.filter(log => log.id !== id));
    };

    const recordMeal = (grade) => {
        // grade: 1(Clean), 2(Safe), 3(Dirty)
        setDailyStats(prev => ({
            ...prev,
            purityScore: grade, // Overwrite for "Today's Purity" (simplification)
            fastingStart: new Date().toISOString() // Reset fasting timer
        }));

        // Log the meal event
        const label = grade === 1 ? '클린 키토식' : grade === 2 ? '일반 식사' : '치팅/가공식';
        const saltAmount = grade === 2 ? 3 : 0; // 3g for General Meal
        addLog(saltAmount, label, 'meal');

        if (grade === 1) gainRP(50);
        else if (grade === 2) gainRP(30);
        else gainRP(10);
    };

    const updateCondition = (score) => {
        setDailyStats(prev => ({ ...prev, condition: score }));
        gainRP(10); // Condition check bonus
    };

    const resetData = () => {
        if (confirm("모든 연구 데이터를 폐기하시겠습니까?")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <DataContext.Provider value={{
            user, logs, waterIntake, dailyStats, settings, goal,
            addLog, addWater, recordMeal, updateCondition, resetData, getEngineStatus, removeLog,
            updateUser, updateSettings, updateGoal
        }}>
            {children}
        </DataContext.Provider>
    );
};
