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
          window.open(`https://yandex.ru/maps/?text=${address}&rtext=~${address}`, '_blank');
        }}
      >
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A26dd2f36ad02e13ebb3ae6e93949b79c92ab0cc2c4c1c5b1e2bb0b4a3c5ac0cb&amp;source=constructor"
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