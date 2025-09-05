import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink, Database, RefreshCw, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDirectusApartments, useDirectusBookings } from "@/hooks/useDirectus";
import { BookingCard } from "@/components/BookingCard";
import { toast } from "sonner";
import { DirectusApartment, DirectusBooking, dataUtils } from "@/integrations/directus/client";

const ApartmentsManagerDirectus = () => {
  const { 
    apartments, 
    loading: apartmentsLoading, 
    error: apartmentsError,
    createApartment, 
    updateApartment, 
    deleteApartment 
  } = useDirectusApartments();
  
  const { 
    bookings, 
    loading: bookingsLoading, 
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingsByApartment 
  } = useDirectusBookings();
  

  const [showApartmentForm, setShowApartmentForm] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<DirectusApartment | null>(null);
  const [apartmentForm, setApartmentForm] = useState({
    title: "",
    apartment_number: "",
    building_number: "Б",
    base_address: "Нагорный тупик 13",
    description: "",
    wifi_name: "",
    wifi_password: "",
    code_building: "",
    code_lock: "",
    manager_name: "Морент",
    manager_phone: "88007005501",
    manager_email: "morent_sochi@mail.ru"
  });

  const [apartmentBookings, setApartmentBookings] = useState<Record<string, DirectusBooking[]>>({});

  useEffect(() => {
    // Загружаем бронирования для каждого апартамента
    const loadBookingsForApartments = async () => {
      const bookingsMap: Record<string, DirectusBooking[]> = {};
      
      for (const apartment of apartments) {
        try {
          const apartmentBookings = await getBookingsByApartment(apartment.id);
          bookingsMap[apartment.id] = apartmentBookings;
        } catch (error) {
          console.error(`Error loading bookings for apartment ${apartment.id}:`, error);
          bookingsMap[apartment.id] = [];
        }
      }
      
      setApartmentBookings(bookingsMap);
    };

    if (apartments.length > 0) {
      loadBookingsForApartments();
    }
  }, [apartments, getBookingsByApartment]);

  const saveApartment = async () => {
    if (!apartmentForm.title || !apartmentForm.apartment_number) {
      toast.error('Заполните обязательные поля');
      return;
    }

    try {
      if (selectedApartment) {
        // Обновление существующего апартамента
        await updateApartment(selectedApartment.id, {
          title: apartmentForm.title,
          apartment_number: apartmentForm.apartment_number,
          building_number: apartmentForm.building_number,
          base_address: apartmentForm.base_address,
          description: apartmentForm.description || null,
          wifi_name: apartmentForm.wifi_name || null,
          wifi_password: apartmentForm.wifi_password || null,
          code_building: apartmentForm.code_building || null,
          code_lock: apartmentForm.code_lock || null,
          manager_name: apartmentForm.manager_name,
          manager_phone: apartmentForm.manager_phone,
          manager_email: apartmentForm.manager_email
        });
      } else {
        // Создание нового апартамента
        await createApartment({
          title: apartmentForm.title,
          apartment_number: apartmentForm.apartment_number,
          building_number: apartmentForm.building_number,
          base_address: apartmentForm.base_address,
          description: apartmentForm.description || null,
          photos: null,
          video_entrance: null,
          video_lock: null,
          wifi_name: apartmentForm.wifi_name || null,
          wifi_password: apartmentForm.wifi_password || null,
          code_building: apartmentForm.code_building || null,
          code_lock: apartmentForm.code_lock || null,
          faq_checkin: null,
          faq_apartment: null,
          faq_area: null,
          map_embed_code: null,
          manager_name: apartmentForm.manager_name,
          manager_phone: apartmentForm.manager_phone,
          manager_email: apartmentForm.manager_email
        });
      }

      setShowApartmentForm(false);
      setSelectedApartment(null);
      setApartmentForm({
        title: "",
        apartment_number: "",
        building_number: "Б",
        base_address: "Нагорный тупик 13",
        description: "",
        wifi_name: "",
        wifi_password: "",
        code_building: "",
        code_lock: "",
        manager_name: "Морент",
        manager_phone: "88007005501",
        manager_email: "morent_sochi@mail.ru"
      });
    } catch (error) {
      console.error('Error saving apartment:', error);
    }
  };

  const editApartment = (apartment: DirectusApartment) => {
    setSelectedApartment(apartment);
    setApartmentForm({
      title: apartment.title,
      apartment_number: apartment.apartment_number,
      building_number: apartment.building_number,
      base_address: apartment.base_address,
      description: apartment.description || "",
      wifi_name: apartment.wifi_name || "",
      wifi_password: apartment.wifi_password || "",
      code_building: apartment.code_building || "",
      code_lock: apartment.code_lock || "",
      manager_name: apartment.manager_name || "Морент",
      manager_phone: apartment.manager_phone || "88007005501",
      manager_email: apartment.manager_email || "morent_sochi@mail.ru"
    });
    setShowApartmentForm(true);
  };

  const handleDeleteApartment = async (apartmentId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот апартамент? Все связанные данные будут удалены.')) {
      return;
    }

    try {
      await deleteApartment(apartmentId);
    } catch (error) {
      console.error('Error deleting apartment:', error);
    }
  };

  const handleEditBooking = (booking: DirectusBooking) => {
    // Переходим на страницу управления апартаментом для редактирования бронирования
    window.location.href = `/apartment/${booking.apartment_id}/manage`;
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это бронирование?')) {
      return;
    }

    try {
      await deleteBooking(bookingId);
      // Обновляем список бронирований для апартамента
      const updatedBookings = await getBookingsByApartment(bookingId);
      setApartmentBookings(prev => ({
        ...prev,
        [bookingId]: updatedBookings
      }));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-wave p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold font-playfair text-primary mb-2">
                Управление апартаментами MORENT
              </h1>
              <p className="text-muted-foreground">
                Управление апартаментами через Directus CMS
              </p>
            </div>
          </div>
          
          {/* Отображение ошибки подключения */}
          {apartmentsError && (
            <Card className="mb-6 border-destructive bg-destructive/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-destructive" />
                  <div>
                    <h3 className="font-semibold text-destructive">Ошибка подключения к Directus</h3>
                    <p className="text-sm text-muted-foreground mt-1">{apartmentsError}</p>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        Для решения проблемы:
                      </p>
                      <ul className="text-xs text-muted-foreground mt-1 ml-4 list-disc">
                        <li>Создайте файл <code className="bg-muted px-1 rounded">.env</code> в корне проекта</li>
                        <li>Добавьте переменные <code className="bg-muted px-1 rounded">VITE_DIRECTUS_URL</code> и <code className="bg-muted px-1 rounded">VITE_DIRECTUS_TOKEN</code></li>
                        <li>Получите токен в админ-панели Directus: Settings → Access Tokens</li>
                        <li>Перезапустите сервер разработки</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Apartments List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-primary">Апартаменты</h2>
              <Button
                onClick={() => {
                  setSelectedApartment(null);
                  setApartmentForm({
                    title: "",
                    apartment_number: "",
                    building_number: "Б",
                    base_address: "Нагорный тупик 13",
                    description: "",
                    wifi_name: "",
                    wifi_password: "",
                    code_building: "",
                    code_lock: "",
                    manager_name: "Морент",
                    manager_phone: "88007005501",
                    manager_email: "morent_sochi@mail.ru"
                  });
                  setShowApartmentForm(true);
                }}
                className="touch-target"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить апартамент
              </Button>
            </div>

            {apartmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Загрузка апартаментов...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apartments.map((apartment) => {
                  const apartmentBookingsList = apartmentBookings[apartment.id] || [];
                  return (
                    <Card key={apartment.id} className="hover-lift">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{dataUtils.getDisplayName(apartment)}</CardTitle>
                            <CardDescription>{dataUtils.getFullAddress(apartment)}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editApartment(apartment)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteApartment(apartment.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {apartment.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {apartment.description}
                          </p>
                        )}
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Бронирований:</span> {apartmentBookingsList.length}</p>
                          <p><span className="font-medium">Создан:</span> {new Date(apartment.date_created).toLocaleDateString()}</p>
                          {apartment.manager_phone && (
                            <p><span className="font-medium">Телефон:</span> {apartment.manager_phone}</p>
                          )}
                        </div>
                        
                        {/* Показываем последние 3 бронирования */}
                        {apartmentBookingsList.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Последние бронирования:</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {apartmentBookingsList.slice(0, 3).map((booking) => (
                                <BookingCard
                                  key={booking.id}
                                  booking={booking}
                                  onEdit={handleEditBooking}
                                  onDelete={handleDeleteBooking}
                                  apartmentNumber={apartment.apartment_number}
                                  apartmentBuilding={apartment.building_number}
                                />
                              ))}
                              {apartmentBookingsList.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center">
                                  И еще {apartmentBookingsList.length - 3} бронирований...
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.location.href = `/apartment/${apartment.id}/manage-directus`}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Управление бронированиями
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Apartment Form */}
          {showApartmentForm && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedApartment ? 'Редактировать апартамент' : 'Новый апартамент'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название *</Label>
                    <Input
                      id="title"
                      value={apartmentForm.title}
                      onChange={(e) => setApartmentForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Апартаменты Морент"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apartment_number">Номер апартамента *</Label>
                      <Input
                        id="apartment_number"
                        value={apartmentForm.apartment_number}
                        onChange={(e) => setApartmentForm(prev => ({ ...prev, apartment_number: e.target.value }))}
                        placeholder="169"
                      />
                    </div>
                    <div>
                      <Label htmlFor="building_number">Корпус</Label>
                      <Select
                        value={apartmentForm.building_number}
                        onValueChange={(value) => setApartmentForm(prev => ({ ...prev, building_number: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="А">А</SelectItem>
                          <SelectItem value="Б">Б</SelectItem>
                          <SelectItem value="В">В</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="base_address">Базовый адрес</Label>
                    <Input
                      id="base_address"
                      value={apartmentForm.base_address}
                      onChange={(e) => setApartmentForm(prev => ({ ...prev, base_address: e.target.value }))}
                      placeholder="Нагорный тупик 13"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={apartmentForm.description}
                      onChange={(e) => setApartmentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Красивый апартамент с видом на море"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wifi_name">Название WiFi</Label>
                      <Input
                        id="wifi_name"
                        value={apartmentForm.wifi_name}
                        onChange={(e) => setApartmentForm(prev => ({ ...prev, wifi_name: e.target.value }))}
                        placeholder="WiFi название"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi_password">Пароль WiFi</Label>
                      <Input
                        id="wifi_password"
                        value={apartmentForm.wifi_password}
                        onChange={(e) => setApartmentForm(prev => ({ ...prev, wifi_password: e.target.value }))}
                        placeholder="пароль"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code_building">Код подъезда</Label>
                      <Input
                        id="code_building"
                        value={apartmentForm.code_building}
                        onChange={(e) => setApartmentForm(prev => ({ ...prev, code_building: e.target.value }))}
                        placeholder="#2020"
                      />
                    </div>
                    <div>
                      <Label htmlFor="code_lock">Код замка</Label>
                      <Input
                        id="code_lock"
                        value={apartmentForm.code_lock}
                        onChange={(e) => setApartmentForm(prev => ({ ...prev, code_lock: e.target.value }))}
                        placeholder="1111"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="manager_name">Имя менеджера</Label>
                    <Input
                      id="manager_name"
                      value={apartmentForm.manager_name}
                      onChange={(e) => setApartmentForm(prev => ({ ...prev, manager_name: e.target.value }))}
                      placeholder="Морент"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="manager_phone">Телефон менеджера</Label>
                      <Input
                        id="manager_phone"
                        value={apartmentForm.manager_phone}
                        onChange={(e) => setApartmentForm(prev => ({ ...prev, manager_phone: e.target.value }))}
                        placeholder="88007005501"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manager_email">Email менеджера</Label>
                      <Input
                        id="manager_email"
                        value={apartmentForm.manager_email}
                        onChange={(e) => setApartmentForm(prev => ({ ...prev, manager_email: e.target.value }))}
                        placeholder="morent_sochi@mail.ru"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveApartment} className="flex-1">
                      {selectedApartment ? 'Обновить' : 'Создать'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowApartmentForm(false)}
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

export default ApartmentsManagerDirectus;
