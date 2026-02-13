import { useState } from 'react';
import { Settings, LogOut, Award, ChevronRight, Edit2, Save, Activity, FlaskConical } from 'lucide-react';
import { useData } from '../context/DataContext';

const Profile = () => {
    const { user, updateUser, resetData, goal, updateGoal } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user.name);

    // Derived from user.exp or similar logic
    const nextLevelExp = 100; // Simplified
    const progress = user.exp;

    const handleSave = () => {
        if (editName.trim()) {
            updateUser({ name: editName });
            setIsEditing(false);
        }
    };

    const handleGoalChange = () => {
        const newGoal = prompt("하루 목표 소금 섭취량(g)을 설정하세요:", goal);
        if (newGoal && !isNaN(newGoal)) {
            updateGoal(Number(newGoal));
        }
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>마이룸 🥼</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>연구원 신분증 및 설정</p>
            </header>

            {/* Researcher ID Card */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, #263238 0%, #37474F 100%)',
                color: 'white', marginBottom: '20px', position: 'relative', overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Holographic Effect overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '1px' }}>SECRET LAB ID</span>
                        <span style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>{user.title || '수습 연구원'}</span>
                    </div>
                    <FlaskConical size={24} color="rgba(255,255,255,0.3)" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1, marginBottom: '20px' }}>
                    <div style={{
                        width: '70px', height: '70px', borderRadius: '16px', background: '#ECEFF1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                        border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                        👨‍🔬
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>NAME</div>
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    value={editName} onChange={e => setEditName(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                                        fontSize: '16px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', width: '100px'
                                    }}
                                />
                                <button onClick={handleSave} style={{ background: '#00E676', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>
                                    <Save size={16} color="white" />
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'monospace' }}>{user.name}</div>
                                <Edit2 size={14} color="rgba(255,255,255,0.5)" style={{ cursor: 'pointer' }} onClick={() => { setIsEditing(true); setEditName(user.name); }} />
                            </div>
                        )}
                        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>ACCESS LEVEL: {user.level}</div>
                    </div>
                </div>

                {/* Level Bar */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px', opacity: 0.8 }}>
                        <span>EXP PROGRESS</span>
                        <span>{user.exp}/{nextLevelExp}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: '#00E676' }} />
                    </div>
                </div>
            </div>

            {/* Badges / Clinical Trials */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} color="#FFD700" /> 임상 시험 배지
                </h2>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {/* Mock Badges */}
                    {[
                        { name: '신입 연구원', desc: '첫 기록 달성', color: '#B0BEC5', icon: '🧪' },
                        { name: '작심삼일 돌파', desc: '3일 연속 기록', color: '#FFB74D', icon: '🔥' },
                        { name: '설탕 제거', desc: '임상 시험 완료', color: '#81C784', icon: '🍬' },
                    ].map((badge, i) => (
                        <div key={i} style={{
                            minWidth: '100px', padding: '12px', borderRadius: '12px', background: '#F8F9FA',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                            border: '1px solid #eee'
                        }}>
                            <div style={{ fontSize: '24px' }}>{badge.icon}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#455A64' }}>{badge.name}</div>
                            <div style={{ fontSize: '10px', color: '#90A4AE' }}>{badge.desc}</div>
                        </div>
                    ))}
                    <div style={{
                        minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', color: '#ccc', border: '2px dashed #eee', borderRadius: '12px'
                    }}>
                        + 더보기
                    </div>
                </div>
            </div>

            {/* Settings Menu */}
            <div className="card" style={{ padding: '0' }}>
                <div onClick={handleGoalChange} style={{
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
                    borderBottom: '1px solid #f0f0f0', cursor: 'pointer'
                }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={20} color="#2196F3" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>목표 섭취량 설정</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>현재: {goal}g</div>
                    </div>
                    <ChevronRight size={16} color="#ccc" />
                </div>

                <div onClick={() => alert('준비 중입니다.')} style={{
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
                    borderBottom: '1px solid #f0f0f0', cursor: 'pointer'
                }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Settings size={20} color="#9C27B0" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>앱 설정</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>알림, 테마</div>
                    </div>
                    <ChevronRight size={16} color="#ccc" />
                </div>

                <div onClick={resetData} style={{
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
                    borderTop: '5px solid #F5F5F5' // Separator
                }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LogOut size={20} color="#F44336" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#F44336' }}>데이터 초기화</div>
                        <div style={{ fontSize: '12px', color: '#FFCDD2' }}>모든 기록 영구 삭제</div>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#ccc' }}>
                Secret Lab V3.1 (Genesis)
            </div>
        </div>
    );
};

export default Profile;
