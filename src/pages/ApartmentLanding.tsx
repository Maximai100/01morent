import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { WelcomeSection } from "@/components/WelcomeSection";
import { ApartmentInfo } from "@/components/ApartmentInfo";
import { MediaDisplay } from "@/components/MediaDisplay";
import { ApartmentFAQ } from "@/components/ApartmentFAQ";
import { ContactsSection } from "@/components/ContactsSection";
import { LoyaltySection } from "@/components/LoyaltySection";
import { YandexMap } from "@/components/YandexMap";
import { WaveDivider } from "@/components/WaveDivider";
import { useDirectusApartments } from "@/hooks/useDirectus";
import { DirectusApartment } from "@/integrations/directus/client";

// Используем DirectusApartment вместо кастомного интерфейса

const ApartmentLanding = () => {
  const { apartmentId } = useParams();
  const { getApartmentById } = useDirectusApartments();
  const [apartment, setApartment] = useState<DirectusApartment | null>(null);
  const [loading, setLoading] = useState(true);

  // Получаем параметры из URL для персонализации
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('guest') || '';
  const checkInDate = urlParams.get('checkin') || '';
  const checkOutDate = urlParams.get('checkout') || '';

  useEffect(() => {
    if (apartmentId) {
      loadApartment();
    }
  }, [apartmentId]);

  const loadApartment = async () => {
    if (!apartmentId) return;

    try {
      const data = await getApartmentById(apartmentId);
      if (data) {
        setApartment(data);
      }
    } catch (error) {
      console.error('Error loading apartment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-wave flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="min-h-screen bg-gradient-wave flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Апартамент не найден</h1>
          <p className="text-muted-foreground">Проверьте правильность ссылки</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-wave">
      <HeroSection 
        title={apartment.title}
        subtitle={`Апартаменты ${apartment.apartment_number}${apartment.building_number}`}
      />
      
      <WelcomeSection 
        guestName={guestName}
        checkInDate={checkInDate}
      />
      
      <WaveDivider />
      
      <ApartmentInfo
        apartmentNumber={`${apartment.apartment_number}${apartment.building_number}`}
        checkIn={checkInDate}
        checkOut={checkOutDate}
        entranceCode={apartment.code_building || ''}
        electronicLockCode={apartment.code_lock || ''}
        wifiPassword={apartment.wifi_password || ''}
      />
      
      <WaveDivider />
      
      <div className="space-y-8">
        <MediaDisplay apartmentId={apartment.id} category="photos" fallbackText="Фотографии скоро появятся" />
        
        {/* Видео подъезда */}
        <div className="stagger-item">
          <h3 className="mb-6 uppercase text-left text-gradient">ВИДЕО ПОДЪЕЗДА</h3>
          <MediaDisplay apartmentId={apartment.id} category="entrance" fallbackText="Видео подъезда скоро появится" />
        </div>
        
        {/* Видео электронного замка */}
        <div className="stagger-item">
          <h3 className="mb-6 uppercase text-left text-gradient">ВИДЕО ЭЛЕКТРОННОГО ЗАМКА</h3>
          <MediaDisplay apartmentId={apartment.id} category="lock" fallbackText="Видео замка скоро появится" />
        </div>
      </div>
      
      <WaveDivider />
      
      <ApartmentFAQ faqs={[
        ...(apartment.faq_checkin ? [{
          question: "Информация о заселении",
          answer: apartment.faq_checkin
        }] : []),
        ...(apartment.faq_apartment ? [{
          question: "Информация об апартаментах",
          answer: apartment.faq_apartment
        }] : []),
        ...(apartment.faq_area ? [{
          question: "Информация о районе",
          answer: apartment.faq_area
        }] : [])
      ]} />
      
      <WaveDivider />
      
      <YandexMap 
        coordinates={{ lat: 43.585472, lng: 39.723098 }}
        address={apartment.base_address || ''}
      />
      
      <WaveDivider />
      
      <ContactsSection contactInfo={{
        phone: apartment.manager_phone || '88007005501',
        whatsapp: apartment.manager_phone || '88007005501',
        telegram: apartment.manager_phone || '88007005501'
      }} />
      
      <WaveDivider />
      
      <LoyaltySection info="Спасибо за выбор наших апартаментов!" />
    </div>
  );
};

export default ApartmentLanding;