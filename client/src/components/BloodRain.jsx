import React, { useEffect, useState } from 'react';

const BloodRain = () => {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const dropCount = 15; // Number of drops
    const uniqueDrops = Array.from({ length: dropCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw', // Random horizontal position
      animationDuration: Math.random() * 2 + 2 + 's', // Faster speed (2-4s)
      animationDelay: Math.random() * 5 + 's', // Random start
      scale: Math.random() * 0.5 + 0.5, // Random size
    }));
    setDrops(uniqueDrops);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="blood-drop"
          style={{
            left: drop.left,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay,
            width: `${20 * drop.scale}px`,
            height: `${28 * drop.scale}px`,
          }}
        />
      ))}
    </div>
  );
};

export default BloodRain;
