import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Escolha seu profissional</h2>
          
          {/* Any Professional Option Skeleton */}
          <div className="border-2 border-border rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Escolha seu profissional</h2>
          <div className="text-center py-8 text-destructive">
            <p>Erro ao carregar profissionais. Tente novamente.</p>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Escolha seu profissional</h2>
        
        {/* Any Professional Option */}
        <div
          className="barber-card border-2 border-accent bg-accent/5 rounded-lg p-4 mb-4 cursor-pointer transition-all duration-200"
          onClick={() => onProfessionalSelect("any")}
          data-testid="professional-any"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <Users className="text-accent text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">Qualquer Profissional</h3>
              <p className="text-muted-foreground">Primeiro horário disponível</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-sm text-accent font-medium">Mais rápido</span>
              </div>
            </div>
            <div className="text-accent">
              <i className="fas fa-check-circle text-xl"></i>
            </div>
          </div>
        </div>

        {professionals && professionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="barber-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => onProfessionalSelect(professional)}
                data-testid={`professional-${professional.id}`}
              >
                <div className="flex items-center space-x-4">
                  {professional.user.profileImageUrl ? (
                    <img
                      src={professional.user.profileImageUrl}
                      alt={`${professional.user.firstName} ${professional.user.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                      <User className="text-white text-xl" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">
                      {professional.user.firstName} {professional.user.lastName}
                    </h3>
                    <p className="text-muted-foreground">
                      {professional.specialties || "Especialista em diversos serviços"}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {professional.rating && parseFloat(professional.rating) > 0 ? (
                        <>
                          <div className="flex items-center">
                            <Star className="text-yellow-400 text-sm fill-current" />
                            <span className="text-sm ml-1">{parseFloat(professional.rating).toFixed(1)}</span>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            ({professional.totalReviews || 0} avaliações)
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm">Novo profissional</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum profissional disponível no momento.</p>
            <p className="text-sm mt-2">Tente a opção "Qualquer Profissional" acima.</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack} data-testid="button-back">
            Voltar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
