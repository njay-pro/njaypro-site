import React from 'react';
import './SignalRail.css';

interface SignalRailProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  signalColor?: 'amber' | 'mint' | 'cyan' | 'oxide';
}

export const SignalRail: React.FC<SignalRailProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  signalColor = 'mint',
}) => {
  return (
    <aside className="signal-rail" aria-label="System Evaluation Rail">
      <div className="rail-line" />
      <div className="rail-nodes">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === currentStep;
          const isEvaluated = index < currentStep;
          const label = stepLabels[index] || `0${index + 1}`;

          return (
            <div
              key={index}
              className={`rail-node-item ${isActive ? 'active' : ''} ${
                isEvaluated ? 'evaluated' : ''
              }`}
            >
              <div
                className={`socket ${
                  isActive ? signalColor : isEvaluated ? 'mint' : ''
                }`}
              />
              <span className="rail-label font-mono">{label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
