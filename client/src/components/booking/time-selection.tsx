import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  
  const { data: availableSlots, isLoading } = useQuery<string[]>({
    queryKey: ["/api/available-slots", {
      date: date.toISOString().split('T')[0],
      serviceId: service.id,
      professionalId
    }],
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

  const { morning, afternoon } = availableSlots ? organizeSlotsByPeriod(availableSlots) : { morning: [], afternoon: [] };

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
      }}>Escolha o horário</h2>
      
      {/* Selected service, professional and date info */}
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
            }}>
              {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })} - {format(date, "EEEE", { locale: ptBR })}
            </p>
            <p style={{
              fontSize: '1.4rem',
              color: 'var(--secondary)'
            }}>
              {service.name} • {professionalName} • {service.durationMinutes} min
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
          <div>
            <Skeleton style={{
              height: '2rem',
              width: '6.4rem',
              marginBottom: '1.6rem'
            }} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '1.2rem'
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} style={{
                  height: '4.8rem',
                  width: '100%'
                }} />
              ))}
            </div>
          </div>
          <div>
            <Skeleton style={{
              height: '2rem',
              width: '6.4rem',
              marginBottom: '1.6rem'
            }} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '1.2rem'
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} style={{
                  height: '4.8rem',
                  width: '100%'
                }} />
              ))}
            </div>
          </div>
        </div>
      ) : availableSlots && availableSlots.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
          {morning.length > 0 && (
            <div>
              <h3 style={{
                fontWeight: '500',
                marginBottom: '1.6rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--foreground)'
              }}>
                <Clock style={{
                  height: '1.6rem',
                  width: '1.6rem',
                  marginRight: '0.8rem'
                }} />
                Manhã
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '1.2rem'
              }}>
                {morning.map((time) => (
                  <button
                    key={time}
                    className="time-slot"
                    style={{
                      padding: '1.2rem',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      textAlign: 'center',
                      backgroundColor: selectedTime === time ? 'var(--primary)' : 'var(--card)',
                      color: selectedTime === time ? 'var(--primary-foreground)' : 'var(--foreground)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleTimeSelect(time)}
                    data-testid={`time-${time}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {afternoon.length > 0 && (
            <div>
              <h3 style={{
                fontWeight: '500',
                marginBottom: '1.6rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--foreground)'
              }}>
                <Clock style={{
                  height: '1.6rem',
                  width: '1.6rem',
                  marginRight: '0.8rem'
                }} />
                Tarde
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '1.2rem'
              }}>
                {afternoon.map((time) => (
                  <button
                    key={time}
                    className="time-slot"
                    style={{
                      padding: '1.2rem',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      textAlign: 'center',
                      backgroundColor: selectedTime === time ? 'var(--primary)' : 'var(--card)',
                      color: selectedTime === time ? 'var(--primary-foreground)' : 'var(--foreground)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleTimeSelect(time)}
                    data-testid={`time-${time}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '3.2rem 0',
          color: 'var(--secondary)'
        }}>
          <Clock style={{
            height: '4.8rem',
            width: '4.8rem',
            margin: '0 auto 1.6rem',
            opacity: 0.5
          }} />
          <p>Nenhum horário disponível para esta data.</p>
          <p style={{
            fontSize: '1.4rem',
            marginTop: '0.8rem'
          }}>Tente selecionar outra data.</p>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2.4rem'
      }}>
        <button className="my-button" style={{
          backgroundColor: 'transparent',
          color: 'var(--foreground)',
          borderColor: 'var(--border)'
        }} onClick={onBack} data-testid="button-back">
          Voltar
        </button>
        {selectedTime && (
          <span style={{
            fontSize: '1.4rem',
            color: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center'
          }}>
            Horário selecionado: <strong style={{ marginLeft: '0.4rem' }}>{selectedTime}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
