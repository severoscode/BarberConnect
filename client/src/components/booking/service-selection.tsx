import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Scissors, Clock, DollarSign } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
}

export default function ServiceSelection({ onServiceSelect }: ServiceSelectionProps) {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (isLoading) {
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
        }}>Escolha seu serviço</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.6rem'
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.6rem'
            }}>
              <Skeleton style={{
                height: '4.8rem',
                width: '4.8rem',
                borderRadius: 'var(--radius)',
                marginBottom: '1.2rem'
              }} />
              <Skeleton style={{
                height: '2rem',
                width: '12.8rem',
                marginBottom: '0.8rem'
              }} />
              <Skeleton style={{
                height: '1.6rem',
                width: '8rem',
                marginBottom: '1.2rem'
              }} />
              <Skeleton style={{
                height: '1.6rem',
                width: '100%',
                marginBottom: '1.2rem'
              }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Skeleton style={{
                  height: '2.4rem',
                  width: '8rem'
                }} />
                <Skeleton style={{
                  height: '1.6rem',
                  width: '6.4rem'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
        }}>Escolha seu serviço</h2>
        <div style={{
          textAlign: 'center',
          padding: '3.2rem 0',
          color: 'var(--destructive)'
        }}>
          <p>Erro ao carregar serviços. Tente novamente.</p>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
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
        }}>Escolha seu serviço</h2>
        <div style={{
          textAlign: 'center',
          padding: '3.2rem 0',
          color: 'var(--secondary)'
        }}>
          <Scissors style={{
            height: '4.8rem',
            width: '4.8rem',
            margin: '0 auto 1.6rem',
            opacity: 0.5
          }} />
          <p>Nenhum serviço disponível no momento.</p>
        </div>
      </div>
    );
  }

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('corte')) return 'fa-cut';
    if (name.includes('barba')) return 'fa-user-tie';
    if (name.includes('pintura') || name.includes('luzes')) return 'fa-paint-brush';
    if (name.includes('hidratação') || name.includes('lavagem')) return 'fa-spray-can';
    if (name.includes('penteado')) return 'fa-star';
    return 'fa-scissors';
  };

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
      }}>Escolha seu serviço</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.6rem'
      }}>
        {services.map((service) => (
          <div
            key={service.id}
            className="service-card"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.6rem',
              cursor: 'pointer',
              backgroundColor: 'var(--card)'
            }}
            onClick={() => onServiceSelect(service)}
            data-testid={`service-${service.id}`}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              marginBottom: '1.2rem'
            }}>
              <div style={{
                width: '4.8rem',
                height: '4.8rem',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={`fas ${getServiceIcon(service.name)}`} style={{
                  color: 'var(--gold)',
                  fontSize: '1.8rem'
                }}></i>
              </div>
              <div>
                <h3 style={{
                  fontWeight: '500',
                  color: 'var(--foreground)'
                }}>{service.name}</h3>
                <p style={{
                  fontSize: '1.4rem',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Clock style={{
                    height: '1.2rem',
                    width: '1.2rem',
                    marginRight: '0.4rem'
                  }} />
                  {service.durationMinutes} min
                </p>
              </div>
            </div>
            {service.description && (
              <p style={{
                fontSize: '1.4rem',
                color: 'var(--secondary)',
                marginBottom: '1.2rem'
              }}>{service.description}</p>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--foreground)'
              }}>
                <DollarSign style={{
                  height: '1.6rem',
                  width: '1.6rem',
                  marginRight: '0.4rem'
                }} />
                R$ {parseFloat(service.price).toFixed(2)}
              </span>
              <button style={{
                fontSize: '1.4rem',
                color: 'var(--gold)',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius)',
                transition: 'all 0.4s ease'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255, 193, 7, 0.8)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--gold)';
              }}>
                Selecionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
