import React from 'react';
import { AppStep } from '../types';

interface Props {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.SETUP, label: 'Início' },
  { id: AppStep.ORDER, label: 'OP/CP' },
  { id: AppStep.TIMER, label: 'Produção' },
  { id: AppStep.SUMMARY, label: 'Resumo' },
];

export const StepIndicator: React.FC<Props> = ({ currentStep }) => {
  if (currentStep === AppStep.SUCCESS) return null;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative z-10">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 border-2 ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : step.id}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Connecting Line */}
      <div className="absolute top-[5.5rem] left-0 w-full px-8 h-0.5 -z-0 hidden md:block">
          <div className="h-full bg-gray-200 relative">
             {/* Dynamic progress bar could go here */}
          </div>
      </div>
    </div>
  );
};
