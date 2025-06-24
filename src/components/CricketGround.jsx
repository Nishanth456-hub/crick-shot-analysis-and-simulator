import React, { useState, useRef, useEffect } from 'react';

const CricketGround = ({ fielders, onFielderMove, trajectory, selectedShot, lastResult }) => {
  const [draggedFielder, setDraggedFielder] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredFielder, setHoveredFielder] = useState(null);
  const groundRef = useRef(null);

  const getGroundDimensions = () => {
    if (!groundRef.current) return { width: 500, height: 500 };
    const rect = groundRef.current.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height, 600);
    return { width: size, height: size };
  };

  const [dimensions, setDimensions] = useState(getGroundDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getGroundDimensions());
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (groundRef.current) {
      resizeObserver.observe(groundRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseDown = (e, fielder) => {
    e.preventDefault();
    const rect = groundRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDraggedFielder(fielder.id);
    setDragOffset({
      x: x - fielder.x,
      y: y - fielder.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggedFielder) return;
    
    e.preventDefault();
    const rect = groundRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newX = Math.max(8, Math.min(92, x - dragOffset.x));
    const newY = Math.max(8, Math.min(92, y - dragOffset.y));
    
    // Prevent fielders from being placed on the pitch (center area)
    const centerX = 50;
    const centerY = 50;
    const pitchWidth = 12;
    const pitchHeight = 35;
    
    const isOnPitch = (
      newX > centerX - pitchWidth/2 && 
      newX < centerX + pitchWidth/2 && 
      newY > centerY - pitchHeight/2 && 
      newY < centerY + pitchHeight/2
    );
    
    if (!isOnPitch) {
      onFielderMove(draggedFielder, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setDraggedFielder(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const renderFielder = (fielder) => {
    const isBeingDragged = draggedFielder === fielder.id;
    const isHovered = hoveredFielder === fielder.id;
    
    return (
      <g key={fielder.id}>
        <circle
          cx={`${fielder.x}%`}
          cy={`${fielder.y}%`}
          r="2.5%"
          fill={isBeingDragged ? "#ef4444" : isHovered ? "#f59e0b" : "#1e293b"}
          stroke="white"
          strokeWidth="0.5%"
          style={{ 
            cursor: 'grab', 
            transition: 'all 0.2s ease',
            filter: isBeingDragged ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
          }}
          onMouseDown={(e) => handleMouseDown(e, fielder)}
          onMouseEnter={() => setHoveredFielder(fielder.id)}
          onMouseLeave={() => setHoveredFielder(null)}
        />
        <text
          x={`${fielder.x}%`}
          y={`${fielder.y + 4.5}%`}
          textAnchor="middle"
          fontSize="1.8%"
          fill="#1e293b"
          fontWeight="600"
          style={{ 
            pointerEvents: 'none', 
            userSelect: 'none', 
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {fielder.name.split(' ')[0]}
        </text>
        {(isHovered || isBeingDragged) && (
          <text
            x={`${fielder.x}%`}
            y={`${fielder.y - 3}%`}
            textAnchor="middle"
            fontSize="1.5%"
            fill="#64748b"
            fontWeight="500"
            style={{ 
              pointerEvents: 'none', 
              userSelect: 'none', 
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {fielder.name}
          </text>
        )}
      </g>
    );
  };

  const renderTrajectory = () => {
    if (!trajectory) return null;
    
    const { startX, startY, endX, endY } = trajectory;
    
    return (
      <g className="trajectory-animation">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="#ef4444"
            />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <line
          x1={`${startX}%`}
          y1={`${startY}%`}
          x2={`${endX}%`}
          y2={`${endY}%`}
          stroke="#ef4444"
          strokeWidth="1%"
          strokeDasharray="3,2"
          markerEnd="url(#arrowhead)"
          filter="url(#glow)"
          className="trajectory-line"
        />
        <circle
          cx={`${endX}%`}
          cy={`${endY}%`}
          r="2%"
          fill="#ef4444"
          opacity="0.8"
          className="trajectory-end"
        />
      </g>
    );
  };

  const renderBoundaryRope = () => (
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="none"
      stroke="#10b981"
      strokeWidth="1"
      strokeDasharray="3,3"
      opacity="0.6"
    />
  );

  return (
    <div 
      ref={groundRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{ 
          border: '2px solid #e2e8f0', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {/* Ground Circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#groundGradient)"
          stroke="#e2e8f0"
          strokeWidth="0.5"
        />
        
        <defs>
          <radialGradient id="groundGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <linearGradient id="pitchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a3a3a3" />
            <stop offset="50%" stopColor="#d4d4d4" />
            <stop offset="100%" stopColor="#a3a3a3" />
          </linearGradient>
        </defs>
        
        {/* Boundary rope */}
        {renderBoundaryRope()}
        
        {/* 30-yard circle */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />
        
        {/* Pitch */}
        <rect
          x="44"
          y="32.5"
          width="12"
          height="35"
          fill="url(#pitchGradient)"
          stroke="#94a3b8"
          strokeWidth="0.3"
          rx="1"
        />
        
        {/* Stumps */}
        <g>
          <rect x="49" y="30.5" width="2" height="3" fill="#1e293b" rx="0.2" />
          <rect x="49" y="66.5" width="2" height="3" fill="#1e293b" rx="0.2" />
        </g>
        
        {/* Batsman positions - at the ends of pitch */}
        <circle cx="50" cy="32" r="1.8" fill="#ef4444" stroke="white" strokeWidth="0.4" />
        <circle cx="50" cy="68" r="1.8" fill="#ef4444" stroke="white" strokeWidth="0.4" />
        
        {/* Crease lines */}
        <line x1="44" y1="32" x2="56" y2="32" stroke="white" strokeWidth="0.4" />
        <line x1="44" y1="68" x2="56" y2="68" stroke="white" strokeWidth="0.4" />
        
        {/* Fielders */}
        {fielders.map(renderFielder)}
        
        {/* Shot trajectory */}
        {renderTrajectory()}
        
        {/* Selected shot indicator */}
        {selectedShot && (
          <text
            x="50%"
            y="12%"
            textAnchor="middle"
            fontSize="2.5%"
            fill="#1e293b"
            fontWeight="600"
            className="pulse"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {selectedShot}
          </text>
        )}
        
        {/* Last result indicator */}
        {lastResult && (
          <text
            x="50%"
            y="88%"
            textAnchor="middle"
            fontSize="2%"
            fill={lastResult.isOut ? "#ef4444" : "#10b981"}
            fontWeight="600"
            className="fade-in"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {lastResult.isOut ? "WICKET!" : `${lastResult.runs} RUNS`}
          </text>
        )}
      </svg>
      
      <style jsx>{`
        .trajectory-animation {
          animation: fadeIn 0.5s ease-out;
        }
        
        .trajectory-line {
          animation: dash 1.5s linear infinite;
          stroke-dasharray: 5,5;
        }
        
        .trajectory-end {
          animation: bounce 0.8s ease-in-out infinite alternate;
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        
        @keyframes bounce {
          0% { r: 1.5%; opacity: 0.8; }
          100% { r: 2.5%; opacity: 0.4; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CricketGround;
