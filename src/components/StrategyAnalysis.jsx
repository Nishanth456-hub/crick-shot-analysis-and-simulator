import React from 'react';

const StrategyAnalysis = ({ gameState, fielders, selectedShot, lastResult, matchStats }) => {
  const { runsNeeded, ballsLeft, wickets } = gameState;
  
  const getRecommendation = () => {
    const requiredRate = ballsLeft > 0 ? (runsNeeded / (ballsLeft / 6)) : 0;
    
    if (runsNeeded <= 0) return { strategy: "Match Won! 🏆", color: "#10b981", shots: [] };
    if (ballsLeft <= 0 || wickets >= 10) return { strategy: "Match Over", color: "#ef4444", shots: [] };
    
    if (requiredRate < 6) {
      return { 
        strategy: "Play Safe - Build Partnership", 
        color: "#10b981",
        shots: ["Defensive", "Cover Drive", "Straight Drive"]
      };
    } else if (requiredRate < 10) {
      return { 
        strategy: "Balanced - Rotate Strike", 
        color: "#f59e0b",
        shots: ["Cover Drive", "Cut Shot", "Pull Shot"]
      };
    } else if (requiredRate < 15) {
      return { 
        strategy: "Aggressive - Find Boundaries", 
        color: "#f97316",
        shots: ["Pull Shot", "Loft", "Hook Shot"]
      };
    } else {
      return { 
        strategy: "Ultra Aggressive - Go Big", 
        color: "#ef4444",
        shots: ["Loft", "Hook Shot", "Sweep"]
      };
    }
  };

  const getFieldAnalysis = () => {
    const innerRing = fielders.filter(f => 
      Math.sqrt(Math.pow(f.x - 50, 2) + Math.pow(f.y - 50, 2)) < 25
    ).length;
    
    const boundary = fielders.filter(f => 
      Math.sqrt(Math.pow(f.x - 50, 2) + Math.pow(f.y - 50, 2)) > 35
    ).length;

    const offSide = fielders.filter(f => f.x > 50).length;
    const legSide = fielders.filter(f => f.x < 50).length;

    return { innerRing, boundary, offSide, legSide };
  };

  const recommendation = getRecommendation();
  const fieldAnalysis = getFieldAnalysis();
  const totalBoundaries = matchStats.boundaries + matchStats.sixes;
  const strikeRate = gameState.currentScore > 0 ? ((gameState.currentScore / ((gameState.overs * 6) + gameState.balls)) * 100).toFixed(1) : '0.0';

  return (
    <div className="component-card">
      <h3>Strategy Analysis</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          background: '#f8fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ color: '#1e293b', marginBottom: '0.5rem', fontSize: '1rem' }}>Strategy</h4>
          <div style={{ fontWeight: '600', fontSize: '0.875rem', color: recommendation.color }}>
            {recommendation.strategy}
          </div>
        </div>

        {recommendation.shots.length > 0 && (
          <div>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Recommended Shots</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {recommendation.shots.map((shot, index) => (
                <span 
                  key={index} 
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: selectedShot === shot ? '#1e293b' : '#f1f5f9',
                    color: selectedShot === shot ? 'white' : '#475569',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {shot}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Field Analysis</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{fieldAnalysis.innerRing}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Inner Ring</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{fieldAnalysis.boundary}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Boundary</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{fieldAnalysis.offSide}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Off Side</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{fieldAnalysis.legSide}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Leg Side</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Performance</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{strikeRate}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Strike Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{totalBoundaries}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Boundaries</div>
            </div>
          </div>
        </div>

        {lastResult && (
          <div className="fade-in" style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            border: '2px solid #e2e8f0', 
            borderRadius: '8px',
            background: 'white'
          }}>
            <h4 style={{ color: '#1e293b', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Last Shot</h4>
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '0.25rem', 
              color: lastResult.isOut ? '#ef4444' : '#10b981' 
            }}>
              {lastResult.isOut ? 'WICKET' : `${lastResult.runs} RUNS`}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{lastResult.shotType}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyAnalysis;
