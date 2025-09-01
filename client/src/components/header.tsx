import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Scissors } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <Scissors className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">BarberApp</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home-nav">
                Início
              </Link>
              {user?.userType !== 'barber' && (
                <Link href="/booking" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-booking">
                  Agendar
                </Link>
              )}
              {user?.userType === 'barber' && (
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-dashboard">
                  Dashboard
                </Link>
              )}
            </nav>
          )}
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:block" data-testid="text-user-greeting">
                  Olá, {user?.firstName || user?.email}
                </span>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="button-logout"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-login"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-register"
                >
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
