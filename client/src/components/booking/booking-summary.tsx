import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InfoIcon, CheckCircle, Loader2 } from "lucide-react";
import type { Service, ProfessionalWithUser } from "@shared/schema";

interface BookingSummaryProps {
  service: Service;
  professional: ProfessionalWithUser | "any";
  date: Date;
  time: string;
  onBack: () => void;
}

export default function BookingSummary({ 
  service, 
  professional, 
  date, 
  time, 
  onBack 
}: BookingSummaryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBooked, setIsBooked] = useState(false);

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return await apiRequest("POST", "/api/appointments", appointmentData);
    },
    onSuccess: () => {
      setIsBooked(true);
      toast({
        title: "Agendamento confirmado!",
        description: "Você receberá um email de confirmação em breve.",
      });
      // Invalidate appointments query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao confirmar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmBooking = () => {
    // Create start and end times
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = addMinutes(startTime, service.durationMinutes);

    const appointmentData = {
      serviceId: service.id,
      professionalId: professional === "any" ? null : professional.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: "pending" as const,
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const professionalName = professional === "any" 
    ? "Qualquer profissional" 
    : `${professional.user.firstName} ${professional.user.lastName}`;

  if (isBooked) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Agendamento Confirmado!</h2>
          <p className="text-muted-foreground mb-6">
            Seu agendamento foi confirmado com sucesso. Você receberá um email de confirmação em breve.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serviço:</span>
                <span className="font-medium">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profissional:</span>
                <span className="font-medium">{professionalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium">
                  {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Horário:</span>
                <span className="font-medium">{time}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => window.location.href = "/"} data-testid="button-back-home">
            Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Confirmar agendamento</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-medium">{service.name}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Profissional:</span>
            <span className="font-medium">{professionalName}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Data:</span>
            <span className="font-medium">
              {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Horário:</span>
            <span className="font-medium">{time}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Duração:</span>
            <span className="font-medium">{service.durationMinutes} minutos</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-accent">
              R$ {parseFloat(service.price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <div className="flex items-start space-x-3">
            <InfoIcon className="text-accent mt-0.5 h-5 w-5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Política de cancelamento</p>
              <p className="text-muted-foreground">
                Você pode cancelar este agendamento até 1 hora antes do horário marcado sem cobrança.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onBack}
            disabled={createAppointmentMutation.isPending}
            data-testid="button-back"
          >
            Voltar
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleConfirmBooking}
            disabled={createAppointmentMutation.isPending}
            data-testid="button-confirm"
          >
            {createAppointmentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
