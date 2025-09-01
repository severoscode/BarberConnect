import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import type { Service, ProfessionalWithUser } from "@shared/schema";

interface TimeSelectionProps {
  service: Service;
  professional: ProfessionalWithUser | "any";
  date: Date;
  onTimeSelect: (time: string) => void;
  onBack: () => void;
}

export default function TimeSelection({
  service,
  professional,
  date,
  onTimeSelect,
  onBack
}: TimeSelectionProps) {
  const [selectedTime, setSelectedTime] = useState<string>();

  const professionalId = professional === "any" ? undefined : professional.id;

  const { data: availableSlots, isLoading, error } = useQuery<string[]>({
    queryKey: ["/api/available-slots", date.toISOString().split('T')[0], service.id, professionalId],
    queryFn: async () => {
      const params = new URLSearchParams({
        date: date.toISOString().split('T')[0],
        serviceId: service.id,
        ...(professionalId && { professionalId })
      });

      const response = await fetch(`/api/available-slots?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }
      return response.json();
    },
    enabled: !!date && !!service.id,
  });

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  const professionalName = professional === "any"
    ? "Qualquer profissional"
    : `${professional.user.firstName} ${professional.user.lastName}`;

  const organizeSlotsByPeriod = (slots: string[]) => {
    const morning = slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour < 12;
    });

    const afternoon = slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 12;
    });

    return { morning, afternoon };
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
  };

  const formatSpecialties = (specialties: string | string[]) => {
    if (typeof specialties === 'string') {
      try {
        const parsedSpecialties = JSON.parse(specialties);
        if (Array.isArray(parsedSpecialties)) {
          return parsedSpecialties.join(', ');
        }
      } catch (e) {
        return specialties;
      }
    } else if (Array.isArray(specialties)) {
      return specialties.join(', ');
    }
    return 'N/A';
  };

  const { morning, afternoon } = availableSlots ? organizeSlotsByPeriod(availableSlots) : { morning: [], afternoon: [] };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Escolha o horário</h2>

        {/* Selected service, professional and date info */}
        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="text-accent h-5 w-5" />
            <div>
              <p className="font-medium">
                {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })} - {format(date, "EEEE", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">
                {service.name} • {professionalName} • {service.durationMinutes} min • {formatPrice(service.price)}
              </p>
              {professional !== "any" && professional.user.specialties && (
                <p className="text-sm text-muted-foreground">
                  Especialidades: {formatSpecialties(professional.user.specialties)}
                </p>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div>
              <Skeleton className="h-5 w-16 mb-4" />
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-16 mb-4" />
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Erro ao carregar horários disponíveis.</p>
            <p className="text-sm mt-2">Tente novamente mais tarde.</p>
          </div>
        ) : availableSlots && availableSlots.length > 0 ? (
          <div className="space-y-6">
            {morning.length > 0 && (
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Manhã
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {morning.map((time) => (
                    <button
                      key={`morning-${time}`}
                      className={`time-slot p-3 border border-border rounded-md text-center transition-colors hover:bg-muted ${
                        selectedTime === time ? 'selected bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      data-testid={`time-${time}`}
                    >
                      {formatTimeDisplay(time)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {afternoon.length > 0 && (
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Tarde
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {afternoon.map((time) => (
                    <button
                      key={`afternoon-${time}`}
                      className={`time-slot p-3 border border-border rounded-md text-center transition-colors hover:bg-muted ${
                        selectedTime === time ? 'selected bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      data-testid={`time-${time}`}
                    >
                      {formatTimeDisplay(time)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum horário disponível para esta data.</p>
            <p className="text-sm mt-2">Tente selecionar outra data.</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack} data-testid="button-back">
            Voltar
          </Button>
          {selectedTime && (
            <span className="text-sm text-muted-foreground flex items-center">
              Horário selecionado: <strong className="ml-1">{formatTimeDisplay(selectedTime)}</strong>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}