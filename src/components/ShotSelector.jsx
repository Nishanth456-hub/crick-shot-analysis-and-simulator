import React, { useState } from 'react';

const ShotSelector = ({ onShotSelect, selectedShot, onShotPlay, fielders, gameState }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const shots = [
    { name: 'Cover Drive', risk: 'Low', reward: 'Medium', angle: 45, zone: 'off' },
    { name: 'Straight Drive', risk: 'Low', reward: 'Medium', angle: 0, zone: 'straight' },
    { name: 'Pull Shot', risk: 'Medium', reward: 'High', angle: 270, zone: 'leg' },
    { name: 'Hook Shot', risk: 'High', reward: 'High', angle: 315, zone: 'leg' },
    { name: 'Cut Shot', risk: 'Medium', reward: 'Medium', angle: 90, zone: 'off' },
    { name: 'Sweep', risk: 'Medium', reward: 'Medium', angle: 225, zone: 'leg' },
    { name: 'Loft', risk: 'High', reward: 'Very High', angle: 30, zone: 'straight' },
    { name: 'Defensive', risk: 'Very Low', reward: 'Low', angle: 0, zone: 'straight' }
  ];

  const calculateShotOutcome = (shot) => {
    if (gameState.wickets >= 10 || gameState.ballsLeft <= 0) {
      return { runs: 0, isOut: false, shotType: shot.name, trajectory: null };
    }

    const shotAngle = shot.angle;
    const batsmanX = 50;
    const batsmanY = 68;
    
    const distance = shot.risk === 'Very High' ? 40 : shot.risk === 'High' ? 35 : 30;
    const endX = batsmanX + Math.cos((shotAngle - 90) * Math.PI / 180) * distance;
    const endY = batsmanY + Math.sin((shotAngle - 90) * Math.PI / 180) * distance;
    
    // Check if shot lands near fielders
    const nearbyFielders = fielders.filter(fielder => {
      const distanceToFielder = Math.sqrt(Math.pow(fielder.x - endX, 2) + Math.pow(fielder.y - endY, 2));
      return distanceToFielder < 12;
    });

    // Check if shot goes to boundary (gap between fielders)
    const isBoundary = nearbyFielders.length === 0 && 
      Math.sqrt(Math.pow(endX - 50, 2) + Math.pow(endY - 50, 2)) > 35;

    let runs = 0;
    let isOut = false;

    if (nearbyFielders.length > 0) {
      // Shot reaches fielder - single or double
      runs = Math.random() < 0.7 ? 1 : 2;
      if (shot.risk === 'High' || shot.risk === 'Very High') {
        isOut = Math.random() < 0.25;
        if (isOut) runs = 0;
      }
    } else if (isBoundary) {
      // Shot goes to boundary - 4 or 6
      runs = shot.risk === 'Very High' && Math.random() < 0.4 ? 6 : 4;
    } else {
      // Shot in gap but not boundary
      runs = Math.random() < 0.6 ? 2 : 3;
    }

    // Defensive shots
    if (shot.name === 'Defensive') {
      runs = Math.random() < 0.8 ? 0 : 1;
    }

    // Random wicket chance
    if (!isOut && Math.random() < 0.05) {
      isOut = true;
      runs = 0;
    }

    return {
      runs,
      isOut,
      shotType: shot.name,
      trajectory: {
        startX: batsmanX,
        startY: batsmanY,
        endX: Math.max(5, Math.min(95, endX)),
        endY: Math.max(5, Math.min(95, endY)),
        angle: shotAngle
      }
    };
  };

  const handleShotPlay = async (shot) => {
    if (isPlaying || gameState.wickets >= 10 || gameState.ballsLeft <= 0) return;
    
    setIsPlaying(true);
    onShotSelect(shot.name);
    
    setTimeout(() => {
      const result = calculateShotOutcome(shot);
      onShotPlay(shot, result);
      setIsPlaying(false);
    }, 800);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Very Low': return { background: '#ecfdf5', color: '#065f46', border: '#10b981' };
      case 'Low': return { background: '#f0f9ff', color: '#0c4a6e', border: '#0ea5e9' };
      case 'Medium': return { background: '#fffbeb', color: '#92400e', border: '#f59e0b' };
      case 'High': return { background: '#fef2f2', color: '#991b1b', border: '#ef4444' };
      default: return { background: '#fef2f2', color: '#991b1b', border: '#ef4444' };
    }
  };

  const isMatchOver = gameState.wickets >= 10 || gameState.ballsLeft <= 0 || gameState.runsNeeded <= 0;

  return (
    <div className="component-card">
      <h3>Shot Selection</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {shots.map((shot, index) => {
          const riskStyle = getRiskColor(shot.risk);
          return (
            <button
              key={index}
              style={{
                padding: '1rem',
                border: selectedShot === shot.name ? `2px solid #1e293b` : '2px solid #e2e8f0',
                borderRadius: '8px',
                background: selectedShot === shot.name ? '#1e293b' : 'white',
                color: selectedShot === shot.name ? 'white' : '#1e293b',
                cursor: isPlaying || isMatchOver ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                opacity: isPlaying || isMatchOver ? 0.5 : 1
              }}
              onClick={() => handleShotPlay(shot)}
              disabled={isPlaying || isMatchOver}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                {shot.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ 
                  ...riskStyle, 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px',
                  border: `1px solid ${riskStyle.border}`
                }}>
                  {shot.risk}
                </span>
                <span style={{ color: selectedShot === shot.name ? 'rgba(255,255,255,0.8)' : '#64748b' }}>
                  {shot.reward}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {isPlaying && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.75rem', 
          padding: '1rem', 
          marginTop: '1rem',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          <div className="loading-spinner"></div>
          <span style={{ color: '#1e293b', fontWeight: '500' }}>Playing shot...</span>
        </div>
      )}
    </div>
  );
};

export default ShotSelector;
