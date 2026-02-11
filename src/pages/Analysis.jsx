import { useState, useRef } from 'react';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

const Analysis = () => {
    const { addLog } = useData();
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setSelectedFile(file); // Store the file object
            setResult(null);
            setError(null); // Clear any previous errors
        }
    };

    const startAnalysis = async () => {
        if (!selectedFile) return;

        setAnalyzing(true);
        setError(null);

        try {
            // 1. Convert Image to Base64
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);

            reader.onloadend = async () => {
                const base64Image = reader.result;

                try {
                    // 2. Call Backend API
                    const response = await fetch('/api/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image: base64Image,
                            prompt: `
                                Analyze this food image for a Keto diet app.
                                Return ONLY a RAW JSON object (no markdown formatting) with the following structure:
                                {
                                    "name": "Food Name (in Korean)",
                                    "score": 0-100 (integer, high is keto-friendly),
                                    "macros": { "carb": 0-100, "protein": 0-100, "fat": 0-100 },
                                    "feedback": "1-2 sentences of feedback in Korean",
                                    "foods": ["Detected Food 1", "Detected Food 2"]
                                }
                            `
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.details || "Analysis Failed");
                    }

                    const resultData = await response.json();

                    // 3. Update State
                    setResult(resultData);
                    addLog(1.5, `AI 분석 (${resultData.name})`);

                } catch (apiError) {
                    console.error("API Call Failed:", apiError);
                    alert(`분석 실패: ${apiError.message}\n(Netlify 환경변수 설정을 확인해주세요)`);
                    setError(apiError.message);
                } finally {
                    setAnalyzing(false);
                }
            };
        } catch (e) {
            console.error("Image Processing Failed:", e);
            setAnalyzing(false);
            setError("Image processing failed.");
        }
    };

    return (
        <div style={{ paddingBottom: '20px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>AI 식단 분석 🥗</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>사진을 올리면 영양소를 분석해드려요.</p>
            </header>

            {/* Upload Area */}
            <div
                onClick={() => fileInputRef.current.click()}
                style={{
                    width: '100%', height: '300px',
                    background: image ? `url(${image}) center/cover` : '#F0F4F8',
                    borderRadius: '24px', border: '2px dashed #CFD8DC',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', marginBottom: '20px', overflow: 'hidden', position: 'relative'
                }}
            >
                {!image && (
                    <>
                        <Camera size={48} color="#90A4AE" />
                        <span style={{ color: '#90A4AE', marginTop: '12px', fontWeight: 600 }}>터치하여 사진 촬영/업로드</span>
                    </>
                )}
                <input
                    type="file" accept="image/*"
                    ref={fileInputRef} onChange={handleFileChange} hidden
                />

                {/* Scanning Animation Overlay */}
                {analyzing && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <Loader2 size={48} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                        <div style={{ marginTop: '16px', fontWeight: 700 }}>AI가 분석 중입니다...</div>
                    </div>
                )}
            </div>

            {/* Action Button */}
            {image && !result && !analyzing && (
                <button className="btn-primary" onClick={startAnalysis}>
                    분석 시작하기 ⚡
                </button>
            )}

            {/* Result Card */}
            {result && (
                <div className="card" style={{ animation: 'slideUp 0.5s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>분석 결과</h2>
                        <div style={{
                            background: result.score >= 80 ? '#E8F5E9' : '#FFF3E0',
                            color: result.score >= 80 ? '#2E7D32' : '#E65100',
                            padding: '6px 12px', borderRadius: '20px', fontWeight: 700
                        }}>
                            {result.score}점
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        {result.foods.map(food => (
                            <span key={food} style={{ fontSize: '12px', background: '#F5F5F5', padding: '4px 8px', borderRadius: '8px' }}>
                                {food}
                            </span>
                        ))}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>탄단지 비율</div>
                        <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${result.macros.carb}%`, background: '#EF5350' }} />
                            <div style={{ width: `${result.macros.protein}%`, background: '#42A5F5' }} />
                            <div style={{ width: `${result.macros.fat}%`, background: '#FFCA28' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#666' }}>
                            <span>탄수화물 {result.macros.carb}%</span>
                            <span>단백질 {result.macros.protein}%</span>
                            <span>지방 {result.macros.fat}%</span>
                        </div>
                    </div>

                    <div style={{ background: '#F8F9FA', padding: '16px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <AlertCircle size={16} color="var(--primary-500)" />
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>AI 코멘트</span>
                        </div>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#444' }}>{result.feedback}</p>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
};

export default Analysis;
