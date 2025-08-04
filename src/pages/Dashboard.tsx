import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Wand2, 
  Users, 
  Calendar, 
  ShoppingBag, 
  MessageSquare,
  Filter,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const [messageInput, setMessageInput] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [lastPurchaseDate, setLastPurchaseDate] = useState("");
  const [productType, setProductType] = useState("");
  const [messageApproved, setMessageApproved] = useState(false);
  
  const { toast } = useToast();

  const getOpenaiKey = () => localStorage.getItem("openaiKey") || "";
  const getWebhookUrl = () => localStorage.getItem("webhookUrl") || "";

  const generateMessage = async () => {
    if (!messageInput.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite uma descrição da promoção primeiro.",
        variant: "destructive",
      });
      return;
    }

    const openaiKey = getOpenaiKey();
    if (!openaiKey.trim()) {
      toast({
        title: "Chave da API necessária",
        description: "Configure sua chave da OpenAI nas configurações.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em marketing digital. Transforme descrições simples de promoções em mensagens atraentes e persuasivas para campanhas promocionais. Use linguagem envolvente, crie senso de urgência quando apropriado, e inclua calls-to-action. Mantenha o tom profissional mas acessível.'
            },
            {
              role: 'user',
              content: `Transforme esta descrição em uma mensagem promocional atraente: "${messageInput}"`
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na API da OpenAI');
      }

      const data = await response.json();
      const generated = data.choices[0].message.content;
      
      setGeneratedMessage(generated);
      setMessageApproved(false);
      
      toast({
        title: "Mensagem gerada!",
        description: "Sua mensagem promocional foi criada com IA.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar mensagem",
        description: "Verifique sua chave da API e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendCampaign = async () => {
    if (!messageApproved) {
      toast({
        title: "Mensagem não aprovada",
        description: "Aprove a mensagem antes de enviar a campanha.",
        variant: "destructive",
      });
      return;
    }

    const webhookUrl = getWebhookUrl();
    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook não configurado",
        description: "Configure a URL do webhook nas configurações.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const campaignData = {
        message: generatedMessage,
        filter: selectedFilter,
        lastPurchaseDate: lastPurchaseDate,
        productType: productType,
        timestamp: new Date().toISOString(),
        userEmail: localStorage.getItem("userEmail") || "",
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(campaignData),
      });

      toast({
        title: "Campanha enviada!",
        description: "Sua campanha promocional foi disparada com sucesso.",
      });

      // Reset form
      setMessageInput("");
      setGeneratedMessage("");
      setMessageApproved(false);
      setSelectedFilter("all");
      setLastPurchaseDate("");
      setProductType("");

    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar a campanha. Verifique o webhook.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Campanhas Promocionais</h1>
        <p className="text-muted-foreground">
          Crie e envie campanhas inteligentes com IA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Message Creation */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Criar Mensagem Promocional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message-input">Descreva sua promoção</Label>
              <Textarea
                id="message-input"
                placeholder="Ex: Desconto de 30% em todos os produtos da loja hoje das 9h às 18h"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                rows={3}
              />
            </div>
            
            <Button 
              onClick={generateMessage}
              disabled={isGenerating}
              variant="gradient"
              className="w-full"
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "Gerando..." : "Gerar Mensagem com IA"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Message Review */}
      {generatedMessage && (
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Revisar Mensagem Gerada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="whitespace-pre-wrap">{generatedMessage}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="approve-message"
                checked={messageApproved}
                onCheckedChange={(checked) => setMessageApproved(checked as boolean)}
              />
              <Label htmlFor="approve-message">
                Aprovar esta mensagem para envio
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audience Selection */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Seleção de Público
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Filtro de Clientes</Label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Todos os clientes
                    </div>
                  </SelectItem>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Por data da última compra
                    </div>
                  </SelectItem>
                  <SelectItem value="product">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Por tipo de produto
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedFilter === "recent" && (
              <div>
                <Label htmlFor="last-purchase">Última compra após</Label>
                <Input
                  id="last-purchase"
                  type="date"
                  value={lastPurchaseDate}
                  onChange={(e) => setLastPurchaseDate(e.target.value)}
                />
              </div>
            )}

            {selectedFilter === "product" && (
              <div>
                <Label>Tipo de Produto</Label>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roupas">Roupas</SelectItem>
                    <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                    <SelectItem value="casa">Casa e Decoração</SelectItem>
                    <SelectItem value="beleza">Beleza e Cuidados</SelectItem>
                    <SelectItem value="esportes">Esportes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Send Campaign */}
      <Card className="gradient-card">
        <CardContent className="pt-6">
          <Button 
            onClick={sendCampaign}
            disabled={!messageApproved || isSending}
            variant="success"
            size="xl"
            className="w-full"
          >
            <Send className="h-5 w-5" />
            {isSending ? "Enviando Campanha..." : "Enviar Campanha"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;