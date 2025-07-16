import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, FileText, Map } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-wave flex items-center justify-center p-4">
      <Card className="max-w-2xl mx-auto p-8 shadow-ocean text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4 tracking-wider">
            MORENT
          </h1>
          <div className="w-32 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-xl text-primary/80">
            Система управления инструкциями заселения
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/manager">
            <Button className="w-full h-32 bg-gradient-ocean shadow-ocean flex flex-col gap-3 hover:scale-105 transition-transform">
              <Settings className="w-12 h-12" />
              <div>
                <p className="text-lg font-bold">Панель менеджера</p>
                <p className="text-sm opacity-90">Создать инструкцию для гостя</p>
              </div>
            </Button>
          </Link>

          <Link to="/guide">
            <Button 
              variant="outline" 
              className="w-full h-32 border-2 border-primary/30 hover:bg-primary/5 flex flex-col gap-3 hover:scale-105 transition-transform"
            >
              <FileText className="w-12 h-12 text-primary" />
              <div>
                <p className="text-lg font-bold text-primary">Инструкция для гостя</p>
                <p className="text-sm text-muted-foreground">Демо-версия</p>
              </div>
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Map className="w-5 h-5 text-accent" />
            <p className="text-sm font-medium">Сочи • Апартаменты у моря</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Ваш дом у моря в любой момент!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Index;
