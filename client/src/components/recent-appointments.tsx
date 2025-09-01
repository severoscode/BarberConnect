
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, isToday, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "wouter";
import type { AppointmentWithDetails } from "@shared/schema";

export default function RecentAppointments() {
  const { user } = useAuth();
  
  const { data: appointments = [], isLoading, error } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
  });

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-green-600";
      case "completed":
        return "text-blue-600";
      case "cancelled":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  // Filter and sort appointments - show upcoming and today's appointments first
  const upcomingAppointments = appointments
    .filter(appointment => {
      const appointmentDate = parseISO(appointment.startTime);
      return (isFuture(appointmentDate) || isToday(appointmentDate)) && appointment.status !== "cancelled";
    })
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
    .slice(0, 3); // Show max 3 appointments on home

  const isBarber = user?.userType === 'barber';

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Erro ao carregar agendamentos.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (upcomingAppointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="text-no-appointments">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum agendamento próximo</p>
        {!isBarber && (
          <Button className="mt-4" asChild>
            <Link href="/booking" data-testid="button-first-booking">
              Fazer Primeiro Agendamento
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingAppointments.map((appointment) => {
        const appointmentDate = parseISO(appointment.startTime);
        
        return (
          <div
            key={appointment.id}
            className="flex items-center space-x-4 p-3 border border-border rounded-lg hover:shadow-sm transition-shadow"
            data-testid={`appointment-item-${appointment.id}`}
          >
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-accent" />
            </div>
            
            <div className="flex-1">
              <div className="font-medium" data-testid={`client-name-${appointment.id}`}>
                {isBarber 
                  ? `${appointment.client.firstName} ${appointment.client.lastName}`
                  : appointment.professional?.user?.firstName 
                    ? `${appointment.professional.user.firstName} ${appointment.professional.user.lastName}`
                    : "Profissional não definido"
                }
              </div>
              <div className="text-sm text-muted-foreground" data-testid={`service-name-${appointment.id}`}>
                {appointment.service.name} • {formatPrice(appointment.service.price)}
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {format(appointmentDate, "dd/MM 'às' HH:mm", { locale: ptBR })}
                <span className={`ml-2 font-medium ${getStatusColor(appointment.status)}`}>
                  • {getStatusText(appointment.status)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {appointments.length > 3 && (
        <div className="text-center pt-4">
          <Button variant="outline" asChild>
            <Link href="/appointments">
              Ver Todos os Agendamentos
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
