import React from 'react'

export interface ProgressStep {
  title: string
  description?: string
}

export interface ProgressStepsProps {
  steps: ProgressStep[]
  currentStep: number
  className?: string
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Steps Container */}
      <div className="relative flex items-start">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle and Content */}
              <div className="flex flex-col items-center relative z-10 flex-shrink-0">
                {/* Circle - 28px (w-7 h-7) */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    isCompleted
                      ? 'bg-green-500'
                      : isCurrent
                      ? 'bg-[#6938EF]'
                      : 'bg-white border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={
                        isCurrent
                          ? 'text-white'
                          : isUpcoming
                          ? 'text-slate-400'
                          : 'text-slate-900'
                      }
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>

                {/* Text below circle */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-slate-900'
                        : isUpcoming
                        ? 'text-slate-400'
                        : 'text-slate-900'
                    }`}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div
                      className={`text-xs mt-0.5 ${
                        isCurrent
                          ? 'text-slate-500'
                          : isUpcoming
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Dotted Connector Line - Between steps */}
              {!isLast && (
                <div className="flex-1 relative mx-4">
                  <div className="absolute top-[14px] left-0 right-0 h-px pointer-events-none z-0">
                    <div 
                      className="h-full border-t border-dashed border-slate-300" 
                      style={{ borderTopWidth: '1px' }} 
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressSteps

