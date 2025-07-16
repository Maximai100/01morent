import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Key, Wifi } from "lucide-react";

interface ApartmentInfoProps {
  apartmentNumber?: string;
  checkIn?: string;
  checkOut?: string;
  entranceCode?: string;
  electronicLockCode?: string;
  wifiPassword?: string;
}

export const ApartmentInfo = ({
  apartmentNumber = "169",
  checkIn = "08.06.2025 в 15:00",
  checkOut = "09.06.2025 в 12:00",
  entranceCode = "#2020",
  electronicLockCode = "1111",
  wifiPassword = "логин/пароль"
}: ApartmentInfoProps) => {
  return (
    <Card className="p-8 shadow-gentle space-y-6">
      {/* Apartment Details */}
      <Card className="p-6 bg-muted border-2 border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">
              Ваши апартаменты
            </h3>
            <p className="text-foreground">г. Сочи, пгт Сириус</p>
            <p className="text-foreground">ул. Нагорный тупик 13Б</p>
          </div>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/30">
          <p className="text-center font-bold text-primary text-lg">
            2-й подъезд 10 этаж
          </p>
          <p className="text-center font-bold text-primary text-xl">
            Апартаменты {apartmentNumber}
          </p>
        </div>
      </Card>

      {/* Check-in Dates */}
      <Card className="p-6 bg-muted border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-lg text-primary">
            Даты бронирования
          </h3>
        </div>
        <div className="space-y-2">
          <p className="text-foreground">
            <span className="font-medium">Заезд:</span> {checkIn}
          </p>
          <p className="text-foreground">
            <span className="font-medium">Выезд:</span> {checkOut}
          </p>
        </div>
      </Card>

      {/* Access Codes */}
      <Card className="p-6 bg-muted border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-lg text-primary">
            Важные коды доступа:
          </h3>
        </div>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start text-left h-auto p-4 bg-white border-2 border-primary/30"
          >
            <div>
              <p className="font-medium">Код от подъезда</p>
              <p className="text-xl font-bold text-primary">{entranceCode}</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-left h-auto p-4 bg-white border-2 border-primary/30"
          >
            <div>
              <p className="font-medium">Код от электронного замка</p>
              <p className="text-xl font-bold text-primary">{electronicLockCode}</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-left h-auto p-4 bg-white border-2 border-primary/30"
          >
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">Wi-Fi</p>
                <p className="text-sm font-semibold text-primary break-all">{wifiPassword}</p>
              </div>
            </div>
          </Button>
        </div>
      </Card>
    </Card>
  );
};