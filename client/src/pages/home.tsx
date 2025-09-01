import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isBarber = user.userType === 'barber';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
              Bem-vindo, {user.firstName || user.email}!
            </h1>
            <p className="text-muted-foreground">
              {isBarber 
                ? "Gerencie sua agenda e atenda seus clientes com eficiência."
                : "Agende seus serviços favoritos de forma rápida e prática."
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {!isBarber && (
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-new-booking">
                <Link href="/booking">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Novo Agendamento</h3>
                    <p className="text-sm text-muted-foreground">
                      Agende um novo serviço
                    </p>
                  </CardContent>
                </Link>
              </Card>
            )}

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-appointments">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">
                  {isBarber ? "Minha Agenda" : "Meus Agendamentos"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isBarber ? "Visualize sua agenda" : "Veja seus agendamentos"}
                </p>
              </CardContent>
            </Card>

            {isBarber && (
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-dashboard">
                <Link href="/dashboard">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Painel de Controle</h3>
                    <p className="text-sm text-muted-foreground">
                      Gerencie serviços e configurações
                    </p>
                  </CardContent>
                </Link>
              </Card>
            )}

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-profile">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Meu Perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Editar informações pessoais
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isBarber ? "Próximos Agendamentos" : "Meus Agendamentos"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground" data-testid="text-no-appointments">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum agendamento encontrado</p>
                    {!isBarber && (
                      <Button className="mt-4" asChild>
                        <Link href="/booking" data-testid="button-first-booking">
                          Fazer Primeiro Agendamento
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isBarber ? (
                    <>
                      <div className="flex justify-between items-center" data-testid="stat-today">
                        <span className="text-muted-foreground">Hoje</span>
                        <span className="font-semibold">0 agendamentos</span>
                      </div>
                      <div className="flex justify-between items-center" data-testid="stat-week">
                        <span className="text-muted-foreground">Esta semana</span>
                        <span className="font-semibold">0 agendamentos</span>
                      </div>
                      <div className="flex justify-between items-center" data-testid="stat-rating">
                        <span className="text-muted-foreground">Avaliação média</span>
                        <span className="font-semibold">--</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center" data-testid="stat-total">
                        <span className="text-muted-foreground">Total de agendamentos</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between items-center" data-testid="stat-upcoming">
                        <span className="text-muted-foreground">Próximos</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between items-center" data-testid="stat-favorite">
                        <span className="text-muted-foreground">Serviço favorito</span>
                        <span className="font-semibold">--</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
