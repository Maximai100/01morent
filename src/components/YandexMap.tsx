import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export const YandexMap = () => {
  return (
    <Card className="p-8 shadow-gentle">
      <div className="flex items-center gap-4 mb-6">
        <MapPin className="w-8 h-8 text-primary" />
        <div>
          <h3 className="text-2xl font-bold font-playfair text-primary uppercase">МЕСТОПОЛОЖЕНИЕ</h3>
          <p className="text-muted-foreground">Нагорный тупик 13 корпус Б, Сочи</p>
        </div>
      </div>
      
      <div 
        className="rounded-xl overflow-hidden shadow-gentle cursor-pointer hover:shadow-ocean transition-shadow"
        onClick={() => {
          const address = encodeURIComponent("Нагорный тупик 13 корпус Б, Сочи");
          window.open(`https://yandex.ru/maps/?text=${address}&rtext=~${address}&mode=routes`, '_blank');
        }}
      >
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A6bb5a4bdfd62d0b9b4cb5c6ca6b0fb4c93b9b8e3dae4e2ebb5dd1e03e7ef7c8a&amp;source=constructor&amp;ll=39.72722%2C43.600938&amp;z=16&amp;pt=39.72722%2C43.600938%2Cpm2rdm"
          width="100%"
          height="400"
          frameBorder="0"
          title="Карта MORENT - Нагорный тупик 13 корпус Б"
          className="w-full"
          loading="lazy"
        />
      </div>
      
      <div className="mt-4 p-4 bg-primary/5 rounded-xl">
        <p className="text-sm text-muted-foreground text-center mb-2">
          📍 <strong>Адрес:</strong> Нагорный тупик 13 корпус Б, Сочи
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Нажмите на карту, чтобы построить маршрут
        </p>
      </div>
    </Card>
  );
};