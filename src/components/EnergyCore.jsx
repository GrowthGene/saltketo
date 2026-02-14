import React from 'react';

const EnergyCore = ({ current, goal, percentage: propPercentage, color: propColor, status }) => {
    // Use prop percentage if available, otherwise calculate
    const percentage = propPercentage !== undefined ? propPercentage : Math.min((current / goal) * 100, 100);

    // Color logic: Prioritize prop color, else default logic
    let color = propColor;
    if (!color) {
        color = '#2196F3'; // Blue
        if (percentage > 100) color = '#F44336'; // Red
        else if (percentage > 80) color = '#FF9800'; // Orange
        else if (percentage > 40) color = '#00E676'; // Green
    }

    return (
        <div style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Outer Ring */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px dashed rgba(0,0,0,0.1)',
                animation: 'spin 10s linear infinite'
            }} />

            {/* Core Container */}
            <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, white, ${color})`,
                boxShadow: `0 0 30px ${color}80, inset 0 0 20px white`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
                transition: 'all 1s ease',
                animation: 'pulse 3s ease-in-out infinite'
            }}>
                <span style={{ fontSize: '12px', opacity: 0.9, color: 'white', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{status || 'ENERGY LEVEL'}</span>
                <span style={{ fontSize: '36px', fontWeight: 900, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    {typeof percentage === 'number' ? percentage.toFixed(0) : 0}%
                </span>
                <span style={{ fontSize: '12px', color: 'white', marginTop: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {current !== undefined ? `${current}g / ${goal}g` : 'Engine Active'}
                </span>
            </div>

            {/* Orbiting Particles */}
            <div style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                animation: 'spinReverse 8s linear infinite'
            }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    background: color,
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    boxShadow: `0 0 10px ${color}`
                }} />
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 20px ${color}60; }
                    50% { transform: scale(1.05); box-shadow: 0 0 40px ${color}80; }
                    100% { transform: scale(0.95); box-shadow: 0 0 20px ${color}60; }
                }
            `}</style>
        </div>
    );
};

export default EnergyCore;
