import React from 'react';

export default function Logo({ size = 'medium', showSubtext = true, onClick }) {
  // Config scaling based on size prop
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconSize = isLarge ? 48 : isSmall ? 32 : 40;
  const mainFontSize = isLarge ? '28px' : isSmall ? '18px' : '22px';
  const subFontSize = isLarge ? '13px' : isSmall ? '9px' : '11px';

  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: isSmall ? '8px' : '12px', 
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Icon frame with orange glow */}
      <div 
        style={{ 
          width: `${iconSize}px`, 
          height: `${iconSize}px`, 
          borderRadius: '12px', 
          overflow: 'hidden',
          background: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.2), #0f1015)',
          border: '1.5px solid rgba(249, 115, 22, 0.5)',
          boxShadow: '0 0 12px rgba(249, 115, 22, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <img 
          src="/logo.png" 
          alt="Maatram Logo Icon" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            // Fallback if image load fails
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Brand Name Block */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Tamil Script Name */}
        <div 
          style={{ 
            fontSize: mainFontSize, 
            fontWeight: '900', 
            letterSpacing: '0.5px',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 40%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.3))',
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          மாற்றம்
        </div>

        {/* English Subtitle with Accents */}
        {showSubtext && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginTop: '2px' 
            }}
          >
            <span style={{ height: '1.5px', width: '12px', background: 'var(--accent-color, #f97316)', borderRadius: '2px', opacity: 0.8 }} />
            <span 
              style={{ 
                fontSize: subFontSize, 
                fontWeight: '700', 
                color: 'rgba(255, 255, 255, 0.85)', 
                letterSpacing: '0.5px',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              (Maatram)
            </span>
            <span style={{ height: '1.5px', width: '12px', background: 'var(--accent-color, #f97316)', borderRadius: '2px', opacity: 0.8 }} />
          </div>
        )}
      </div>
    </div>
  );
}
