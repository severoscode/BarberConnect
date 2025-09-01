import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      <div style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '2.4rem',
        textAlign: 'center'
      }}>
        <CheckCircle style={{
          height: '6.4rem',
          width: '6.4rem',
          color: '#28a745',
          margin: '0 auto 1.6rem'
        }} />
        <h2 style={{
          fontSize: '2.4rem',
          fontWeight: '600',
          marginBottom: '1.6rem',
          color: 'var(--foreground)'
        }}>Agendamento Confirmado!</h2>
        <p style={{
          color: 'var(--secondary)',
          marginBottom: '2.4rem'
        }}>
          Seu agendamento foi confirmado com sucesso. Você receberá um email de confirmação em breve.
        </p>
        <div style={{
          backgroundColor: 'rgba(153, 153, 153, 0.1)',
          padding: '1.6rem',
          borderRadius: 'var(--radius)',
          marginBottom: '2.4rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            fontSize: '1.4rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: 'var(--secondary)' }}>Serviço:</span>
              <span style={{ fontWeight: '500' }}>{service.name}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: 'var(--secondary)' }}>Profissional:</span>
              <span style={{ fontWeight: '500' }}>{professionalName}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: 'var(--secondary)' }}>Data:</span>
              <span style={{ fontWeight: '500' }}>
                {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: 'var(--secondary)' }}>Horário:</span>
              <span style={{ fontWeight: '500' }}>{time}</span>
            </div>
          </div>
        </div>
        <button className="my-button" onClick={() => window.location.href = "/"} data-testid="button-back-home">
          Voltar ao Início
        </button>
      </div>
    );
  }

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
      }}>Confirmar agendamento</h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.6rem',
        marginBottom: '2.4rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <span style={{ color: 'var(--secondary)' }}>Serviço:</span>
          <span style={{ fontWeight: '500' }}>{service.name}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <span style={{ color: 'var(--secondary)' }}>Profissional:</span>
          <span style={{ fontWeight: '500' }}>{professionalName}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <span style={{ color: 'var(--secondary)' }}>Data:</span>
          <span style={{ fontWeight: '500' }}>
            {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <span style={{ color: 'var(--secondary)' }}>Horário:</span>
          <span style={{ fontWeight: '500' }}>{time}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <span style={{ color: 'var(--secondary)' }}>Duração:</span>
          <span style={{ fontWeight: '500' }}>{service.durationMinutes} minutos</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0'
        }}>
          <span style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: 'var(--foreground)'
          }}>Total:</span>
          <span style={{
            fontSize: '2.4rem',
            fontWeight: 'bold',
            color: 'var(--gold)'
          }}>
            R$ {parseFloat(service.price).toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(153, 153, 153, 0.1)',
        padding: '1.6rem',
        borderRadius: 'var(--radius)',
        marginBottom: '2.4rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.2rem'
        }}>
          <InfoIcon style={{
            color: 'var(--gold)',
            marginTop: '0.2rem',
            height: '2rem',
            width: '2rem'
          }} />
          <div style={{ fontSize: '1.4rem' }}>
            <p style={{
              fontWeight: '500',
              marginBottom: '0.4rem',
              color: 'var(--foreground)'
            }}>Política de cancelamento</p>
            <p style={{ color: 'var(--secondary)' }}>
              Você pode cancelar este agendamento até 1 hora antes do horário marcado sem cobrança.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          <button 
            className="my-button"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              borderColor: 'var(--border)'
            }}
            onClick={onBack}
            disabled={createAppointmentMutation.isPending}
            data-testid="button-back"
          >
            Voltar
          </button>
          <button 
            className="my-button"
            style={{ flex: 1 }}
            onClick={handleConfirmBooking}
            disabled={createAppointmentMutation.isPending}
            data-testid="button-confirm"
          >
            {createAppointmentMutation.isPending ? (
              <>
                <Loader2 style={{
                  marginRight: '0.8rem',
                  height: '1.6rem',
                  width: '1.6rem',
                  animation: 'spin 1s linear infinite'
                }} />
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle style={{
                  marginRight: '0.8rem',
                  height: '1.6rem',
                  width: '1.6rem'
                }} />
                Confirmar Agendamento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
