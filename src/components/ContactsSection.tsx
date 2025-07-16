import { Card } from "@/components/ui/card";
import { Phone, MessageCircle, Instagram, Send } from "lucide-react";
import { MediaDisplay } from "@/components/MediaDisplay";
export const ContactsSection = () => {
  return <Card className="p-8 shadow-gentle space-y-6">
      {/* Contacts */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-bold text-lg text-primary mb-4">
          Контакты MORENT
        </h3>
        <div className="space-y-4 text-foreground">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <a href="tel:88007005501" className="text-lg font-medium hover:text-primary transition-colors">
              8 800 700 55 01
            </a>
          </div>
          <p className="text-sm text-muted-foreground ml-8">Поддержка 24/7</p>
          
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="https://instagram.com/morent.sochi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">@morent.sochi</span>
              </a>
              
              <a 
                href="https://t.me/morentsochi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
              >
                <Send className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Telegram</span>
              </a>
            </div>
            
            <a 
              href="https://wa.me/79628886449" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors w-fit"
            >
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          </div>
        </div>
      </Card>

      {/* FAQ Settlement */}
      <div>
        <h3 className="text-2xl font-bold text-primary mb-6 uppercase text-left">ЗАСЕЛЕНИЕ</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary">FAQ</span>
          </div>
          <div className="text-left">
            <p className="text-foreground text-lg font-medium">Часто встречающиеся вопросы</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-muted border-primary/20">
            <p className="text-sm text-foreground">
              <span className="font-medium">1.</span> Видео подъезда
            </p>
            <MediaDisplay 
              category="entrance_videos" 
              fallbackText="Видео подъезда (загружается из админ панели)"
              className="mt-3"
            />
          </Card>
          <Card className="p-4 bg-muted border-primary/20">
            <p className="text-sm text-foreground">
              <span className="font-medium">2.</span> Видео электронного замка
            </p>
            <MediaDisplay 
              category="lock_videos" 
              fallbackText="Видео электронного замка (загружается из админ панели)"
              className="mt-3"
            />
          </Card>
        </div>
      </div>
    </Card>;
};