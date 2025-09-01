import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import WeeklyCalendar from "@/components/dashboard/weekly-calendar";
import AppointmentList from "@/components/dashboard/appointment-list";
import ServiceConfig from "@/components/dashboard/service-config";
import { CalendarCheck, DollarSign, Star, Settings, Plus } from "lucide-react";

export default function BarberDashboard() {
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

  // Redirect non-barbers
  useEffect(() => {
    if (!isLoading && user && user.userType !== 'barber') {
      toast({
        title: "Access Denied",
        description: "Esta página é apenas para barbeiros.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [user, isLoading, toast]);

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

  if (!user || user.userType !== 'barber') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
                  Painel do Barbeiro
                </h1>
                <p className="text-muted-foreground">
                  Gerencie seus agendamentos e configurações
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="secondary" data-testid="button-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
                <Button data-testid="button-new-slot">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Horário
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card data-testid="card-stat-today">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="text-accent text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hoje</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-week">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Esta semana</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-revenue">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Faturamento</p>
                    <p className="text-2xl font-bold">R$ 0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-rating">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avaliação</p>
                    <p className="text-2xl font-bold">--</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Calendar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Agenda Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyCalendar />
            </CardContent>
          </Card>

          {/* Appointments and Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurar Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceConfig />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
