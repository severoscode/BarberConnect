import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import Stepper from "@/components/ui/stepper";
import ServiceSelection from "@/components/booking/service-selection";
import ProfessionalSelection from "@/components/booking/professional-selection";
import DateSelection from "@/components/booking/date-selection";
import TimeSelection from "@/components/booking/time-selection";
import BookingSummary from "@/components/booking/booking-summary";
import type { Service, ProfessionalWithUser } from "@shared/schema";

interface BookingData {
  service?: Service;
  professional?: ProfessionalWithUser | "any";
  date?: Date;
  time?: string;
}

const STEPS = [
  { id: 1, label: "Serviço" },
  { id: 2, label: "Profissional" },
  { id: 3, label: "Data" },
  { id: 4, label: "Horário" },
];

export default function Booking() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setBookingData({ ...bookingData, service });
    handleNext();
  };

  const handleProfessionalSelect = (professional: ProfessionalWithUser | "any") => {
    setBookingData({ ...bookingData, professional });
    handleNext();
  };

  const handleDateSelect = (date: Date) => {
    setBookingData({ ...bookingData, date });
    handleNext();
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection onServiceSelect={handleServiceSelect} />;
      case 2:
        return (
          <ProfessionalSelection
            service={bookingData.service!}
            onProfessionalSelect={handleProfessionalSelect}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <DateSelection
            service={bookingData.service!}
            professional={bookingData.professional!}
            onDateSelect={handleDateSelect}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <TimeSelection
            service={bookingData.service!}
            professional={bookingData.professional!}
            date={bookingData.date!}
            onTimeSelect={handleTimeSelect}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Stepper steps={STEPS} currentStep={currentStep} data-testid="stepper-booking" />
          
          <div className="mt-8">
            {renderStepContent()}
          </div>

          {/* Show booking summary if all data is complete */}
          {bookingData.service && 
           bookingData.professional && 
           bookingData.date && 
           bookingData.time && (
            <div className="mt-8">
              <BookingSummary
                service={bookingData.service}
                professional={bookingData.professional}
                date={bookingData.date}
                time={bookingData.time}
                onBack={handleBack}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
