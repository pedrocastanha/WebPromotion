import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Download, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";                            

interface ImportClientsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  onClientsImported?: () => void;
}

const ImportClientsModal = ({
  open,
  onOpenChange,
  userId,
  onClientsImported
}: ImportClientsModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredColumns = [
    "Nome ou Cliente (nome)",
    "Telefone ou Celular (telefone)",
    "Produto (produto)",
    "Valor ou Preco (valor)",
    "DataCompra ou UltimaCompra (última compra - formato: dd/MM/yyyy)",
    "Email (opcional)"
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) setSelectedFile(file);
    }
  };

  const validateFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({ title: "Arquivo inválido", description: "Selecione um CSV.", variant: "destructive" });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 10 MB.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const downloadTemplate = () => {
    const csv = "name,email,phoneNumber,product,amount,lastPurchase\n" +
                "João Silva,joao@email.com,11999991234,Eletrônicos,1245.00,15/01/2024\n" +
                "Maria Santos,maria@email.com,5511888885678,Roupas,589.00,20/01/2024";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_clientes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({ title: "Nenhum arquivo selecionado", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", String(userId));

      await api.post("/client/import-clients", formData, {       
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast({
        title: "Importação realizada",
        description: `Clientes do arquivo ${selectedFile.name} foram importados.`
      });

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onOpenChange(false);
      onClientsImported?.();
    } catch (err: any) {
      toast({
        title: "Erro na importação",
        description: err?.response?.data || "Falha ao importar.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Clientes via CSV</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV com os dados dos clientes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Formato obrigatório:</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                {requiredColumns.map((c, i) => (
                  <li key={i} className="text-sm">{c}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Baixar Template CSV
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Arquivo CSV</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Arraste e solte seu arquivo CSV aqui</p>
                  <p className="text-xs text-muted-foreground">ou clique para selecionar</p>
                  <p className="text-xs text-muted-foreground">Máximo 10 MB • .csv</p>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={removeFile} disabled={loading}>
                  Remover
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={loading || !selectedFile}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Importar Clientes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportClientsModal;
