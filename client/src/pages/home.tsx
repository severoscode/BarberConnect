import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import { Calendar, Clock, User, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '12.8rem',
            width: '12.8rem',
            borderBottom: '2px solid var(--gold)',
            margin: '0 auto 1.6rem'
          }}></div>
          <p style={{ color: 'var(--secondary)' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isBarber = user.userType === 'barber';

  return (
    <div id="PAGES_CONTAINER" style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)'
    }}>
      <Header />
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3.2rem 1.6rem'
      }}>
        <div style={{
          maxWidth: '96rem',
          margin: '0 auto'
        }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: '3.2rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '0.8rem',
              color: 'var(--foreground)'
            }} data-testid="text-welcome">
              Bem-vindo, {user.firstName || user.email}!
            </h1>
            <p style={{ color: 'var(--secondary)' }}>
              {isBarber 
                ? "Gerencie sua agenda e atenda seus clientes com eficiência."
                : "Agende seus serviços favoritos de forma rápida e prática."
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.4rem',
            marginBottom: '3.2rem'
          }}>
            {!isBarber && (
              <div style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'box-shadow 0.4s ease'
              }} className="service-card" data-testid="card-new-booking">
                <Link href="/booking">
                  <div style={{
                    padding: '2.4rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '4.8rem',
                      height: '4.8rem',
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.6rem'
                    }}>
                      <Calendar style={{
                        height: '2.4rem',
                        width: '2.4rem',
                        color: 'var(--gold)'
                      }} />
                    </div>
                    <h3 style={{
                      fontWeight: '600',
                      marginBottom: '0.8rem',
                      color: 'var(--foreground)'
                    }}>Novo Agendamento</h3>
                    <p style={{
                      fontSize: '1.4rem',
                      color: 'var(--secondary)'
                    }}>
                      Agende um novo serviço
                    </p>
                  </div>
                </Link>
              </div>
            )}

            <div style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'box-shadow 0.4s ease'
            }} className="service-card" data-testid="card-appointments">
              <div style={{
                padding: '2.4rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '4.8rem',
                  height: '4.8rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.6rem'
                }}>
                  <Clock style={{
                    height: '2.4rem',
                    width: '2.4rem',
                    color: '#3b82f6'
                  }} />
                </div>
                <h3 style={{
                  fontWeight: '600',
                  marginBottom: '0.8rem',
                  color: 'var(--foreground)'
                }}>
                  {isBarber ? "Minha Agenda" : "Meus Agendamentos"}
                </h3>
                <p style={{
                  fontSize: '1.4rem',
                  color: 'var(--secondary)'
                }}>
                  {isBarber ? "Visualize sua agenda" : "Veja seus agendamentos"}
                </p>
              </div>
            </div>

            {isBarber && (
              <div style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'box-shadow 0.4s ease'
              }} className="service-card" data-testid="card-dashboard">
                <Link href="/dashboard">
                  <div style={{
                    padding: '2.4rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '4.8rem',
                      height: '4.8rem',
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.6rem'
                    }}>
                      <Settings style={{
                        height: '2.4rem',
                        width: '2.4rem',
                        color: 'var(--gold)'
                      }} />
                    </div>
                    <h3 style={{
                      fontWeight: '600',
                      marginBottom: '0.8rem',
                      color: 'var(--foreground)'
                    }}>Painel de Controle</h3>
                    <p style={{
                      fontSize: '1.4rem',
                      color: 'var(--secondary)'
                    }}>
                      Gerencie serviços e configurações
                    </p>
                  </div>
                </Link>
              </div>
            )}

            <div style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'box-shadow 0.4s ease'
            }} className="service-card" data-testid="card-profile">
              <div style={{
                padding: '2.4rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '4.8rem',
                  height: '4.8rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.6rem'
                }}>
                  <User style={{
                    height: '2.4rem',
                    width: '2.4rem',
                    color: '#22c55e'
                  }} />
                </div>
                <h3 style={{
                  fontWeight: '600',
                  marginBottom: '0.8rem',
                  color: 'var(--foreground)'
                }}>Meu Perfil</h3>
                <p style={{
                  fontSize: '1.4rem',
                  color: 'var(--secondary)'
                }}>
                  Editar informações pessoais
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3.2rem'
          }}>
            <div style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)'
            }}>
              <div style={{
                padding: '1.6rem',
                borderBottom: '1px solid var(--border)'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  color: 'var(--foreground)'
                }}>
                  {isBarber ? "Próximos Agendamentos" : "Meus Agendamentos"}
                </h3>
              </div>
              <div style={{ padding: '1.6rem' }}>
                <div style={{
                  textAlign: 'center',
                  padding: '3.2rem 0',
                  color: 'var(--secondary)'
                }} data-testid="text-no-appointments">
                  <Clock style={{
                    height: '4.8rem',
                    width: '4.8rem',
                    margin: '0 auto 1.6rem',
                    opacity: 0.5
                  }} />
                  <p>Nenhum agendamento encontrado</p>
                  {!isBarber && (
                    <button className="my-button" style={{ marginTop: '1.6rem' }}>
                      <Link href="/booking" data-testid="button-first-booking">
                        Fazer Primeiro Agendamento
                      </Link>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)'
            }}>
              <div style={{
                padding: '1.6rem',
                borderBottom: '1px solid var(--border)'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  color: 'var(--foreground)'
                }}>Estatísticas</h3>
              </div>
              <div style={{ padding: '1.6rem' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.6rem'
                }}>
                  {isBarber ? (
                    <>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }} data-testid="stat-today">
                        <span style={{ color: 'var(--secondary)' }}>Hoje</span>
                        <span style={{ fontWeight: '600' }}>0 agendamentos</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }} data-testid="stat-week">
                        <span style={{ color: 'var(--secondary)' }}>Esta semana</span>
                        <span style={{ fontWeight: '600' }}>0 agendamentos</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }} data-testid="stat-rating">
                        <span style={{ color: 'var(--secondary)' }}>Avaliação média</span>
                        <span style={{ fontWeight: '600' }}>--</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }} data-testid="stat-total">
                        <span style={{ color: 'var(--secondary)' }}>Total de agendamentos</span>
                        <span style={{ fontWeight: '600' }}>0</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }} data-testid="stat-upcoming">
                        <span style={{ color: 'var(--secondary)' }}>Próximos</span>
                        <span style={{ fontWeight: '600' }}>0</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }} data-testid="stat-favorite">
                        <span style={{ color: 'var(--secondary)' }}>Serviço favorito</span>
                        <span style={{ fontWeight: '600' }}>--</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
