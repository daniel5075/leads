interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center space-x-1 mb-1">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 ${index === steps.length - 1 ? "" : "flex-1"} rounded-full ${
              index < currentStep 
                ? "bg-gradient-to-r from-primary to-blue-500" 
                : "bg-card border border-border/70"
            }`}
          ></div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        {steps.map((step, index) => (
          <span key={index} className={index < currentStep ? "text-primary" : ""}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
