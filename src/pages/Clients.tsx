import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Filter, Calendar, ShoppingBag, Edit, Trash2, Users } from "lucide-react";

// Dados simulados de clientes
const mockClients = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-1234",
    ultimaCompra: "2024-01-15",
    tipoUltimoProuto: "Eletrônicos",
    valorTotal: "R$ 1.245,00",
    status: "Ativo"
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@email.com",
    telefone: "(11) 88888-5678",
    ultimaCompra: "2024-01-20",
    tipoUltimoProuto: "Roupas",
    valorTotal: "R$ 589,00",
    status: "Ativo"
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro@email.com",
    telefone: "(11) 77777-9012",
    ultimaCompra: "2023-12-10",
    tipoUltimoProuto: "Casa",
    valorTotal: "R$ 2.150,00",
    status: "Inativo"
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    email: "ana@email.com",
    telefone: "(11) 66666-3456",
    ultimaCompra: "2024-01-22",
    tipoUltimoProuto: "Beleza",
    valorTotal: "R$ 320,00",
    status: "Ativo"
  },
  {
    id: 5,
    nome: "Carlos Ferreira",
    email: "carlos@email.com",
    telefone: "(11) 55555-7890",
    ultimaCompra: "2024-01-18",
    tipoUltimoProuto: "Esportes",
    valorTotal: "R$ 890,00",
    status: "Ativo"
  }
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         client.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (clientId: number) => {
    toast({
      title: "Editar Cliente",
      description: `Funcionalidade de edição para cliente ID: ${clientId}`,
    });
  };

  const handleDelete = (clientId: number) => {
    toast({
      title: "Excluir Cliente",
      description: `Cliente ID: ${clientId} seria excluído`,
      variant: "destructive",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground";
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case "Eletrônicos":
        return "💻";
      case "Roupas":
        return "👕";
      case "Casa":
        return "🏠";
      case "Beleza":
        return "💄";
      case "Esportes":
        return "⚽";
      default:
        return "📦";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes Cadastrados</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize todos os seus clientes
          </p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar clientes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome ou email do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <Label>Status</Label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Clientes ({filteredClients.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead>Último Produto</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.nome}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{client.telefone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(client.ultimaCompra).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getProductTypeIcon(client.tipoUltimoProuto)}</span>
                        {client.tipoUltimoProuto}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{client.valorTotal}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou importe novos clientes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;