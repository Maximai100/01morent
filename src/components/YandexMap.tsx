import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

export const YandexMap = () => {
  return (
    <Card className="stagger-item p-8 shadow-premium hover-lift overflow-hidden">
      <div className="flex items-center gap-4 mb-6">
        <MapPin className="w-8 h-8 text-gold" />
        <div>
          <h3 className="uppercase text-gradient">МЕСТОПОЛОЖЕНИЕ</h3>
          <p className="text-muted-foreground leading-relaxed">Нагорный тупик 13 корпус Б, Сочи</p>
        </div>
      </div>
      
      <div 
        className="group rounded-xl overflow-hidden shadow-gentle cursor-pointer hover:shadow-premium transition-all duration-300 hover-lift border-2 border-primary/20 hover:border-gold/40"
        onClick={() => {
          const address = encodeURIComponent("Нагорный тупик 13 корпус Б, Сочи");
          window.open(`https://yandex.ru/maps/?text=${address}&rtext=~${address}&mode=routes`, '_blank');
        }}
      >
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A6bb5a4bdfd62d0b9b4cb5c6ca6b0fb4c93b9b8e3dae4e2ebb5dd1e03e7ef7c8a&amp;source=constructor&amp;ll=39.931606%2C43.416658&amp;z=16&amp;pt=39.931606%2C43.416658%2Cpm2rdm"
          width="100%"
          height="400"
          frameBorder="0"
          title="Карта MORENT - Нагорный тупик 13 корпус Б"
          className="w-full"
          loading="lazy"
        />
      </div>
      
      <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-gold/5 rounded-xl border border-gold/20">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Navigation className="w-5 h-5 text-gold" />
          <p className="text-base text-primary-dark font-semibold text-center">
            Нагорный тупик 13 корпус Б, Сочи
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          Нажмите на карту, чтобы построить маршрут в Яндекс.Картах
        </p>
      </div>
    </Card>
  );
};