import { Card } from "@/components/ui/card";
import { MediaDisplay } from "@/components/MediaDisplay";
import { WaveDivider } from "@/components/WaveDivider";

export const WelcomeSection = () => {
  return (
    <>
      <Card className="shadow-premium hover-lift overflow-hidden">
        <div className="p-8 pb-4">
          <h2 className="text-gradient mb-8 text-center uppercase tracking-wide">
            ДОБРО ПОЖАЛОВАТЬ!
          </h2>
        </div>
        
        <MediaDisplay 
          category="welcome_photos" 
          fallbackText="Фотографии добавляются через панель администратора"
          className="min-h-[400px] px-8 pb-8"
          horizontal={true}
        />
      </Card>
      <WaveDivider variant="subtle" />
    </>
  );
};