import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Gift, MessageCircle } from "lucide-react";

export const LoyaltySection = () => {
  return (
    <Card className="p-8 shadow-coral bg-gradient-to-br from-accent/5 to-secondary/20">
      <h3 className="text-xl font-bold text-primary mb-6 text-center">
        Для постоянных клиентов
      </h3>
      
      <div className="space-y-4 text-center text-foreground mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-accent" />
          <p>Мы будем благодарны вам за подписку</p>
        </div>
        <p>на телеграм @morent.sochi</p>
        <p>на инстаграм @morent.sochi</p>
      </div>

      <div className="bg-muted rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="w-6 h-6 text-accent" />
          <p className="text-foreground">просим оставить отзыв о нас на том сайте</p>
        </div>
        <p className="text-center text-foreground">где вы забронировали апартаменты</p>
      </div>

      <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <p className="text-foreground">Напишите нам на вотс апп</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-3 bg-white border-2 border-primary/30 hover:bg-primary/5"
        >
          <span className="font-bold text-primary">896298864-49</span>
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-3">
          И мы поможем вам забронировать апартаменты
        </p>
        <p className="text-center text-sm text-muted-foreground">
          в следующий раз
        </p>
      </div>
    </Card>
  );
};