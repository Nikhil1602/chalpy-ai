import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface Step {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    completedSteps: Set<number>;
    onStepClick: (index: number) => void;
}

export function StepIndicator({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) {

    return (
        <div className="flex items-center justify-between w-full overflow-x-auto pb-2 gap-0">

            {steps.map((step, index) => {

                const isCompleted = completedSteps.has(index);
                const isCurrent = index === currentStep;
                const isAccessible = isCompleted || index <= Math.max(...Array.from(completedSteps), -1) + 1;

                return (
                    <React.Fragment key={step.id}>
                        <button onClick={() => isAccessible && onStepClick(index)} disabled={!isAccessible} className={cn('flex flex-col items-center gap-1.5 px-2 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap relative min-w-[60px] sm:min-w-20', !isAccessible && 'opacity-40 cursor-not-allowed', isAccessible && !isCurrent && 'cursor-pointer')}>

                            {/* Icon circle */}
                            <div className={cn('flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-300 shrink-0', isCurrent && 'bg-orange-500/20 text-orange-500 border border-orange-500 scale-110', isCompleted && !isCurrent && 'bg-orange-500/20 text-orange-500', !isCurrent && !isCompleted && 'bg-orange-500/20 text-gray-500')}>
                                {isCompleted && !isCurrent ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    step.icon
                                )}
                            </div>

                            {/* Label */}
                            <span className={cn('transition-colors duration-200 text-center leading-tight', isCurrent && 'text-orange-500 font-semibold', isCompleted && !isCurrent && 'text-orange-500/80', !isCurrent && !isCompleted && 'text-gray-500')}>
                                {step.label}
                            </span>

                            {/* Active dot indicator */}
                            {isCurrent && (
                                <motion.div layoutId="activeStepDot" className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-orange-500" transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }} />
                            )}
                        </button>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className={cn('flex-1 h-0.5 rounded-full min-w-3 sm:min-w-6 -mt-3 sm:-mt-3.5 shrink-0 transition-colors', isCompleted ? 'bg-orange-500' : 'bg-orange-500/30')} />
                        )}

                    </React.Fragment>
                );

            })}

        </div>
    );

}