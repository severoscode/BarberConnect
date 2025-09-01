
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import { format, parseISO, isToday, isFuture, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, MapPin, Edit, X } from "lucide-react";
import { Link } from "wouter";
import type { AppointmentWithDetails } from "@shared/schema";

export default function Appointments() {
  const { user } = useAuth();
  
  const { data: appointments = [], isLoading, error } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
  });

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
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
  };

  // Separate appointments by status and date
  const upcomingAppointments = appointments
    .filter(appointment => {
      const appointmentDate = parseISO(appointment.startTime);
      return (isFuture(appointmentDate) || isToday(appointmentDate)) && appointment.status !== "cancelled";
    })
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());

  const pastAppointments = appointments
    .filter(appointment => {
      const appointmentDate = parseISO(appointment.startTime);
      return isPast(appointmentDate) && !isToday(appointmentDate);
    })
    .sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime());

  const isBarber = user?.userType === 'barber';

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-destructive">
            <p>Erro ao carregar agendamentos. Tente novamente.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isBarber ? "Minha Agenda" : "Meus Agendamentos"}
            </h1>
            <p className="text-muted-foreground">
              {isBarber 
                ? "Gerencie seus agendamentos e atenda seus clientes."
                : "Acompanhe seus agendamentos passados e futuros."
              }
            </p>
            {!isBarber && (
              <Button className="mt-4" asChild>
                <Link href="/booking">
                  <Calendar className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Link>
              </Button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upcoming Appointments */}
          {!isLoading && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Próximos Agendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum agendamento próximo</p>
                      {!isBarber && (
                        <Button className="mt-4" asChild>
                          <Link href="/booking">
                            Fazer Primeiro Agendamento
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => {
                        const appointmentDate = parseISO(appointment.startTime);
                        const canEdit = isFuture(appointmentDate) && appointment.status !== "cancelled";
                        
                        return (
                          <div
                            key={appointment.id}
                            className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-accent" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="font-medium">
                                {isBarber 
                                  ? `${appointment.client.firstName} ${appointment.client.lastName}`
                                  : appointment.professional?.user?.firstName 
                                    ? `${appointment.professional.user.firstName} ${appointment.professional.user.lastName}`
                                    : "Profissional não definido"
                                }
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">{appointment.service.name}</span>
                                <span className="mx-2">•</span>
                                <span>{formatPrice(appointment.service.price)}</span>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(appointmentDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                <span className="mx-2">•</span>
                                <span>{appointment.service.durationMinutes} min</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Badge className={getStatusColor(appointment.status)}>
                                {getStatusText(appointment.status)}
                              </Badge>
                              
                              {canEdit && (
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Appointments */}
              {pastAppointments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Histórico de Agendamentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastAppointments.slice(0, 10).map((appointment) => {
                        const appointmentDate = parseISO(appointment.startTime);
                        
                        return (
                          <div
                            key={appointment.id}
                            className="flex items-center space-x-4 p-4 border border-border rounded-lg opacity-75"
                          >
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="font-medium">
                                {isBarber 
                                  ? `${appointment.client.firstName} ${appointment.client.lastName}`
                                  : appointment.professional?.user?.firstName 
                                    ? `${appointment.professional.user.firstName} ${appointment.professional.user.lastName}`
                                    : "Profissional não definido"
                                }
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">{appointment.service.name}</span>
                                <span className="mx-2">•</span>
                                <span>{formatPrice(appointment.service.price)}</span>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(appointmentDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </div>
                            </div>

                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
