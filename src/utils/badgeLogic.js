export const getBadges = (logs, waterIntake, dailyStats, goal, user, engineStatus) => {
    const badges = [
        {
            id: 'new_researcher',
            name: '신입 연구원',
            desc: '첫 기록 달성',
            icon: '🧪',
            color: '#B0BEC5',
            condition: () => logs.length > 0
        },
        {
            id: 'streak_3',
            name: '작심삼일 돌파',
            desc: '3일 연속 기록',
            icon: '🔥',
            color: '#FFB74D',
            condition: () => checkStreak(logs, 3)
        },
        {
            id: 'streak_7',
            name: '일주일의 기적',
            desc: '7일 연속 기록',
            icon: '📅',
            color: '#FF7043',
            condition: () => checkStreak(logs, 7)
        },
        {
            id: 'streak_30',
            name: '한 달의 끈기',
            desc: '30일 연속 기록',
            icon: '🏆',
            color: '#FFD700',
            condition: () => checkStreak(logs, 30)
        },
        {
            id: 'water_master',
            name: '수분 마스터',
            desc: '하루 물 2L 섭취',
            icon: '💧',
            color: '#29B6F6',
            condition: () => waterIntake >= 2000
        },
        {
            id: 'salt_water_lover',
            name: '소금물 애호가',
            desc: '소금물 50회 기록',
            icon: '🌊',
            color: '#42A5F5',
            condition: () => logs.filter(l => l.label === '소금물 500ml').length >= 50
        },
        {
            id: 'clean_eater',
            name: '클린 식단 전문가',
            desc: '클린 식사 10회',
            icon: '🥗',
            color: '#66BB6A',
            condition: () => logs.filter(l => l.label === '클린 식사').length >= 10
        },
        {
            id: 'engine_burning',
            name: '엔진 풀가동',
            desc: '지방 연소 상태 도달',
            icon: '⚡',
            color: '#F44336',
            condition: () => engineStatus === 'burning'
        },
        {
            id: 'goal_achieved',
            name: '목표 달성',
            desc: '일일 목표량 달성',
            icon: '⚖️',
            color: '#AB47BC',
            condition: () => {
                const today = new Date().toLocaleDateString();
                const todaySalt = logs
                    .filter(l => new Date(l.timestamp).toLocaleDateString() === today && l.type !== 'water' && l.amount > 0)
                    .reduce((sum, l) => sum + l.amount, 0);
                return todaySalt >= goal && goal > 0;
            }
        },
        {
            id: 'fasting_pro',
            name: '공복의 미학',
            desc: '16시간 단식 달성',
            icon: '⏳',
            color: '#78909C',
            condition: () => {
                if (!dailyStats.fastingStart) return false;
                const diffMs = Date.now() - new Date(dailyStats.fastingStart).getTime();
                const hours = diffMs / (1000 * 60 * 60);
                return hours >= 16;
            }
        },
        {
            id: 'level_2_up',
            name: '레벨업',
            desc: '레벨 2 달성',
            icon: '🆙',
            color: '#8D6E63',
            condition: () => user.level >= 2
        },
        {
            id: 'master_lab_director',
            name: '키토 마스터',
            desc: '최고 레벨(5) 달성',
            icon: '💎',
            color: '#673AB7',
            condition: () => user.level >= 5
        }
    ];

    // Helper logic for streaks
    function checkStreak(logs, days) {
        if (logs.length === 0) return false;

        // Extract unique dates from logs, sorted descending
        const uniqueDates = [...new Set(logs.map(l => new Date(l.timestamp).toLocaleDateString()))]
            .sort((a, b) => new Date(b) - new Date(a)); // Descending

        if (uniqueDates.length < days) return false;

        // Check consecutive days starting from most recent
        // Allow streak to be "active" even if today isn't logged yet? 
        // Strict streak: must include today or yesterday.
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

        if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return false; // Streak broken

        let streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const current = new Date(uniqueDates[i]);
            const next = new Date(uniqueDates[i + 1]);
            const diffTime = Math.abs(current - next);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak >= days;
    }

    return badges.map(badge => ({
        ...badge,
        unlocked: badge.condition()
    }));
};
