import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Star, User } from "lucide-react";
import type { Service, ProfessionalWithUser } from "@shared/schema";

interface ProfessionalSelectionProps {
  service: Service;
  onProfessionalSelect: (professional: ProfessionalWithUser | "any") => void;
  onBack: () => void;
}

export default function ProfessionalSelection({ 
  service, 
  onProfessionalSelect, 
  onBack 
}: ProfessionalSelectionProps) {
  const { data: professionals, isLoading, error } = useQuery<ProfessionalWithUser[]>({
    queryKey: ["/api/professionals"],
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
        }}>Escolha seu profissional</h2>
        
        {/* Any Professional Option Skeleton */}
        <div style={{
          border: '2px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1.6rem',
          marginBottom: '1.6rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.6rem'
          }}>
            <Skeleton style={{
              width: '6.4rem',
              height: '6.4rem',
              borderRadius: '50%'
            }} />
            <div style={{ flex: 1 }}>
              <Skeleton style={{
                height: '2.4rem',
                width: '19.2rem',
                marginBottom: '0.8rem'
              }} />
              <Skeleton style={{
                height: '1.6rem',
                width: '12.8rem'
              }} />
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.6rem'
        }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.6rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.6rem'
              }}>
                <Skeleton style={{
                  width: '6.4rem',
                  height: '6.4rem',
                  borderRadius: '50%'
                }} />
                <div style={{ flex: 1 }}>
                  <Skeleton style={{
                    height: '2rem',
                    width: '12.8rem',
                    marginBottom: '0.8rem'
                  }} />
                  <Skeleton style={{
                    height: '1.6rem',
                    width: '16rem',
                    marginBottom: '0.8rem'
                  }} />
                  <Skeleton style={{
                    height: '1.6rem',
                    width: '9.6rem'
                  }} />
                </div>
              </div>
            </div>
          ))}
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
          }} onClick={onBack}>
            Voltar
          </button>
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
        }}>Escolha seu profissional</h2>
        <div style={{
          textAlign: 'center',
          padding: '3.2rem 0',
          color: 'var(--destructive)'
        }}>
          <p>Erro ao carregar profissionais. Tente novamente.</p>
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
          }} onClick={onBack}>
            Voltar
          </button>
        </div>
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
      }}>Escolha seu profissional</h2>
      
      {/* Any Professional Option */}
      <div
        className="barber-card"
        style={{
          border: '2px solid var(--gold)',
          backgroundColor: 'rgba(255, 193, 7, 0.05)',
          borderRadius: 'var(--radius)',
          padding: '1.6rem',
          marginBottom: '1.6rem',
          cursor: 'pointer'
        }}
        onClick={() => onProfessionalSelect("any")}
        data-testid="professional-any"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.6rem'
        }}>
          <div style={{
            width: '6.4rem',
            height: '6.4rem',
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users style={{
              color: 'var(--gold)',
              fontSize: '2rem'
            }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontWeight: '500',
              fontSize: '1.8rem',
              color: 'var(--foreground)'
            }}>Qualquer Profissional</h3>
            <p style={{
              color: 'var(--secondary)'
            }}>Primeiro horário disponível</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.4rem'
            }}>
              <span style={{
                fontSize: '1.4rem',
                color: 'var(--gold)',
                fontWeight: '500'
              }}>Mais rápido</span>
            </div>
          </div>
          <div style={{ color: 'var(--gold)' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '2rem' }}></i>
          </div>
        </div>
      </div>

      {professionals && professionals.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.6rem'
        }}>
          {professionals.map((professional) => (
            <div
              key={professional.id}
              className="barber-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1.6rem',
                cursor: 'pointer',
                backgroundColor: 'var(--card)'
              }}
              onClick={() => onProfessionalSelect(professional)}
              data-testid={`professional-${professional.id}`}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.6rem'
              }}>
                {professional.user.profileImageUrl ? (
                  <img
                    src={professional.user.profileImageUrl}
                    alt={`${professional.user.firstName} ${professional.user.lastName}`}
                    style={{
                      width: '6.4rem',
                      height: '6.4rem',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '6.4rem',
                    height: '6.4rem',
                    background: 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User style={{
                      color: 'white',
                      fontSize: '2rem'
                    }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontWeight: '500',
                    fontSize: '1.8rem',
                    color: 'var(--foreground)'
                  }}>
                    {professional.user.firstName} {professional.user.lastName}
                  </h3>
                  <p style={{
                    color: 'var(--secondary)'
                  }}>
                    {professional.specialties || "Especialista em diversos serviços"}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    marginTop: '0.4rem'
                  }}>
                    {professional.rating && parseFloat(professional.rating) > 0 ? (
                      <>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <Star style={{
                            color: '#fbbf24',
                            fontSize: '1.4rem',
                            fill: 'currentColor'
                          }} />
                          <span style={{
                            fontSize: '1.4rem',
                            marginLeft: '0.4rem'
                          }}>{parseFloat(professional.rating).toFixed(1)}</span>
                        </div>
                        <span style={{
                          color: 'var(--secondary)',
                          fontSize: '1.4rem'
                        }}>
                          ({professional.totalReviews || 0} avaliações)
                        </span>
                      </>
                    ) : (
                      <span style={{
                        color: 'var(--secondary)',
                        fontSize: '1.4rem'
                      }}>Novo profissional</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '3.2rem 0',
          color: 'var(--secondary)'
        }}>
          <User style={{
            height: '4.8rem',
            width: '4.8rem',
            margin: '0 auto 1.6rem',
            opacity: 0.5
          }} />
          <p>Nenhum profissional disponível no momento.</p>
          <p style={{
            fontSize: '1.4rem',
            marginTop: '0.8rem'
          }}>Tente a opção "Qualquer Profissional" acima.</p>
        </div>
      )}

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
      </div>
    </div>
  );
}
