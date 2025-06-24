import React, { useState } from 'react';
import CricketGround from './components/CricketGround';
import MatchScenario from './components/MatchScenario';
import ShotSelector from './components/ShotSelector';
import FieldingPositions from './components/FieldingPositions';
import StrategyAnalysis from './components/StrategyAnalysis';
import './App.css';

function App() {
  const [gameState, setGameState] = useState({
    runsNeeded: 180,
    ballsLeft: 120,
    currentScore: 0,
    target: 180,
    wickets: 0,
    overs: 0,
    balls: 0
  });

  const [selectedShot, setSelectedShot] = useState('');
  const [fielders, setFielders] = useState([
    { id: 1, name: 'Slip', x: 85, y: 45 },
    { id: 2, name: 'Point', x: 75, y: 25 },
    { id: 3, name: 'Cover', x: 65, y: 15 },
    { id: 4, name: 'Mid-off', x: 45, y: 10 },
    { id: 5, name: 'Mid-on', x: 35, y: 10 },
    { id: 6, name: 'Square leg', x: 25, y: 25 },
    { id: 7, name: 'Fine leg', x: 15, y: 45 },
    { id: 8, name: 'Third man', x: 85, y: 65 },
    { id: 9, name: 'Long-on', x: 35, y: 5 },
    { id: 10, name: 'Long-off', x: 45, y: 5 },
    { id: 11, name: 'Deep square', x: 15, y: 25 }
  ]);

  const [lastShotResult, setLastShotResult] = useState(null);
  const [trajectory, setTrajectory] = useState(null);
  const [matchStats, setMatchStats] = useState({
    boundaries: 0,
    sixes: 0,
    dots: 0,
    singles: 0
  });

  const handleShotPlay = (shot, result) => {
    setLastShotResult(result);
    setTrajectory(result.trajectory);
    
    const newBalls = gameState.balls + 1;
    const newOvers = newBalls === 6 ? gameState.overs + 1 : gameState.overs;
    const ballsInOver = newBalls === 6 ? 0 : newBalls;
    
    setGameState(prev => ({
      ...prev,
      runsNeeded: Math.max(0, prev.runsNeeded - result.runs),
      ballsLeft: prev.ballsLeft - 1,
      currentScore: prev.currentScore + result.runs,
      wickets: result.isOut ? prev.wickets + 1 : prev.wickets,
      overs: newOvers,
      balls: ballsInOver
    }));

    setMatchStats(prev => ({
      ...prev,
      boundaries: result.runs === 4 ? prev.boundaries + 1 : prev.boundaries,
      sixes: result.runs === 6 ? prev.sixes + 1 : prev.sixes,
      dots: result.runs === 0 ? prev.dots + 1 : prev.dots,
      singles: result.runs === 1 ? prev.singles + 1 : prev.singles
    }));

    setTimeout(() => {
      setTrajectory(null);
    }, 2500);
  };

  const updateFielderPosition = (fielderId, newX, newY) => {
    setFielders(prev => prev.map(fielder => 
      fielder.id === fielderId 
        ? { ...fielder, x: newX, y: newY }
        : fielder
    ));
  };

  const updateMatchSettings = (target, overs) => {
    const totalBalls = overs * 6;
    setGameState({
      runsNeeded: target,
      ballsLeft: totalBalls,
      currentScore: 0,
      target: target,
      wickets: 0,
      overs: 0,
      balls: 0
    });
    setMatchStats({ boundaries: 0, sixes: 0, dots: 0, singles: 0 });
    setLastShotResult(null);
    setTrajectory(null);
    setSelectedShot('');
  };

  const resetMatch = () => {
    setGameState(prev => ({
      ...prev,
      runsNeeded: prev.target,
      ballsLeft: (prev.target === 180 ? 20 : Math.ceil(prev.target / 9)) * 6,
      currentScore: 0,
      wickets: 0,
      overs: 0,
      balls: 0
    }));
    setMatchStats({ boundaries: 0, sixes: 0, dots: 0, singles: 0 });
    setLastShotResult(null);
    setTrajectory(null);
    setSelectedShot('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cricket Shot Analysis & Strategy Simulator</h1>
        <p>Master your batting strategy with intelligent field analysis</p>
      </header>
      
      <div className="main-content">
        <div className="left-panel">
          <MatchScenario 
            gameState={gameState} 
            lastResult={lastShotResult} 
            onReset={resetMatch}
            onUpdateSettings={updateMatchSettings}
          />
          <ShotSelector 
            onShotSelect={setSelectedShot} 
            selectedShot={selectedShot}
            onShotPlay={handleShotPlay}
            fielders={fielders}
            gameState={gameState}
          />
          <FieldingPositions 
            fielders={fielders} 
            onFielderUpdate={updateFielderPosition}
          />
          <StrategyAnalysis 
            gameState={gameState}
            fielders={fielders}
            selectedShot={selectedShot}
            lastResult={lastShotResult}
            matchStats={matchStats}
          />
        </div>
        
        <div className="cricket-ground-container">
          <CricketGround 
            fielders={fielders}
            onFielderMove={updateFielderPosition}
            trajectory={trajectory}
            selectedShot={selectedShot}
            lastResult={lastShotResult}
          />
          <div className="ground-stats">
            <div className="stat-item">
              <div className="stat-value">{matchStats.boundaries}</div>
              <div className="stat-label">Fours</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{matchStats.sixes}</div>
              <div className="stat-label">Sixes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{matchStats.dots}</div>
              <div className="stat-label">Dots</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{matchStats.singles}</div>
              <div className="stat-label">Singles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
