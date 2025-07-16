import { Card } from "@/components/ui/card";
import { MediaDisplay } from "@/components/MediaDisplay";

export const WelcomeSection = () => {
  return (
    <Card className="p-8 shadow-gentle">
      <h2 className="text-3xl font-bold font-playfair text-primary mb-6 text-center border-b border-border pb-4 uppercase">
        ДОБРО ПОЖАЛОВАТЬ!
      </h2>
      
      <div className="overflow-x-auto">
        <MediaDisplay 
          category="welcome_photos" 
          fallbackText="Фотографии добавляются через панель администратора"
          className="min-h-[300px] flex gap-4 overflow-x-auto pb-4"
          horizontal={true}
        />
      </div>
    </Card>
  );
};