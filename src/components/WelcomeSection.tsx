import { Card } from "@/components/ui/card";
import { ImageIcon, ArrowLeft, ArrowRight } from "lucide-react";

export const WelcomeSection = () => {
  return (
    <Card className="p-8 shadow-gentle">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center border-b border-border pb-4">
        ДОБРО ПОЖАЛОВАТЬ!
      </h2>
      
      <div className="bg-muted rounded-lg p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
        <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg mb-4">
          поле для фотографий которые
        </p>
        <p className="text-muted-foreground text-lg mb-6">
          добавляются в админ панели
        </p>
        <p className="text-muted-foreground text-lg">
          управления
        </p>
        
        <div className="flex items-center gap-8 mt-8">
          <ArrowLeft className="w-8 h-8 text-muted-foreground" />
          <ArrowRight className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
};