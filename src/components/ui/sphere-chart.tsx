import React from "react";
import { motion } from "framer-motion";

interface SphereChartProps {
  data: {
    label: string;
    value: number;
    color: string;
    gradientStart?: string;
    gradientEnd?: string;
  }[];
  maxSize?: number;
  minSize?: number;
}

export const SphereChart: React.FC<SphereChartProps> = ({
  data,
  maxSize = 160,
  minSize = 80,
}) => {
  // Find the maximum value to scale the spheres
  const maxValue = Math.max(...data.map((item) => item.value));

  // Calculate sizes based on values
  const calculateSize = (value: number) => {
    if (maxValue === 0) return minSize; // Prevent division by zero
    const ratio = value / maxValue;
    return minSize + ratio * (maxSize - minSize);
  };

  return (
    <div className="flex flex-wrap justify-center items-end gap-4 sm:gap-8 py-4">
      {data.map((item, index) => {
        const size = calculateSize(item.value);
        const gradientStart = item.gradientStart || item.color;
        const gradientEnd = item.gradientEnd || adjustColor(item.color, -30);
        const gradientId = `sphere-gradient-${index}`;

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative mb-3 cursor-pointer group"
              style={{ width: size, height: size }}
            >
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                  <radialGradient
                    id={gradientId}
                    cx="30%"
                    cy="30%"
                    r="70%"
                    fx="20%"
                    fy="20%"
                  >
                    <stop offset="0%" stopColor={gradientStart} />
                    <stop offset="100%" stopColor={gradientEnd} />
                  </radialGradient>
                </defs>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={size / 2}
                  fill={`url(#${gradientId})`}
                  filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {formatValue(item.value)}
              </div>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-bjt-cardBg text-white text-xs p-2 rounded-md -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full z-10 whitespace-nowrap">
                {item.label}: {formatValue(item.value, true)}
              </div>
            </motion.div>
            <span className="text-sm font-medium text-bjt-textPrimary">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // Remove the # if it exists
  color = color.replace("#", "");

  // Parse the color
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Adjust the color
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Helper function to format values
function formatValue(value: number, full: boolean = false): string {
  if (full) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  // For short format
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)} M`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} Jt`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} Rb`;
  } else {
    return value.toString();
  }
}
