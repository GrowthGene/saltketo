import { motion } from 'framer-motion';

const EnergyGauge = ({ percent, status, label }) => {
    const strokeDashoffset = 630 - (630 * percent) / 100;
    const color = percent > 100 ? 'var(--danger)' : (percent >= 80 ? 'var(--success)' : 'var(--primary-500)');

    return (
        <div style={{ position: 'relative', width: '100%', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            {/* Fluid Background */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%',
                height: `${Math.min(percent, 100)}%`,
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--primary-100) 100%)',
                zIndex: 1, opacity: 0.5, borderRadius: '20px', transition: 'height 0.5s ease'
            }}></div>

            {/* SVG Circle */}
            <svg width="240" height="240" style={{ position: 'absolute', transform: 'rotate(-90deg)', zIndex: 1 }}>
                <circle cx="120" cy="120" r="100" stroke="#F0F4F8" strokeWidth="16" fill="transparent" />
                <motion.circle
                    cx="120" cy="120" r="100"
                    stroke={color} strokeWidth="16" fill="transparent"
                    strokeDasharray="630"
                    initial={{ strokeDashoffset: 630 }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>

            {/* Inner Content */}
            <div style={{
                width: '220px', height: '220px', borderRadius: '50%', background: 'white',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.02), var(--shadow-soft)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 2
            }}>
                <div style={{ fontSize: '14px', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {label || 'Mineral Power'}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '48px', fontWeight: 900, color: color }}>{percent.toFixed(0)}</div>
                    <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>%</span>
                </div>
                <div style={{
                    marginTop: '8px', fontSize: '14px', fontWeight: 700, color: color,
                    padding: '4px 12px', background: `${color}15`, borderRadius: '20px'
                }}>
                    {status}
                </div>
            </div>
        </div>
    );
};

export default EnergyGauge;
