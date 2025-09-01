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
    <div style={{ marginBottom: '3.2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.6rem',
        marginBottom: '2.4rem'
      }}>
        {steps.map((step, index) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{
                  width: '3.2rem',
                  height: '3.2rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: '500',
                  backgroundColor: currentStep >= step.id ? 'var(--primary)' : 'var(--secondary)',
                  color: currentStep >= step.id ? 'var(--primary-foreground)' : 'var(--secondary-foreground)'
                }}
                data-testid={`step-${step.id}`}
              >
                {step.id}
              </div>
              <span 
                style={{
                  marginLeft: '0.8rem',
                  fontSize: '1.4rem',
                  fontWeight: '500',
                  color: currentStep >= step.id ? 'var(--foreground)' : 'var(--secondary)'
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={currentStep > step.id ? "stepper-line completed" : "stepper-line"}
                style={{
                  width: '6.4rem',
                  height: '0.2rem',
                  margin: '0 1.6rem'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
