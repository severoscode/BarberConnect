import { useAuth } from "@/hooks/useAuth";
import { Scissors } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header id="SITE_HEADER_WRAPPER" style={{
      backgroundColor: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '6.4rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.6rem'
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }} data-testid="link-home">
              <Scissors style={{
                height: '2.4rem',
                width: '2.4rem',
                color: 'var(--gold)'
              }} />
              <span style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--foreground)'
              }}>BarberApp</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <nav className="desktop-menu" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3.2rem'
            }}>
              <Link href="/" className="nav-link" data-testid="link-home-nav">
                Início
              </Link>
              {user?.userType !== 'barber' && (
                <Link href="/booking" className="nav-link" data-testid="link-booking">
                  Agendar
                </Link>
              )}
              {user?.userType === 'barber' && (
                <Link href="/dashboard" className="nav-link" data-testid="link-dashboard">
                  Dashboard
                </Link>
              )}
            </nav>
          )}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem'
          }}>
            {isAuthenticated ? (
              <>
                <span style={{
                  fontSize: '1.4rem',
                  color: 'var(--secondary)',
                  display: 'none'
                }} className="hidden md:block" data-testid="text-user-greeting">
                  Olá, {user?.firstName || user?.email}
                </span>
                <button 
                  className="my-button"
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="button-logout"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button 
                  className="my-button"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)'
                  }}
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-login"
                >
                  Entrar
                </button>
                <button 
                  className="my-button"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-register"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
