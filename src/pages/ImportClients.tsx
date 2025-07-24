import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileSpreadsheet, 
  Users, 
  Download, 
  CheckCircle, 
  AlertCircle,
  FileText
} from "lucide-react";

const ImportClients = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [csvText, setCsvText] = useState("");
  const [importMethod, setImportMethod] = useState<"file" | "text">("file");
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo CSV válido.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !csvText.trim()) {
      toast({
        title: "Dados necessários",
        description: "Selecione um arquivo ou cole os dados CSV.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulação de upload com progresso
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Importação concluída!",
            description: `${importMethod === "file" ? selectedFile?.name : "Dados CSV"} foram importados com sucesso.`,
          });
          // Reset
          setSelectedFile(null);
          setCsvText("");
          setUploadProgress(0);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    const csvContent = `nome,email,telefone,ultima_compra,tipo_produto,valor_total,status
João Silva,joao@email.com,(11) 99999-1234,2024-01-15,Eletrônicos,1245.00,Ativo
Maria Santos,maria@email.com,(11) 88888-5678,2024-01-20,Roupas,589.00,Ativo`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_clientes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Importar Clientes</h1>
        <p className="text-muted-foreground">
          Importe clientes em massa usando arquivo CSV ou texto
        </p>
      </div>

      {/* Template Download */}
      <Card className="gradient-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Template CSV
          </CardTitle>
          <CardDescription>
            Baixe o template para ver o formato correto dos dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Campos obrigatórios: nome, email, telefone, ultima_compra, tipo_produto, valor_total, status
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-accent/20 text-accent">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  nome
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-accent/20 text-accent">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  email
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-accent/20 text-accent">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  telefone
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                  ultima_compra
                </span>
              </div>
            </div>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4" />
              Baixar Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card className={`gradient-card cursor-pointer transition-colors ${importMethod === "file" ? "border-primary" : ""}`}>
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2"
              onClick={() => setImportMethod("file")}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={importMethod === "file"}
                  onChange={() => setImportMethod("file")}
                  className="text-primary"
                />
                <FileSpreadsheet className="h-5 w-5" />
                Upload de Arquivo CSV
              </div>
            </CardTitle>
            <CardDescription>
              Selecione um arquivo CSV do seu computador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div>
                <Label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary-glow">
                  Clique para selecionar arquivo
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Apenas arquivos .csv são aceitos
                </p>
              </div>
            </div>
            
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Text Input */}
        <Card className={`gradient-card cursor-pointer transition-colors ${importMethod === "text" ? "border-primary" : ""}`}>
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2"
              onClick={() => setImportMethod("text")}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={importMethod === "text"}
                  onChange={() => setImportMethod("text")}
                  className="text-primary"
                />
                <FileText className="h-5 w-5" />
                Colar Dados CSV
              </div>
            </CardTitle>
            <CardDescription>
              Cole diretamente o conteúdo CSV no campo abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="csv-text">Dados CSV</Label>
              <Textarea
                id="csv-text"
                placeholder="nome,email,telefone,ultima_compra,tipo_produto,valor_total,status
João Silva,joao@email.com,(11) 99999-1234,2024-01-15,Eletrônicos,1245.00,Ativo"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Importando clientes...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Progresso: {uploadProgress}% concluído
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Guidelines */}
      <Card className="gradient-card border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Diretrizes de Importação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              O arquivo deve estar no formato CSV com separador vírgula (,)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              A primeira linha deve conter os nomes das colunas (cabeçalho)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              Emails devem ser únicos - clientes duplicados serão ignorados
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              Datas devem estar no formato AAAA-MM-DD (ex: 2024-01-15)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              Status deve ser "Ativo" ou "Inativo"
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Import Button */}
      <Card className="gradient-card">
        <CardContent className="pt-6">
          <Button 
            onClick={handleUpload}
            disabled={isUploading || (!selectedFile && !csvText.trim())}
            variant="gradient"
            size="xl"
            className="w-full"
          >
            <Upload className="h-5 w-5" />
            {isUploading ? "Importando..." : "Importar Clientes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportClients;