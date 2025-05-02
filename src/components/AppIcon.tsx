import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';

interface AppIconProps {
  size?: number;
  color?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  size = 1024,
  color = '#FFFFFF'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <Circle cx="512" cy="512" r="512" fill="#128C7E" />
      <G transform="translate(205, 205) scale(0.6)">
        {/* Person shape */}
        <Circle cx="512" cy="350" r="150" fill={color} />
        <Path
          d="M312 600
             C312 600 312 500 512 500
             C712 500 712 600 712 600
             L712 800 L312 800 Z"
          fill={color}
        />
        {/* Tools representing labor/work */}
        <Path
          d="M400 350
             L350 250
             L450 300
             L400 350"
          fill={color}
          stroke={color}
          strokeWidth="20"
        />
        <Path
          d="M624 350
             L674 250
             L574 300
             L624 350"
          fill={color}
          stroke={color}
          strokeWidth="20"
        />
      </G>
    </Svg>
  );
};