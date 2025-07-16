import { Card } from "@/components/ui/card";
import { MediaDisplay } from "@/components/MediaDisplay";

export const WelcomeSection = () => {
  return (
    <Card className="shadow-premium animate-fade-in">
      <h2 className="text-4xl font-bold font-playfair text-gradient mb-8 text-center border-b-2 border-gradient-ocean pb-6 uppercase tracking-wide">
        ДОБРО ПОЖАЛОВАТЬ!
      </h2>
      
      <MediaDisplay 
        category="welcome_photos" 
        fallbackText="Фотографии добавляются через панель администратора"
        className="min-h-[400px] hover-lift"
        horizontal={true}
      />
    </Card>
  );
};