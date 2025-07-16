import { useSearchParams } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { WelcomeSection } from "@/components/WelcomeSection";
import { ApartmentInfo } from "@/components/ApartmentInfo";
import { ContactsSection } from "@/components/ContactsSection";
import { ApartmentFAQ } from "@/components/ApartmentFAQ";
import { LoyaltySection } from "@/components/LoyaltySection";

const CheckinGuide = () => {
  const [searchParams] = useSearchParams();
  
  // Get data from URL parameters
  const guestData = {
    apartmentNumber: searchParams.get('apartment') || '169',
    checkIn: searchParams.get('checkin') || '08.06.2025 в 15:00',
    checkOut: searchParams.get('checkout') || '09.06.2025 в 12:00',
    entranceCode: searchParams.get('entrance') || '#2020',
    electronicLockCode: searchParams.get('lock') || '1111',
    wifiPassword: searchParams.get('wifi') || 'логин/пароль'
  };

  return (
    <div className="min-h-screen bg-gradient-wave">
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <HeroSection apartmentNumber={guestData.apartmentNumber} />
        <WelcomeSection />
        <ApartmentInfo {...guestData} />
        <ContactsSection />
        <ApartmentFAQ />
        <LoyaltySection />
      </div>
    </div>
  );
};

export default CheckinGuide;