import React from 'react';

const FieldingPositions = ({ fielders, onFielderUpdate }) => {
  const handlePresetField = (preset) => {
    let newPositions = [];
    
    switch (preset) {
      case 'attacking':
        newPositions = [
          { id: 1, name: 'Slip', x: 85, y: 45 },
          { id: 2, name: 'Point', x: 75, y: 25 },
          { id: 3, name: 'Cover', x: 65, y: 15 },
          { id: 4, name: 'Mid-off', x: 45, y: 20 },
          { id: 5, name: 'Mid-on', x: 35, y: 20 },
          { id: 6, name: 'Square leg', x: 25, y: 35 },
          { id: 7, name: 'Fine leg', x: 15, y: 55 },
          { id: 8, name: 'Third man', x: 85, y: 65 },
          { id: 9, name: 'Short leg', x: 35, y: 60 },
          { id: 10, name: 'Silly point', x: 65, y: 35 },
          { id: 11, name: 'Gully', x: 75, y: 55 }
        ];
        break;
      case 'defensive':
        newPositions = [
          { id: 1, name: 'Long-off', x: 45, y: 8 },
          { id: 2, name: 'Long-on', x: 35, y: 8 },
          { id: 3, name: 'Deep cover', x: 75, y: 12 },
          { id: 4, name: 'Deep point', x: 85, y: 18 },
          { id: 5, name: 'Deep square', x: 15, y: 25 },
          { id: 6, name: 'Deep fine leg', x: 12, y: 45 },
          { id: 7, name: 'Third man', x: 88, y: 65 },
          { id: 8, name: 'Mid-wicket', x: 25, y: 45 },
          { id: 9, name: 'Extra cover', x: 55, y: 15 },
          { id: 10, name: 'Mid-off', x: 45, y: 25 },
          { id: 11, name: 'Mid-on', x: 35, y: 25 }
        ];
        break;
      case 'powerplay':
        newPositions = [
          { id: 1, name: 'Slip', x: 85, y: 45 },
          { id: 2, name: 'Point', x: 75, y: 30 },
          { id: 3, name: 'Cover', x: 60, y: 20 },
          { id: 4, name: 'Mid-off', x: 45, y: 25 },
          { id: 5, name: 'Mid-on', x: 35, y: 25 },
          { id: 6, name: 'Square leg', x: 25, y: 30 },
          { id: 7, name: 'Fine leg', x: 20, y: 50 },
          { id: 8, name: 'Third man', x: 80, y: 60 },
          { id: 9, name: 'Short cover', x: 55, y: 30 },
          { id: 10, name: 'Short mid-wicket', x: 30, y: 40 },
          { id: 11, name: 'Backward point', x: 80, y: 35 }
        ];
        break;
      default:
        return;
    }
    
    newPositions.forEach(pos => {
      onFielderUpdate(pos.id, pos.x, pos.y);
    });
  };

  return (
    <div className="component-card">
      <h3>Field Setup</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <button 
          className="btn btn-secondary"
          onClick={() => handlePresetField('attacking')}
        >
          Attacking Field
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => handlePresetField('defensive')}
        >
          Defensive Field
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => handlePresetField('powerplay')}
        >
          Powerplay Field
        </button>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {fielders.slice(0, 8).map(fielder => (
          <div key={fielder.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.75rem', 
            borderBottom: '1px solid #f1f5f9',
            background: 'white'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>
              {fielder.name}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button 
                className="btn btn-small btn-secondary"
                onClick={() => onFielderUpdate(fielder.id, Math.max(10, fielder.x - 10), fielder.y)}
              >
                ←
              </button>
              <button 
                className="btn btn-small btn-secondary"
                onClick={() => onFielderUpdate(fielder.id, Math.min(90, fielder.x + 10), fielder.y)}
              >
                →
              </button>
              <button 
                className="btn btn-small btn-secondary"
                onClick={() => onFielderUpdate(fielder.id, fielder.x, Math.max(10, fielder.y - 10))}
              >
                ↑
              </button>
              <button 
                className="btn btn-small btn-secondary"
                onClick={() => onFielderUpdate(fielder.id, fielder.x, Math.min(90, fielder.y + 10))}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: '#f8fafc', 
        borderRadius: '8px', 
        fontSize: '0.875rem', 
        color: '#64748b',
        border: '1px solid #e2e8f0'
      }}>
        <p>💡 Drag fielders on the ground or use preset formations</p>
      </div>
    </div>
  );
};

export default FieldingPositions;
