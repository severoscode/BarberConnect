import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { Service, ProfessionalWithUser } from "@shared/schema";

interface DateSelectionProps {
  service: Service;
  professional: ProfessionalWithUser | "any";
  onDateSelect: (date: Date) => void;
  onBack: () => void;
}

export default function DateSelection({ 
  service, 
  professional, 
  onDateSelect, 
  onBack 
}: DateSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [viewDate, setViewDate] = useState(new Date());

  // Generate available dates (excluding Sundays for this example)
  const getAvailableDates = () => {
    const dates = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleDateSelect = (date: Date | undefined) => {
    if (date && availableDates.some(d => isSameDay(d, date))) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
    }
  };

  const isDateDisabled = (date: Date) => {
    return !availableDates.some(d => isSameDay(d, date));
  };

  const professionalName = professional === "any" 
    ? "Qualquer profissional" 
    : `${professional.user.firstName} ${professional.user.lastName}`;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Escolha a data</h2>
        
        {/* Selected service and professional info */}
        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="text-accent h-5 w-5" />
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                {professionalName} • {service.durationMinutes} min • R$ {parseFloat(service.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {format(viewDate, "MMMM yyyy", { locale: ptBR })}
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                  data-testid="button-prev-month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                  data-testid="button-next-month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              locale={ptBR}
              month={viewDate}
              onMonthChange={setViewDate}
              className="rounded-md border"
              data-testid="calendar-date-selection"
            />
          </div>
          
          {/* Available times preview */}
          <div>
            <h3 className="text-lg font-medium mb-4">Horários disponíveis</h3>
            {selectedDate ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-3">
                  {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Sample available times */}
                  {[
                    "09:00", "09:30", "10:00", "10:30", "11:00", "14:00",
                    "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
                  ].map((time) => (
                    <div
                      key={time}
                      className="text-center p-2 border border-border rounded-md text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                      data-testid={`time-preview-${time}`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma data para ver os horários disponíveis</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack} data-testid="button-back">
            Voltar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedDate}
            data-testid="button-next"
          >
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
