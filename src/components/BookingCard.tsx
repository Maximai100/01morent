import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { DirectusBooking } from "@/integrations/directus/client";
import { toast } from "sonner";

interface BookingCardProps {
  booking: DirectusBooking;
  onEdit: (booking: DirectusBooking) => void;
  onDelete: (bookingId: string) => void;
  apartmentNumber?: string;
  apartmentBuilding?: string;
}

export const BookingCard = ({ 
  booking, 
  onEdit, 
  onDelete, 
  apartmentNumber, 
  apartmentBuilding 
}: BookingCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Дата не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const generateGuestLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      guest: booking.guest_name,
      apartment: `${apartmentNumber || ''}${apartmentBuilding || ''}`
    });
    
    if (booking.checkin_date) {
      params.append('checkin', booking.checkin_date);
    }
    if (booking.checkout_date) {
      params.append('checkout', booking.checkout_date);
    }
    
    return `${baseUrl}/apartment/${booking.apartment_id}?${params.toString()}`;
  };

  const copyGuestLink = async () => {
    const link = generateGuestLink();
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Ссылка скопирована в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования ссылки');
    }
  };

  const openGuestLink = () => {
    const link = generateGuestLink();
    window.open(link, '_blank');
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-accent">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              {booking.guest_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(booking.checkin_date)} - {formatDate(booking.checkout_date)}
              </span>
              <Badge variant="secondary" className="text-xs">
                ID: {booking.slug}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(booking)}
              className="flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Редактировать
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyGuestLink}
              className="flex items-center gap-1"
            >
              <Copy className="w-4 h-4" />
              Копировать ссылку
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={openGuestLink}
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Открыть
            </Button>
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(booking.id)}
            className="flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
