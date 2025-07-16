import { Card } from "@/components/ui/card";
import { Phone, MessageCircle, Instagram } from "lucide-react";
export const ContactsSection = () => {
  return <Card className="p-8 shadow-gentle space-y-6">
      {/* Contacts */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-bold text-lg text-primary mb-4">
          Контакты MORENT
        </h3>
        <div className="space-y-2 text-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>8 800 700 55 01</span>
          </div>
          <p>Поддержка 24/7</p>
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            <span>@morent.sochi</span>
          </div>
          <p>Подписывайтесь!</p>
        </div>
      </Card>

      {/* FAQ Settlement */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-6 my-0 mx-0 px-[9px]">ЗАСЕЛЕНИЕ</h3>
        
        <div className="flex items-center justify-center mb-6 rounded-md">
          <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">FAQ</span>
          </div>
          <div className="ml-4 text-left">
            <p className="text-foreground">Часто</p>
            <p className="text-foreground">встречающиеся</p>
            <p className="text-foreground">вопросы:</p>
          </div>
        </div>

        <div className="space-y-4 text-left">
          <Card className="p-4 bg-muted border-primary/20">
            <p className="text-sm text-foreground">
              <span className="font-medium">1.</span> Видео подъезда (загружается из админ панели)
            </p>
          </Card>
          <Card className="p-4 bg-muted border-primary/20">
            <p className="text-sm text-foreground">
              <span className="font-medium">2.</span> Видео электронного замка (загружается из админ панели)
            </p>
          </Card>
        </div>
      </div>
    </Card>;
};