import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Scissors, Clock, DollarSign, Plus } from "lucide-react";
import type { Service, ProfessionalService, Professional } from "@shared/schema";

interface ServiceWithEnabled extends Service {
  isEnabled?: boolean;
}

export default function ServiceConfig() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current professional info
  const { data: professional } = useQuery<Professional>({
    queryKey: ["/api/professionals", "me"],
    enabled: !!user && user.userType === 'barber',
  });

  // Get all available services
  const { data: allServices = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Get professional's enabled services
  const { data: professionalServices = [], isLoading: profServicesLoading } = useQuery<(ProfessionalService & { service: Service })[]>({
    queryKey: ["/api/professionals", professional?.id, "services"],
    enabled: !!professional?.id,
  });

  const toggleServiceMutation = useMutation({
    mutationFn: async ({ serviceId, enabled }: { serviceId: string; enabled: boolean }) => {
      return await apiRequest("POST", `/api/professionals/${professional!.id}/services`, {
        serviceId,
        isEnabled: enabled,
      });
    },
    onSuccess: () => {
      toast({
        title: "Serviço atualizado",
        description: "As configurações do serviço foram atualizadas.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/professionals", professional?.id, "services"] });
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
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o serviço. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleServiceToggle = (serviceId: string, enabled: boolean) => {
    if (professional?.id) {
      toggleServiceMutation.mutate({ serviceId, enabled });
    }
  };

  const handleAddNewService = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de adicionar novos serviços será implementada em breve.",
    });
  };

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('corte')) return Scissors;
    if (name.includes('barba')) return Scissors;
    if (name.includes('pintura') || name.includes('luzes')) return Scissors;
    if (name.includes('hidratação') || name.includes('lavagem')) return Scissors;
    if (name.includes('penteado')) return Scissors;
    return Scissors;
  };

  // Merge all services with professional services to show enabled state
  const servicesWithEnabled: ServiceWithEnabled[] = allServices.map(service => {
    const professionalService = professionalServices.find(ps => ps.serviceId === service.id);
    return {
      ...service,
      isEnabled: professionalService?.isEnabled || false,
    };
  });

  if (servicesLoading || profServicesLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-6 h-6" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="w-11 h-6 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Perfil de profissional não encontrado.</p>
      </div>
    );
  }

  if (servicesWithEnabled.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Scissors className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum serviço disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {servicesWithEnabled.map((service) => {
        const IconComponent = getServiceIcon(service.name);
        
        return (
          <div
            key={service.id}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            data-testid={`service-config-${service.id}`}
          >
            <div className="flex items-center space-x-3">
              <IconComponent className="text-accent h-5 w-5" />
              <div>
                <div className="font-medium" data-testid={`service-name-${service.id}`}>
                  {service.name}
                </div>
                <div className="text-sm text-muted-foreground flex items-center space-x-3">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.durationMinutes} min
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    R$ {parseFloat(service.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <Switch
              checked={service.isEnabled}
              onCheckedChange={(enabled) => handleServiceToggle(service.id, enabled)}
              disabled={toggleServiceMutation.isPending}
              data-testid={`switch-service-${service.id}`}
            />
          </div>
        );
      })}

      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddNewService}
        data-testid="button-add-service"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Serviço
      </Button>
    </div>
  );
}
