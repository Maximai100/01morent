import { Card } from "@/components/ui/card";
import { MediaDisplay } from "@/components/MediaDisplay";

export const WelcomeSection = () => {
  return (
    <Card className="p-8 shadow-gentle">
      <h2 className="text-3xl font-bold font-playfair text-primary mb-6 text-center border-b border-border pb-4 uppercase">
        ДОБРО ПОЖАЛОВАТЬ!
      </h2>
      
      <MediaDisplay 
        category="welcome_photos" 
        fallbackText="Фотографии добавляются через панель администратора"
        className="min-h-[300px]"
      />
    </Card>
  );
};