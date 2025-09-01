import { useState } from "react";
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
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '2.4rem'
    }}>
      <h2 style={{
        fontSize: '2.4rem',
        fontWeight: '600',
        marginBottom: '2.4rem',
        color: 'var(--foreground)'
      }}>Escolha a data</h2>
      
      {/* Selected service and professional info */}
      <div style={{
        backgroundColor: 'rgba(153, 153, 153, 0.1)',
        padding: '1.6rem',
        borderRadius: 'var(--radius)',
        marginBottom: '2.4rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.6rem'
        }}>
          <CalendarIcon style={{
            color: 'var(--gold)',
            height: '2rem',
            width: '2rem'
          }} />
          <div>
            <p style={{
              fontWeight: '500',
              color: 'var(--foreground)'
            }}>{service.name}</p>
            <p style={{
              fontSize: '1.4rem',
              color: 'var(--secondary)'
            }}>
              {professionalName} • {service.durationMinutes} min • R$ {parseFloat(service.price).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2.4rem'
      }}>
        {/* Calendar */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.6rem'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '500',
              color: 'var(--foreground)'
            }}>
              {format(viewDate, "MMMM yyyy", { locale: ptBR })}
            </h3>
            <div style={{
              display: 'flex',
              gap: '0.8rem'
            }}>
              <button
                className="my-button"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '1.2rem',
                  backgroundColor: 'transparent',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)'
                }}
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                data-testid="button-prev-month"
              >
                <ChevronLeft style={{ height: '1.6rem', width: '1.6rem' }} />
              </button>
              <button
                className="my-button"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '1.2rem',
                  backgroundColor: 'transparent',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)'
                }}
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                data-testid="button-next-month"
              >
                <ChevronRight style={{ height: '1.6rem', width: '1.6rem' }} />
              </button>
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
            style={{
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)'
            }}
            data-testid="calendar-date-selection"
          />
        </div>
        
        {/* Available times preview */}
        <div>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '500',
            marginBottom: '1.6rem',
            color: 'var(--foreground)'
          }}>Horários disponíveis</h3>
          {selectedDate ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{
                fontSize: '1.4rem',
                color: 'var(--secondary)',
                marginBottom: '1.2rem'
              }}>
                {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.8rem'
              }}>
                {/* Sample available times */}
                {[
                  "09:00", "09:30", "10:00", "10:30", "11:00", "14:00",
                  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
                ].map((time) => (
                  <div
                    key={time}
                    className="time-slot"
                    style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                      backgroundColor: 'var(--card)',
                      color: 'var(--foreground)'
                    }}
                    data-testid={`time-preview-${time}`}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3.2rem 0',
              color: 'var(--secondary)'
            }}>
              <CalendarIcon style={{
                height: '4.8rem',
                width: '4.8rem',
                margin: '0 auto 1.6rem',
                opacity: 0.5
              }} />
              <p>Selecione uma data para ver os horários disponíveis</p>
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2.4rem'
      }}>
        <button className="my-button" style={{
          backgroundColor: 'transparent',
          color: 'var(--foreground)',
          borderColor: 'var(--border)'
        }} onClick={onBack} data-testid="button-back">
          Voltar
        </button>
        <button 
          className="my-button"
          style={{
            opacity: selectedDate ? 1 : 0.5,
            cursor: selectedDate ? 'pointer' : 'not-allowed'
          }}
          onClick={handleConfirm} 
          disabled={!selectedDate}
          data-testid="button-next"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
