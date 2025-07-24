import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Key, 
  Webhook, 
  Save,
  Eye,
  EyeOff
} from "lucide-react";

const Settings = () => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Carregar configurações salvas do localStorage
  useState(() => {
    const savedOpenaiKey = localStorage.getItem("openaiKey");
    const savedWebhookUrl = localStorage.getItem("webhookUrl");
    
    if (savedOpenaiKey) setOpenaiKey(savedOpenaiKey);
    if (savedWebhookUrl) setWebhookUrl(savedWebhookUrl);
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Salvar no localStorage
      if (openaiKey.trim()) {
        localStorage.setItem("openaiKey", openaiKey);
      }
      if (webhookUrl.trim()) {
        localStorage.setItem("webhookUrl", webhookUrl);
      }

      toast({
        title: "Configurações salvas!",
        description: "Suas configurações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure suas integrações e preferências do sistema
        </p>
      </div>

      {/* API Configuration */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuração da API OpenAI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="openai-key">Chave da API OpenAI</Label>
            <div className="relative">
              <Input
                id="openai-key"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Necessária para gerar mensagens promocionais com IA. Você pode obter sua chave em{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-glow"
              >
                platform.openai.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Configuração do Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook-url">URL do Webhook (n8n ou outros)</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://seu-webhook.n8n.cloud/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL do webhook para onde as campanhas serão enviadas. Configure seu fluxo no n8n ou outro serviço de automação.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card className="gradient-card">
        <CardContent className="pt-6">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="gradient-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Ajuda com Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Como configurar o OpenAI:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Acesse platform.openai.com e faça login</li>
              <li>Vá para a seção "API Keys"</li>
              <li>Clique em "Create new secret key"</li>
              <li>Copie a chave e cole no campo acima</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Como configurar o Webhook:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Crie um workflow no n8n ou outro serviço</li>
              <li>Adicione um trigger de webhook</li>
              <li>Copie a URL do webhook</li>
              <li>Cole a URL no campo acima</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;