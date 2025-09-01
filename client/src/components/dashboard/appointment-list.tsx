import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format, parseISO, isToday, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Edit, X, Clock, Calendar } from "lucide-react";
import type { AppointmentWithDetails } from "@shared/schema";

export default function AppointmentList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, error } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      return await apiRequest("PUT", `/api/appointments/${appointmentId}`, {
        status: "cancelled",
        cancellationReason: "Cancelado pelo profissional"
      });
    },
    onSuccess: () => {
      toast({
        title: "Agendamento cancelado",
        description: "O agendamento foi cancelado com sucesso.",
      });
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
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleEditAppointment = (appointmentId: string) => {
    // TODO: Open edit appointment modal
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de edição será implementada em breve.",
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    // Simple confirmation - in production, this would be a proper dialog
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      cancelAppointmentMutation.mutate(appointmentId);
    }
  };

  const getAppointmentIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center";
      case "confirmed":
        return "w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center";
      case "completed":
        return "w-10 h-10 bg-green-100 rounded-full flex items-center justify-center";
      case "cancelled":
        return "w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center";
      default:
        return "w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center";
    }
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
        return "text-accent";
      case "completed":
        return "text-green-600";
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
      return isFuture(appointmentDate) || isToday(appointmentDate);
    })
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
    .slice(0, 10); // Show max 10 appointments

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Erro ao carregar agendamentos. Tente novamente.</p>
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
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (upcomingAppointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum agendamento próximo</p>
        <p className="text-sm mt-2">Os agendamentos futuros aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingAppointments.map((appointment) => {
        const appointmentDate = parseISO(appointment.startTime);
        const canEdit = isFuture(appointmentDate) && appointment.status !== "cancelled";
        
        return (
          <div
            key={appointment.id}
            className="flex items-center space-x-4 p-3 border border-border rounded-lg hover:shadow-sm transition-shadow"
            data-testid={`appointment-item-${appointment.id}`}
          >
            <div className={getAppointmentIcon(appointment.status)}>
              <User className="text-accent h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <div className="font-medium" data-testid={`client-name-${appointment.id}`}>
                {appointment.client.firstName} {appointment.client.lastName}
              </div>
              <div className="text-sm text-muted-foreground flex items-center space-x-4">
                <span data-testid={`service-name-${appointment.id}`}>
                  {appointment.service.name}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(appointmentDate, "dd/MM 'às' HH:mm", { locale: ptBR })}
                </span>
                <span className={`font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditAppointment(appointment.id)}
                  disabled={cancelAppointmentMutation.isPending}
                  data-testid={`button-edit-appointment-${appointment.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCancelAppointment(appointment.id)}
                  disabled={cancelAppointmentMutation.isPending}
                  className="text-destructive hover:text-destructive"
                  data-testid={`button-cancel-appointment-${appointment.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
