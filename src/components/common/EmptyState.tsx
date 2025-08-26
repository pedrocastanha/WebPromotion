import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {Icon && (
          <div className="mb-4 rounded-full bg-muted p-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        
        {description && (
          <p className="mb-4 text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
        
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Variações específicas do EmptyState
export function NoDataFound({ 
  onRefresh, 
  className = '' 
}: { 
  onRefresh?: () => void; 
  className?: string; 
}) {
  return (
    <EmptyState
      title="Nenhum dado encontrado"
      description="Não há informações para exibir no momento."
      action={onRefresh ? {
        label: 'Atualizar',
        onClick: onRefresh,
        variant: 'outline'
      } : undefined}
      className={className}
    />
  );
}

export function NoSearchResults({ 
  searchTerm, 
  onClearSearch,
  className = '' 
}: { 
  searchTerm: string; 
  onClearSearch: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`}
      action={{
        label: 'Limpar busca',
        onClick: onClearSearch,
        variant: 'outline'
      }}
      className={className}
    />
  );
}

