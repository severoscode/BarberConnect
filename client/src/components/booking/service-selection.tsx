import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Escolha seu serviço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Escolha seu serviço</h2>
          <div className="text-center py-8 text-destructive">
            <p>Erro ao carregar serviços. Tente novamente.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Escolha seu serviço</h2>
          <div className="text-center py-8 text-muted-foreground">
            <Scissors className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum serviço disponível no momento.</p>
          </div>
        </CardContent>
      </Card>
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
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Escolha seu serviço</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => onServiceSelect(service)}
              data-testid={`service-${service.id}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <i className={`fas ${getServiceIcon(service.name)} text-accent text-lg`}></i>
                </div>
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.durationMinutes} min
                  </p>
                </div>
              </div>
              {service.description && (
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  R$ {parseFloat(service.price).toFixed(2)}
                </span>
                <button className="text-sm text-accent hover:text-accent/80">
                  Selecionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
