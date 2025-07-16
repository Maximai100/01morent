import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const LoyaltySection = () => {
  return (
    <Card className="p-8 shadow-coral bg-gradient-to-br from-accent/5 to-secondary/20">
      <h3 className="text-xl font-bold text-primary mb-6 text-center">
        💛 ДЛЯ НАШИХ ПОСТОЯННЫХ ГОСТЕЙ
      </h3>
      
      <div className="space-y-4 text-left text-foreground mb-6">
        <p>Если вам было комфортно с нами, поддержите Morent — это очень помогает нам развиваться:</p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span>🔹</span>
            <div>
              Подпишитесь на{" "}
              <a 
                href="https://t.me/morentsochi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Telegram @morent.sochi
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span>🔹</span>
            <div>
              Подпишитесь на{" "}
              <a 
                href="https://instagram.com/morent.sochi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Instagram @morent.sochi
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span>🔹</span>
            <p>Оставьте, пожалуйста, отзыв на сайте, где вы бронировали апартаменты — это важно для нас.</p>
          </div>
        </div>
        
        <p className="text-center text-foreground font-medium mt-4">
          Спасибо, что выбираете нас снова 💫
        </p>
      </div>

      <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl">📲</span>
          <p className="text-foreground font-semibold">Напишите нам в WhatsApp</p>
        </div>
        <a 
          href="https://wa.me/79628886449" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            variant="outline" 
            className="w-full bg-white border-2 border-primary/30 hover:bg-primary/5 flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">+7 (962) 988-64-49</span>
          </Button>
        </a>
        <div className="text-center text-sm text-muted-foreground mt-4 space-y-1">
          <p>Мы с радостью поможем вам подобрать и забронировать апартаменты в следующий раз.</p>
          <p className="font-medium">Всегда на связи и готовы помочь!</p>
        </div>
      </div>
    </Card>
  );
};