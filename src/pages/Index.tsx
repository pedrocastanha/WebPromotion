import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Users, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full gradient-primary animate-float glow">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            CampanhasPro
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Crie campanhas promocionais inteligentes com IA e envie para seus clientes de forma automatizada
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Começar Agora
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Recursos Poderosos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="gradient-card border-border/50 hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="p-3 rounded-lg gradient-primary w-fit">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>IA Inteligente</CardTitle>
                <CardDescription>
                  Transforme descrições simples em mensagens promocionais atraentes usando GPT-4
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card border-border/50 hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="p-3 rounded-lg gradient-primary w-fit">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Segmentação Avançada</CardTitle>
                <CardDescription>
                  Filtre clientes por data da última compra, tipo de produto ou envie para todos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card border-border/50 hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="p-3 rounded-lg gradient-primary w-fit">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Automação Completa</CardTitle>
                <CardDescription>
                  Integre com n8n e outros webhooks para disparar campanhas automaticamente
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="gradient-card border-border/50 p-8">
            <CardContent className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para Revolucionar suas Campanhas?
              </h2>
              <p className="text-xl text-muted-foreground">
                Comece gratuitamente e veja como a IA pode transformar sua comunicação com clientes
              </p>
              <Link to="/register">
                <Button variant="gradient" size="xl">
                  Criar Conta Gratuita
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
