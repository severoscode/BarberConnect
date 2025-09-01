import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Edit, X } from "lucide-react";
import type { AppointmentWithDetails } from "@shared/schema";

export default function WeeklyCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: appointments = [], isLoading, error } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments", "range", {
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString()
    }],
  });

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const getAppointmentForSlot = (day: Date, timeSlot: string) => {
    return appointments.find(appointment => {
      const appointmentDate = parseISO(appointment.startTime);
      const appointmentTime = format(appointmentDate, "HH:mm");
      return isSameDay(appointmentDate, day) && appointmentTime === timeSlot;
    });
  };

  const getAppointmentColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "confirmed":
        return "border-l-accent bg-accent/10";
      case "completed":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      case "cancelled":
        return "border-l-destructive bg-destructive/10";
      default:
        return "border-l-accent bg-accent/10";
    }
  };

  const handleEditAppointment = (appointmentId: string) => {
    // TODO: Open edit appointment modal
    console.log('Edit appointment:', appointmentId);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    // TODO: Confirm and cancel appointment
    console.log('Cancel appointment:', appointmentId);
  };

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Erro ao carregar agenda. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" data-testid="text-calendar-title">
          Agenda Semanal
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevWeek}
            data-testid="button-prev-week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium px-4" data-testid="text-week-range">
            {format(weekStart, "dd", { locale: ptBR })} - {format(weekEnd, "dd MMM, yyyy", { locale: ptBR })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            data-testid="button-next-week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-8 gap-4 mb-4">
        <div className="text-sm font-medium text-muted-foreground"></div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="text-sm font-medium text-center" data-testid={`day-header-${format(day, "yyyy-MM-dd")}`}>
            {format(day, "EEE", { locale: ptBR })}<br />
            <span className="text-xs text-muted-foreground">{format(day, "dd")}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="space-y-2">
          {timeSlots.slice(0, 5).map((_, index) => (
            <div key={index} className="grid grid-cols-8 gap-4 items-center">
              <Skeleton className="h-4 w-12" />
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <Skeleton key={dayIndex} className="h-12 w-full" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 gap-4 items-center" data-testid={`time-row-${timeSlot}`}>
              <div className="text-sm text-muted-foreground">{timeSlot}</div>
              {weekDays.map((day) => {
                const appointment = getAppointmentForSlot(day, timeSlot);
                return (
                  <div key={day.toISOString()} className="h-12 relative">
                    {appointment ? (
                      <div
                        className={`appointment-card h-full rounded border-l-4 p-2 cursor-pointer group ${getAppointmentColor(appointment.status)}`}
                        data-testid={`appointment-${appointment.id}`}
                      >
                        <div className="text-xs font-medium truncate">
                          {appointment.client.firstName} {appointment.client.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {appointment.service.name}
                        </div>
                        
                        {/* Action buttons - shown on hover */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAppointment(appointment.id);
                            }}
                            data-testid={`button-edit-${appointment.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelAppointment(appointment.id);
                            }}
                            data-testid={`button-cancel-${appointment.id}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full border border-dashed border-border/50 rounded"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {!isLoading && appointments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum agendamento nesta semana.</p>
        </div>
      )}
    </div>
  );
}
