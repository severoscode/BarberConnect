import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import { Scissors, Clock, Calendar, Users, Star, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Agendamento Online para{" "}
            <span className="text-accent">Barbearias</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Simplifique sua experiência. Agende serviços em barbearias de forma 
            rápida e prática, escolhendo o profissional e horário ideal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-start-booking"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Começar Agendamento
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-barber-login"
            >
              <Scissors className="mr-2 h-5 w-5" />
              Sou Barbeiro
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher o BarberApp?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testid="card-feature-quick">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Agendamento Rápido</h3>
                <p className="text-muted-foreground">
                  Reserve seu horário em poucos cliques, sem necessidade de ligações.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-choice">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Escolha seu Profissional</h3>
                <p className="text-muted-foreground">
                  Selecione o barbeiro de sua preferência ou deixe o sistema encontrar o primeiro disponível.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-transparency">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparência Total</h3>
                <p className="text-muted-foreground">
                  Veja preços, duração dos serviços e avaliações antes de agendar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Como funciona
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="step-service">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Escolha o Serviço</h3>
              <p className="text-sm text-muted-foreground">
                Selecione entre corte, barba, tratamentos e mais
              </p>
            </div>

            <div className="text-center" data-testid="step-professional">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Profissional</h3>
              <p className="text-sm text-muted-foreground">
                Escolha seu barbeiro favorito ou qualquer disponível
              </p>
            </div>

            <div className="text-center" data-testid="step-datetime">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Data e Horário</h3>
              <p className="text-sm text-muted-foreground">
                Veja os horários disponíveis e escolha o melhor
              </p>
            </div>

            <div className="text-center" data-testid="step-confirm">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Confirmar</h3>
              <p className="text-sm text-muted-foreground">
                Receba a confirmação por email e pronto!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para agendar seu próximo corte?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de clientes que já descobriram a praticidade do BarberApp
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-cta-start"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scissors className="h-6 w-6 text-accent" />
                <span className="text-xl font-bold">BarberApp</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Facilitando o agendamento em barbearias com tecnologia moderna e interface intuitiva.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Clientes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Agendar Serviço</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Meus Agendamentos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Avaliações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Barbeiros</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Cadastrar Barbearia</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Gerenciar Agenda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Relatórios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 BarberApp. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
