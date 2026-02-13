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

    const [user, setUser] = useState(() => safeParse('secretLab_user', {
        name: '김연구원',
        level: 1,
        exp: 0,
        title: '수습 연구원'
    }));

    // Ensure logs is always an array
    const [logs, setLogs] = useState(() => {
        const parsed = safeParse('secretLab_logs', []);
        return Array.isArray(parsed) ? parsed : [];
    });

    const [weight, setWeight] = useState(() =>
        Number(localStorage.getItem('secretLab_weight')) || 0.0
    );

    // Renamed 'condition' to 'energy' for Bio-Rhythm Scanner
    // energy: { level: 0-100, mood: 'text', date: 'YYYY-MM-DD' }
    const [energy, setEnergy] = useState(() =>
        safeParse('secretLab_energy', null)
    );

    const [goal, setGoal] = useState(() =>
        Number(localStorage.getItem('secretLab_goal')) || 10
    );

    const [settings, setSettings] = useState(() =>
        safeParse('secretLab_settings', { theme: 'light', notifications: true })
    );

    // --- Persistence Effects ---
    useEffect(() => { localStorage.setItem('secretLab_user', JSON.stringify(user)); }, [user]);
    useEffect(() => { localStorage.setItem('secretLab_logs', JSON.stringify(logs)); }, [logs]);
    useEffect(() => { localStorage.setItem('secretLab_weight', weight); }, [weight]);
    useEffect(() => { localStorage.setItem('secretLab_energy', JSON.stringify(energy)); }, [energy]);
    useEffect(() => { localStorage.setItem('secretLab_goal', goal); }, [goal]);
    useEffect(() => {
        localStorage.setItem('secretLab_settings', JSON.stringify(settings));
        // Apply theme immediately
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings]);

    // --- Actions ---
    const addLog = (amount, type) => {
        const newLog = {
            id: Date.now(),
            amount,
            type,
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString() // Added strictly for sorting
        };
        setLogs(prev => [newLog, ...prev]);

        // Add EXP for logging
        gainExp(10);
    };

    const updateWeight = (newWeight) => {
        setWeight(newWeight);
        gainExp(50); // Big reward for weighing
    };

    const updateEnergy = (level, mood) => {
        setEnergy({
            level,
            mood,
            date: new Date().toLocaleDateString()
        });
        gainExp(20);
    };

    const updateGoal = (newGoal) => {
        setGoal(newGoal);
    };

    const gainExp = (amount) => {
        setUser(prev => {
            let newExp = prev.exp + amount;
            let newLevel = prev.level;

            // Simple Level Up Logic (100 exp per level)
            if (newExp >= 100) {
                newLevel += Math.floor(newExp / 100);
                newExp = newExp % 100;
                // In a real app, we might want to handle this notification differently
                // alert(`🎉 레벨 업! Lv.${newLevel} 달성!`); 
            }

            // Title System
            let newTitle = prev.title;
            if (newLevel >= 10) newTitle = '수석 연구원';
            else if (newLevel >= 5) newTitle = '선임 연구원';
            else if (newLevel >= 3) newTitle = '정식 연구원';

            return { ...prev, level: newLevel, exp: newExp, title: newTitle };
        });
    };

    const updateUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    const resetData = () => {
        if (confirm("모든 연구 데이터를 폐기하시겠습니까? (복구 불가)")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const removeLog = (id) => {
        setLogs(prev => prev.filter(log => log.id !== id));
    };

    return (
        <DataContext.Provider value={{
            user, logs, weight, energy, goal, settings,
            addLog, removeLog, updateWeight, updateEnergy, updateUser, updateGoal, updateSettings, resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};
