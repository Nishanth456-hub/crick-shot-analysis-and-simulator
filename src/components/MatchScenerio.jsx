import React, { useState } from 'react';

const MatchScenario = ({ gameState, lastResult, onReset, onUpdateSettings }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [target, setTarget] = useState(180);
  const [overs, setOvers] = useState(20);

  const { runsNeeded, ballsLeft, currentScore, wickets, overs: currentOvers, balls } = gameState;
  const runRate = currentOvers > 0 ? (currentScore / currentOvers).toFixed(2) : '0.00';
  const requiredRate = ballsLeft > 0 ? (runsNeeded / (ballsLeft / 6)).toFixed(2) : '0.00';

  const getMatchStatus = () => {
    if (runsNeeded <= 0) return { text: "Target Achieved! 🏆", color: "#10b981", bg: "#ecfdf5" };
    if (ballsLeft <= 0) return { text: "Match Over", color: "#ef4444", bg: "#fef2f2" };
    if (wickets >= 10) return { text: "All Out", color: "#ef4444", bg: "#fef2f2" };
    return { text: "Match In Progress", color: "#1e293b", bg: "#f8fafc" };
  };

  const handleUpdateSettings = () => {
    onUpdateSettings(target, overs);
    setShowSettings(false);
  };

  const status = getMatchStatus();

  return (
    <div className="component-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Match Status</h3>
        <button 
          className="btn btn-small btn-secondary"
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </button>
      </div>

      {showSettings && (
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
          <div className="input-group">
            <label>Target Runs</label>
            <input 
              type="number" 
              value={target} 
              onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
              min="50" 
              max="500"
            />
          </div>
          <div className="input-group">
            <label>Overs</label>
            <input 
              type="number" 
              value={overs} 
              onChange={(e) => setOvers(parseInt(e.target.value) || 1)}
              min="5" 
              max="50"
            />
          </div>
          <button className="btn btn-success" onClick={handleUpdateSettings}>
            Update Match
          </button>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '600', color: '#1e293b' }}>
            <span>{currentScore}</span>
            <span style={{ fontSize: '1.5rem', color: '#64748b' }}>/{wickets}</span>
          </div>
          <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem' }}>
            ({currentOvers}.{balls} overs)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>{gameState.target}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Target</div>
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>{runsNeeded}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Need</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{runRate}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Run Rate</div>
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{requiredRate}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Required</div>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          borderRadius: '8px', 
          background: status.bg,
          color: status.color,
          fontWeight: '600'
        }}>
          {status.text}
        </div>

        {lastResult && (
          <div className="fade-in" style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            border: '2px solid #e2e8f0', 
            borderRadius: '8px',
            background: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Last Ball</div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: lastResult.isOut ? '#ef4444' : '#10b981',
              marginBottom: '0.25rem'
            }}>
              {lastResult.isOut ? 'WICKET!' : `${lastResult.runs} RUNS`}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{lastResult.shotType}</div>
          </div>
        )}

        <button className="btn btn-secondary" onClick={onReset}>
          Reset Match
        </button>
      </div>
    </div>
  );
};

export default MatchScenario;
