import { useState } from 'react';
import { Settings, LogOut, Award, ChevronRight, Edit2, Save } from 'lucide-react';
import { useData } from '../context/DataContext';

const Profile = () => {
    const { user, updateUser, resetData } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user.name);

    const handleSave = () => {
        if (editName.trim()) {
            updateUser({ name: editName });
            setIsEditing(false);
        }
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>마이룸 🥼</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>연구원님의 개인 공간입니다.</p>
            </header>

            {/* ID Card */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, #1A1D1E 0%, #343A40 100%)',
                color: 'white', marginBottom: '20px', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px'
                    }}>
                        👨‍🔬
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>수석 연구원</div>
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    value={editName} onChange={e => setEditName(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                                        fontSize: '18px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', width: '120px'
                                    }}
                                />
                                <button onClick={handleSave} style={{ background: '#00E676', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>
                                    <Save size={16} color="white" />
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '20px', fontWeight: 700 }}>{user.name}</div>
                                <Edit2 size={16} color="rgba(255,255,255,0.5)" style={{ cursor: 'pointer' }} onClick={() => { setIsEditing(true); setEditName(user.name); }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Level Bar */}
                <div style={{ marginTop: '24px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', opacity: 0.8 }}>
                        <span>Lv.{user.level}</span>
                        <span>다음 레벨까지 {100 - user.exp}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${user.exp}%`, height: '100%', background: '#00E676' }} />
                    </div>
                </div>

                {/* Decor */}
                <div style={{
                    position: 'absolute', top: -20, right: -20, width: '120px', height: '120px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%'
                }} />
            </div>

            {/* Menu List */}
            <div className="card" style={{ padding: '0' }}>
                {[
                    { icon: Award, label: '획득한 뱃지', desc: '3개 보유 중', action: 'badge' },
                    { icon: Settings, label: '앱 설정', desc: '알림, 테마', action: 'setting' },
                    { icon: LogOut, label: '데이터 초기화', desc: '모든 기록 삭제', color: 'var(--danger)', action: 'reset' },
                ].map((item, i) => (
                    <div key={item.label} style={{
                        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
                        borderBottom: i !== 2 ? '1px solid #f0f0f0' : 'none', cursor: 'pointer'
                    }} onClick={() => {
                        if (item.action === 'reset') resetData();
                        else if (item.action === 'badge') alert('🥇 얼리 어답터\n🥈 첫 기록 달성\n🥉 작심삼일 돌파\n\n(현재는 예시 배지입니다!)');
                        else if (item.action === 'setting') alert('🔔 알림 설정: ON\n🌙 다크 모드: Auto\n\n(설정 기능 준비 중)');
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', background: '#F8F9FA',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <item.icon size={20} color={item.color || 'var(--text-main)'} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: item.color || 'var(--text-main)' }}>{item.label}</div>
                            {item.desc && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>}
                        </div>
                        <ChevronRight size={16} color="#ccc" />
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#ccc' }}>
                Secret Lab V3.0 (Genesis)
            </div>
        </div>
    );
};

export default Profile;
