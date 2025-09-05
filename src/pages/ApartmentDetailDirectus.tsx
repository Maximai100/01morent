import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit, Trash2, Calendar, User, Phone, Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDirectusApartments, useDirectusBookings } from "@/hooks/useDirectus";
import { toast } from "sonner";
import { DirectusBooking } from "@/integrations/directus/client";

const ApartmentDetailDirectus = () => {
  const { apartmentId } = useParams();
  const { getApartmentById } = useDirectusApartments();
  const { 
    bookings, 
    loading: bookingsLoading, 
    createBooking, 
    updateBooking, 
    deleteBooking,
    getBookingsByApartment 
  } = useDirectusBookings();

  const [apartment, setApartment] = useState<any>(null);
  const [apartmentGuests, setApartmentGuests] = useState<DirectusBooking[]>([]);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<DirectusBooking | null>(null);
  const [guestForm, setGuestForm] = useState({
    guest_name: "",
    checkin_date: "",
    checkout_date: "",
    contact_email: "",
    contact_phone: "",
    special_requests: "",
    status: "pending" as "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled"
  });

  useEffect(() => {
    if (apartmentId) {
      loadApartment();
    }
  }, [apartmentId]);

  useEffect(() => {
    // Фильтруем бронирования по апартаменту
    const filteredBookings = bookings.filter(booking => booking.apartment_id === apartmentId);
    setApartmentGuests(filteredBookings);
  }, [bookings, apartmentId]);

  const loadApartment = async () => {
    if (!apartmentId) return;
    
    try {
      const apartmentData = await getApartmentById(apartmentId);
      setApartment(apartmentData);
    } catch (error) {
      console.error('Error loading apartment:', error);
      toast.error('Ошибка загрузки апартамента');
    }
  };

  const saveGuest = async () => {
    if (!guestForm.guest_name) {
      toast.error('Заполните имя гостя');
      return;
    }

    if (!apartmentId) {
      toast.error('ID апартамента не найден');
      return;
    }

    try {
      if (selectedGuest) {
        // Обновление существующего бронирования
        await updateBooking(selectedGuest.id, {
          guest_name: guestForm.guest_name,
          checkin_date: guestForm.checkin_date || null,
          checkout_date: guestForm.checkout_date || null
        });
      } else {
        // Создание нового бронирования
        const slug = `${guestForm.guest_name.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}`;
        await createBooking({
          apartment_id: apartmentId,
          guest_name: guestForm.guest_name,
          checkin_date: guestForm.checkin_date || null,
          checkout_date: guestForm.checkout_date || null,
          slug: slug
        });
      }

      setShowGuestForm(false);
      setSelectedGuest(null);
      setGuestForm({
        guest_name: "",
        checkin_date: "",
        checkout_date: "",
        contact_email: "",
        contact_phone: "",
        special_requests: "",
        status: "pending"
      });
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  const editGuest = (guest: DirectusBooking) => {
    setSelectedGuest(guest);
    setGuestForm({
      guest_name: guest.guest_name,
      checkin_date: guest.checkin_date,
      checkout_date: guest.checkout_date,
      contact_email: "",
      contact_phone: "",
      special_requests: "",
      status: "pending"
    });
    setShowGuestForm(true);
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это бронирование?')) {
      return;
    }

    try {
      await deleteBooking(guestId);
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };


  const generateGuestLink = (guest: DirectusBooking) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      guest: guest.guest_name,
      apartment: apartment?.apartment_number || '',
      checkin: guest.checkin_date,
      checkout: guest.checkout_date,
      entrance: apartment?.code_building || '',
      lock: apartment?.code_lock || '',
      wifi: apartment?.wifi_password || ''
    });
    
    return `${baseUrl}/guide?${params.toString()}`;
  };

  const copyGuestLink = (guest: DirectusBooking) => {
    const link = generateGuestLink(guest);
    navigator.clipboard.writeText(link);
    toast.success('Ссылка скопирована в буфер обмена');
  };

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
    <div className="min-h-screen bg-gradient-wave p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/apartments'}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к апартаментам
              </Button>
              <div>
                <h1 className="text-4xl font-bold font-playfair text-primary mb-2">
                  {apartment.name}
                </h1>
                <p className="text-muted-foreground">
                  Номер: {apartment.number} • Управление гостями
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guests List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-primary">Бронирования</h2>
              <Button
                onClick={() => {
                  setSelectedGuest(null);
                  setGuestForm({
                    name: "",
                    check_in_date: "",
                    check_out_date: "",
                    contact_email: "",
                    contact_phone: "",
                    special_requests: "",
                    status: "pending"
                  });
                  setShowGuestForm(true);
                }}
                className="touch-target"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить бронирование
              </Button>
            </div>

            {bookingsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Загрузка бронирований...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {apartmentGuests.map((guest) => (
                  <Card key={guest.id} className="hover-lift">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {guest.guest_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {guest.checkin_date ? new Date(guest.checkin_date).toLocaleDateString() : 'Дата не указана'} - {guest.checkout_date ? new Date(guest.checkout_date).toLocaleDateString() : 'Дата не указана'}
                            </span>
                          </CardDescription>
                          <div className="mt-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Активное бронирование
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyGuestLink(guest)}
                          >
                            Копировать ссылку
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editGuest(guest)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGuest(guest.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {guest.contact_email && (
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {guest.contact_email}
                          </p>
                        )}
                        {guest.contact_phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {guest.contact_phone}
                          </p>
                        )}
                        {guest.special_requests && (
                          <p>
                            <span className="font-medium">Особые пожелания:</span> {guest.special_requests}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Создано:</span> {new Date(guest.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {apartmentGuests.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Нет бронирований</h3>
                      <p className="text-muted-foreground mb-4">
                        Добавьте первое бронирование для этого апартамента
                      </p>
                      <Button
                        onClick={() => setShowGuestForm(true)}
                        className="bg-gradient-ocean"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить бронирование
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Guest Form */}
          {showGuestForm && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedGuest ? 'Редактировать бронирование' : 'Новое бронирование'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя гостя *</Label>
                    <Input
                      id="guest_name"
                      value={guestForm.guest_name}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, guest_name: e.target.value }))}
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkin_date">Дата заезда *</Label>
                    <Input
                      id="checkin_date"
                      type="datetime-local"
                      value={guestForm.checkin_date}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, checkin_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout_date">Дата выезда *</Label>
                    <Input
                      id="checkout_date"
                      type="datetime-local"
                      value={guestForm.checkout_date}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, checkout_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={guestForm.contact_email}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="guest@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Телефон</Label>
                    <Input
                      id="contact_phone"
                      value={guestForm.contact_phone}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="special_requests">Особые пожелания</Label>
                    <Textarea
                      id="special_requests"
                      value={guestForm.special_requests}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, special_requests: e.target.value }))}
                      placeholder="Дополнительные пожелания гостя"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveGuest} className="flex-1">
                      {selectedGuest ? 'Обновить' : 'Создать'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowGuestForm(false)}
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetailDirectus;
