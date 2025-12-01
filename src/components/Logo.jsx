import { useState } from 'react';

const Logo = ({ size = 'md', onClick }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 2000);
  };

  const dimension = size === 'lg' ? 120 : 48;
  const planetSize = size === 'lg' ? 55 : 22;
  const ringWidth = size === 'lg' ? 95 : 38;
  const ringHeight = size === 'lg' ? 32 : 13;

  // Asteroid data: angle, size, shape variation
  const asteroids = size === 'lg' 
    ? [
        { angle: 0, size: 8, rotation: 45 },
        { angle: 25, size: 5, rotation: 120 },
        { angle: 45, size: 4, rotation: 0 },
        { angle: 70, size: 6, rotation: 90 },
        { angle: 90, size: 7, rotation: 180 },
        { angle: 115, size: 5, rotation: 270 },
        { angle: 135, size: 4, rotation: 45 },
        { angle: 160, size: 9, rotation: 135 },
        { angle: 180, size: 6, rotation: 0 },
        { angle: 205, size: 5, rotation: 90 },
        { angle: 225, size: 4, rotation: 180 },
        { angle: 250, size: 7, rotation: 270 },
        { angle: 270, size: 8, rotation: 45 },
        { angle: 295, size: 5, rotation: 135 },
        { angle: 315, size: 6, rotation: 0 },
        { angle: 340, size: 5, rotation: 90 },
      ]
    : [
        { angle: 0, size: 3.5, rotation: 45 },
        { angle: 45, size: 2.5, rotation: 0 },
        { angle: 90, size: 3, rotation: 90 },
        { angle: 135, size: 2, rotation: 180 },
        { angle: 180, size: 4, rotation: 45 },
        { angle: 225, size: 2.5, rotation: 270 },
        { angle: 270, size: 3.5, rotation: 135 },
        { angle: 315, size: 3, rotation: 0 },
      ];

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer flex items-center justify-center"
      style={{ 
        width: dimension, 
        height: dimension,
      }}
      title="Click to see orbital motion!"
    >
      {/* Central glowing planet - ALWAYS STATIC */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-white dark:via-gray-100 dark:to-gray-200"
        style={{
          width: planetSize,
          height: planetSize,
          boxShadow: `
            0 0 ${planetSize * 0.5}px rgba(255, 255, 255, 0.9),
            0 0 ${planetSize * 1}px rgba(255, 255, 255, 0.6),
            0 0 ${planetSize * 1.5}px rgba(255, 255, 255, 0.3),
            inset 0 0 ${planetSize * 0.2}px rgba(220, 220, 220, 0.8)
          `,
          zIndex: 2,
        }}
      />

      {/* Orbital asteroid ring - Smooth rotation with scale pulse */}
      <div 
        className={`absolute inset-0 ${isSpinning ? 'orbix-orbital-spin' : ''}`}
        style={{ 
          zIndex: 1,
        }}
      >
        <svg
          style={{ 
            width: '100%', 
            height: '100%',
          }}
          viewBox={`0 0 ${dimension} ${dimension}`}
        >
          <g>
            {/* Faint ring path guide */}
            <ellipse
              cx={dimension / 2}
              cy={dimension / 2}
              rx={ringWidth / 2}
              ry={ringHeight / 2}
              fill="none"
              stroke="rgba(120, 120, 120, 0.15)"
              strokeWidth="0.5"
              strokeDasharray="2 3"
            />

            {/* Realistic asteroid stones */}
            {asteroids.map((asteroid, index) => {
              const radians = (asteroid.angle * Math.PI) / 180;
              const x = dimension / 2 + (ringWidth / 2) * Math.cos(radians);
              const y = dimension / 2 + (ringHeight / 2) * Math.sin(radians);

              return (
                <g key={index} transform={`translate(${x}, ${y}) rotate(${asteroid.rotation})`}>
                  <polygon
                    points={`
                      0,${-asteroid.size * 0.5}
                      ${asteroid.size * 0.4},${-asteroid.size * 0.2}
                      ${asteroid.size * 0.5},${asteroid.size * 0.3}
                      ${asteroid.size * 0.1},${asteroid.size * 0.5}
                      ${-asteroid.size * 0.3},${asteroid.size * 0.4}
                      ${-asteroid.size * 0.5},${-asteroid.size * 0.1}
                    `}
                    fill="url(#asteroidGradient)"
                    stroke="rgba(80, 80, 80, 0.4)"
                    strokeWidth="0.3"
                    style={{
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    }}
                  />
                </g>
              );
            })}
          </g>

          {/* Gradient definition for asteroids */}
          <defs>
            <linearGradient id="asteroidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e0e0" stopOpacity="1" />
              <stop offset="50%" stopColor="#c0c0c0" stopOpacity="1" />
              <stop offset="100%" stopColor="#a0a0a0" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
