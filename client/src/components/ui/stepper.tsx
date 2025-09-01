import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-center space-x-4 mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep >= step.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}
                data-testid={`step-${step.id}`}
              >
                {step.id}
              </div>
              <span 
                className={cn(
                  "ml-2 text-sm font-medium",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "w-16 h-0.5 mx-4",
                  currentStep > step.id 
                    ? "bg-accent" 
                    : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
