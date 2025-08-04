import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Filter, Calendar, Users, Edit, Trash2, Upload } from "lucide-react";
import AddClientModal from "@/components/AddClientModal.tsx";
import ImportClientsModal from "@/components/ImportClientsModal.tsx";
import { useAuth } from "@/contexts/AuthContext";

const mockClients = [
  { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-1234", ultimaCompra: "2024-01-15", tipoUltimoProuto: "Eletrônicos", valorTotal: "R$ 1.245,00", status: "Ativo" },
  { id: 2, nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 88888-5678", ultimaCompra: "2024-01-20", tipoUltimoProuto: "Roupas", valorTotal: "R$ 589,00", status: "Ativo" },
  { id: 3, nome: "Pedro Costa", email: "pedro@email.com", telefone: "(11) 77777-9012", ultimaCompra: "2023-12-10", tipoUltimoProuto: "Casa", valorTotal: "R$ 2.150,00", status: "Inativo" },
  { id: 4, nome: "Ana Oliveira", email: "ana@email.com", telefone: "(11) 66666-3456", ultimaCompra: "2024-01-22", tipoUltimoProuto: "Beleza", valorTotal: "R$ 320,00", status: "Ativo" },
  { id: 5, nome: "Carlos Ferreira", email: "carlos@email.com", telefone: "(11) 55555-7890", ultimaCompra: "2024-01-18", tipoUltimoProuto: "Esportes", valorTotal: "R$ 890,00", status: "Ativo" }
];

const Clients = () => {
  const { user, isLoading } = useAuth();
  const userId = user?.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [addClientModalOpen, setAddClientModalOpen] = useState(false);
  const [importClientsModalOpen, setImportClientsModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredClients = mockClients.filter(c => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = c.nome.toLowerCase().includes(s) || c.email.toLowerCase().includes(s);
    const matchesFilter = filterStatus === "all" || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleClientAdded = () => toast({ title: "Lista atualizada", description: "A lista de clientes foi atualizada com sucesso." });
  const handleClientsImported = () => toast({ title: "Importação concluída", description: "Os clientes foram importados e a lista foi atualizada." });
  const handleEdit = (id: number) => toast({ title: "Editar Cliente", description: `Funcionalidade de edição para cliente ID: ${id}` });
  const handleDelete = (id: number) => toast({ title: "Excluir Cliente", description: `Cliente ID: ${id} seria excluído`, variant: "destructive" });

  const getStatusColor = (status: string) => (status === "Ativo" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground");
  const getProductTypeIcon = (t: string) => (t === "Eletrônicos" ? "💻" : t === "Roupas" ? "👕" : t === "Casa" ? "🏠" : t === "Beleza" ? "💄" : t === "Esportes" ? "⚽" : "📦");

  if (isLoading || !userId) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes Cadastrados</h1>
          <p className="text-muted-foreground">Gerencie e visualize todos os seus clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportClientsModalOpen(true)}>
            <Upload className="h-4 w-4" />
            Importar CSV
          </Button>
          <Button variant="gradient" onClick={() => setAddClientModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

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
                <Input id="search" placeholder="Nome ou email do cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="md:w-48">
              <Label>Status</Label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full p-2 border border-input bg-background rounded-md text-sm">
                <option value="all">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes ({filteredClients.length})
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
                {filteredClients.map(c => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{c.nome}</div>
                      <div className="text-sm text-muted-foreground">{c.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">{c.telefone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(c.ultimaCompra).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getProductTypeIcon(c.tipoUltimoProuto)}</span>
                        {c.tipoUltimoProuto}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{c.valorTotal}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(c.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}>
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
              <p className="text-muted-foreground">Tente ajustar os filtros ou importe novos clientes.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddClientModal open={addClientModalOpen} onOpenChange={setAddClientModalOpen} userId={userId} onClientAdded={handleClientAdded} />
      <ImportClientsModal open={importClientsModalOpen} onOpenChange={setImportClientsModalOpen} userId={userId} onClientsImported={handleClientsImported} />
    </div>
  );
};

export default Clients;