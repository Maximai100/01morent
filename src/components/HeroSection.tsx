import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";
interface HeroSectionProps {
  apartmentNumber?: string;
}
export const HeroSection = ({
  apartmentNumber = "169"
}: HeroSectionProps) => {
  return <Card className="relative overflow-hidden border-0 shadow-ocean">
      <div className="relative h-[500px] bg-gradient-ocean">
        <img src={heroImage} alt="MORENT - Ваш дом у моря" loading="lazy" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary/60" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold font-playfair text-white tracking-wider mb-4 uppercase">
              MORENT
            </h1>
            {/* Wave line like in logo */}
            <svg className="w-48 h-3 mx-auto" viewBox="0 0 200 12" fill="none">
              <path d="M0 6C50 2, 150 10, 200 6" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
            Ваш дом у моря в любой момент!
          </p>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 px-8 py-6">
            <p className="text-white text-lg">ДОБРО ПОЖАЛОВАТЬ</p>
            <p className="text-white text-2xl font-bold">
              Апартаменты {apartmentNumber}
            </p>
          </Card>
        </div>
      </div>
    </Card>;
};