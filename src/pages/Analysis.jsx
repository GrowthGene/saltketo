import { useState } from 'react';
import { Activity, AlertTriangle, Droplet, Zap, CheckCircle, RefreshCcw } from 'lucide-react';

const Analysis = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [result, setResult] = useState(null);

    const symptoms = [
        { id: 'headache', label: '두통', category: 'salt_deficiency' },
        { id: 'dizziness', label: '어지러움 (기립성)', category: 'salt_deficiency' },
        { id: 'fatigue', label: '무기력/피로', category: 'salt_deficiency' },
        { id: 'brainfog', label: '브레인 포그 (집중력 저하)', category: 'salt_deficiency' },
        { id: 'thirst', label: '심한 갈증', category: 'dehydration' },
        { id: 'drymouth', label: '입마름', category: 'dehydration' },
        { id: 'urine_dark', label: '소변색 진함', category: 'dehydration' },
        { id: 'cramps', label: '근육 경련/쥐', category: imbalance => 'magnesium_deficiency' },
        // Simply mapping cramps to salt/magnesium
        { id: 'palpitations', label: '두근거림', category: 'salt_deficiency' },
        { id: 'edema', label: '손발 부종', category: 'excess_salt' },
    ];

    const toggleSymptom = (id) => {
        setSelectedSymptoms(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
        setResult(null); // Reset result when changing selection
    };

    const analyzeSymptoms = () => {
        if (selectedSymptoms.length === 0) return;

        let saltScore = 0;
        let waterScore = 0;
        let excessSaltScore = 0;

        selectedSymptoms.forEach(id => {
            const sym = symptoms.find(s => s.id === id);
            if (!sym) return;

            if (['headache', 'dizziness', 'fatigue', 'brainfog', 'palpitations', 'cramps'].includes(id)) {
                saltScore += 1;
            }
            if (['thirst', 'drymouth', 'urine_dark'].includes(id)) {
                waterScore += 1;
            }
            if (['edema'].includes(id)) {
                excessSaltScore += 1;
            }
        });

        let diagnosis = {
            title: "정상 상태",
            desc: "특별한 전해질 불균형 신호가 감지되지 않았습니다. 현재 루틴을 유지하세요.",
            action: "수분/소금 섭취 균형 유지",
            color: "#4CAF50",
            icon: CheckCircle
        };

        // Simple Diagnostic Logic
        if (excessSaltScore > 0 && saltScore === 0) {
            diagnosis = {
                title: "나트륨 과다 주의",
                desc: "부종 등 나트륨 과다 신호가 있습니다. 소금 섭취를 잠시 멈추고 맹물을 드세요.",
                action: "맹물 500ml 섭취 & 소금 중단",
                color: "#FF9800",
                icon: AlertTriangle
            };
        } else if (saltScore >= waterScore && saltScore > 0) {
            diagnosis = {
                title: "나트륨 부족 (소금 필요)",
                desc: "두통, 무기력 등 저나트륨 혈증 초기 증상이 의심됩니다. 즉시 소금을 보충하세요.",
                action: "소금 2-3g + 물 500ml 섭취",
                color: "#F44336",
                icon: Zap
            };
        } else if (waterScore > saltScore) {
            diagnosis = {
                title: "수분 부족 (탈수)",
                desc: "갈증과 진한 소변색은 탈수 신호입니다. 소금보다는 '맹물' 위주로 보충하세요.",
                action: "맹물 300ml 섭취 (천천히)",
                color: "#2196F3",
                icon: Droplet
            };
        }

        setResult(diagnosis);
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>생체 신호 자가진단 🩺</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>현재 몸 상태를 체크하여 필요한 성분을 처방합니다.</p>
            </header>

            {/* Symptom Checklist */}
            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="#FF5722" /> 현재 증상 체크 (다중 선택)
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {symptoms.map(sym => (
                        <button key={sym.id} onClick={() => toggleSymptom(sym.id)} style={{
                            padding: '12px 8px', borderRadius: '12px', border: '1px solid',
                            borderColor: selectedSymptoms.includes(sym.id) ? 'var(--primary-500)' : '#ECEFF1',
                            background: selectedSymptoms.includes(sym.id) ? '#E3F2FD' : '#FAFAFA',
                            color: selectedSymptoms.includes(sym.id) ? 'var(--primary-700)' : '#546E7A',
                            fontWeight: selectedSymptoms.includes(sym.id) ? 700 : 500,
                            cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
                        }}>
                            {sym.label}
                        </button>
                    ))}
                </div>

                <button onClick={analyzeSymptoms} disabled={selectedSymptoms.length === 0} style={{
                    width: '100%', marginTop: '20px', padding: '16px', borderRadius: '16px', border: 'none',
                    background: selectedSymptoms.length > 0 ? 'var(--primary-600)' : '#CFD8DC',
                    color: 'white', fontWeight: 800, fontSize: '16px', cursor: selectedSymptoms.length > 0 ? 'pointer' : 'not-allowed',
                    boxShadow: selectedSymptoms.length > 0 ? '0 4px 12px rgba(33, 150, 243, 0.3)' : 'none',
                    transition: 'all 0.3s'
                }}>
                    분석 시작하기 ⚡
                </button>
            </div>

            {/* Diagnosis Result */}
            {result && (
                <div className="card" style={{
                    padding: '24px', border: `2px solid ${result.color}`, background: `${result.color}08`,
                    animation: 'slideUp 0.4s ease'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%', background: result.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                            boxShadow: `0 4px 12px ${result.color}66`
                        }}>
                            <result.icon size={32} color="white" />
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: result.color, marginBottom: '8px' }}>
                            {result.title}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                            {result.desc}
                        </p>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ fontSize: '12px', color: '#90A4AE', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                            Action Plan
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#263238' }}>
                            {result.action}
                        </div>
                    </div>

                    <button onClick={() => { setSelectedSymptoms([]); setResult(null); }} style={{
                        marginTop: '20px', background: 'transparent', border: 'none', color: '#90A4AE',
                        fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        width: '100%', cursor: 'pointer'
                    }}>
                        <RefreshCcw size={14} /> 다시 진단하기
                    </button>

                    <style>{`
                        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default Analysis;
