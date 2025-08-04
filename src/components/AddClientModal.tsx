import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import api from "@/services/api";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  onClientAdded?: () => void;
}

interface ClientFormData {
  name: string;
  email: string;
  phoneNumber: string;
  product: string;
  amount: string;
  active: boolean;
  lastPurchase: Date | undefined;
}

const AddClientModal = ({
  open,
  onOpenChange,
  userId,
  onClientAdded
}: AddClientModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    product: "",
    amount: "",
    active: true,
    lastPurchase: undefined
  });

  const handleInputChange = (
    field: keyof ClientFormData,
    value: string | boolean | Date | undefined
  ) => setFormData(prev => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast({ title: "Telefone é obrigatório", variant: "destructive" });
      return false;
    }
    if (!formData.amount.trim()) {
      toast({ title: "Valor é obrigatório", variant: "destructive" });
      return false;
    }
    const amountValue = parseFloat(formData.amount.replace(",", "."));
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({ title: "Valor inválido", variant: "destructive" });
      return false;
    }
    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      toast({ title: "Email inválido", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phoneNumber: formData.phoneNumber.trim(),
        product: formData.product.trim() || null,
        amount: parseFloat(formData.amount.replace(",", ".")),
        active: formData.active,
        lastPurchase: formData.lastPurchase
          ? format(formData.lastPurchase, "yyyy-MM-dd")
          : null,
        user_id: userId
      };

      await api.post("/client/create", payload);        // ← rota atualizada

      toast({
        title: "Cliente criado",
        description: `Cliente ${formData.name} adicionado com sucesso.`
      });

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        product: "",
        amount: "",
        active: true,
        lastPurchase: undefined
      });
      onOpenChange(false);
      onClientAdded?.();
    } catch {
      toast({
        title: "Erro ao criar cliente",
        description: "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={e => handleInputChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              value={formData.phoneNumber}
              onChange={e => handleInputChange("phoneNumber", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product">Produto</Label>
            <Input
              id="product"
              placeholder="Produto/serviço adquirido"
              value={formData.product}
              onChange={e => handleInputChange("product", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Valor *</Label>
            <Input
              id="amount"
              placeholder="0,00"
              value={formData.amount}
              onChange={e => handleInputChange("amount", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label>Data da Última Compra</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.lastPurchase && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.lastPurchase
                    ? format(formData.lastPurchase, "PPP", { locale: ptBR })
                    : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.lastPurchase}
                  onSelect={d => handleInputChange("lastPurchase", d)}
                  initialFocus
                  locale={ptBR}
                  disabled={d => d > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={checked => handleInputChange("active", checked)}
              disabled={loading}
            />
            <Label htmlFor="active">Cliente ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
