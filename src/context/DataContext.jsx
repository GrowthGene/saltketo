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

    const [user, setUser] = useState(() => safeParse('secretLab_user', { name: '김연구원', level: 1, exp: 0 }));
    const [logs, setLogs] = useState(() => safeParse('secretLab_logs', []));

    const [weight, setWeight] = useState(() =>
        Number(localStorage.getItem('secretLab_weight')) || 0.0
    );

    const [condition, setCondition] = useState(() =>
        localStorage.getItem('secretLab_condition') || null
    );

    // --- Persistence Effects ---
    useEffect(() => { localStorage.setItem('secretLab_user', JSON.stringify(user)); }, [user]);
    useEffect(() => { localStorage.setItem('secretLab_logs', JSON.stringify(logs)); }, [logs]);
    useEffect(() => { localStorage.setItem('secretLab_weight', weight); }, [weight]);
    useEffect(() => {
        if (condition) localStorage.setItem('secretLab_condition', condition);
    }, [condition]);

    // --- Actions ---
    const addLog = (amount, type) => {
        const newLog = { id: Date.now(), amount, type, time: new Date().toLocaleTimeString() };
        setLogs(prev => [newLog, ...prev]);

        // Add EXP for logging
        gainExp(10);
    };

    const updateWeight = (newWeight) => {
        setWeight(newWeight);
        gainExp(50); // Big reward for weighing
    };

    const updateCondition = (status) => {
        setCondition(status);
        gainExp(20);
    };

    const gainExp = (amount) => {
        setUser(prev => {
            let newExp = prev.exp + amount;
            let newLevel = prev.level;

            // Simple Level Up Logic (100 exp per level)
            if (newExp >= 100) {
                newLevel += Math.floor(newExp / 100);
                newExp = newExp % 100;
                alert(`🎉 레벨 업! Lv.${newLevel} 달성!`);
            }

            return { ...prev, level: newLevel, exp: newExp };
        });
    };

    const updateUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    const resetData = () => {
        if (confirm("모든 연구 데이터를 삭제하시겠습니까? (복구 불가)")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <DataContext.Provider value={{
            user, logs, weight, condition,
            addLog, updateWeight, updateCondition, updateUser, resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};
