import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit, Trash2, Calendar, User, Phone, Mail, ArrowLeft, Upload, Image, Video, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDirectusApartments, useDirectusBookings, useDirectusMedia } from "@/hooks/useDirectus";
import { toast } from "sonner";
import { DirectusBooking } from "@/integrations/directus/client";

const ApartmentDetailDirectus = () => {
  const { apartmentId } = useParams();
  const { getApartmentById, updateApartment } = useDirectusApartments();
  const { 
    bookings, 
    loading: bookingsLoading, 
    createBooking, 
    updateBooking, 
    deleteBooking,
    getBookingsByApartment 
  } = useDirectusBookings();

  const { uploadFile, getFilesByFolder, deleteFile, uploading } = useDirectusMedia();
  
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

  // Состояние для медиафайлов
  const [apartmentPhotos, setApartmentPhotos] = useState<any[]>([]);
  const [apartmentVideos, setApartmentVideos] = useState<any[]>([]);
  const [entranceVideo, setEntranceVideo] = useState<any[]>([]);
  const [lockVideo, setLockVideo] = useState<any[]>([]);

  // Состояние для FAQ
  const [faqForm, setFaqForm] = useState({
    faq_checkin: "",
    faq_apartment: "",
    faq_area: ""
  });
  const [showFaqForm, setShowFaqForm] = useState(false);

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
      
      // Загружаем FAQ данные
      if (apartmentData) {
        setFaqForm({
          faq_checkin: apartmentData.faq_checkin || "",
          faq_apartment: apartmentData.faq_apartment || "",
          faq_area: apartmentData.faq_area || ""
        });
      }
      
      // Загружаем медиафайлы
      await loadMediaFiles();
    } catch (error) {
      console.error('Error loading apartment:', error);
      toast.error('Ошибка загрузки апартамента');
    }
  };

  const loadMediaFiles = async () => {
    if (!apartmentId) return;
    
    try {
      // Загружаем фото апартамента
      const photos = await getFilesByFolder(`apartment-${apartmentId}-photos`);
      setApartmentPhotos(photos.filter(file => file.type.startsWith('image/')));
      
      // Загружаем видео апартамента
      const videos = await getFilesByFolder(`apartment-${apartmentId}-videos`);
      setApartmentVideos(videos.filter(file => file.type.startsWith('video/')));
      
      // Загружаем видео подъезда
      const entranceVideos = await getFilesByFolder(`apartment-${apartmentId}-entrance`);
      setEntranceVideo(entranceVideos.filter(file => file.type.startsWith('video/')));
      
      // Загружаем видео замка
      const lockVideos = await getFilesByFolder(`apartment-${apartmentId}-lock`);
      setLockVideo(lockVideos.filter(file => file.type.startsWith('video/')));
    } catch (error) {
      console.error('Error loading media files:', error);
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

  // Функции для работы с медиафайлами
  const handleFileUpload = async (file: File, category: string) => {
    if (!apartmentId) return;
    
    try {
      const folderName = `apartment-${apartmentId}-${category}`;
      await uploadFile(file, folderName);
      toast.success('Файл загружен успешно');
      await loadMediaFiles(); // Перезагружаем медиафайлы
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Ошибка загрузки файла');
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот файл?')) return;
    
    try {
      await deleteFile(fileId);
      toast.success('Файл удален успешно');
      await loadMediaFiles(); // Перезагружаем медиафайлы
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Ошибка удаления файла');
    }
  };

  // Функции для работы с FAQ
  const saveFaq = async () => {
    if (!apartmentId) return;
    
    try {
      await updateApartment(apartmentId, {
        faq_checkin: faqForm.faq_checkin,
        faq_apartment: faqForm.faq_apartment,
        faq_area: faqForm.faq_area
      });
      toast.success('FAQ обновлены успешно');
      setShowFaqForm(false);
      await loadApartment(); // Перезагружаем данные апартамента
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Ошибка сохранения FAQ');
    }
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
                  {apartment.title}
                </h1>
                <p className="text-muted-foreground">
                  Апартаменты {apartment.apartment_number}{apartment.building_number} • Управление
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Бронирования
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Медиафайлы
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Информация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
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
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-primary">Медиафайлы апартамента</h2>
              
              {/* Фотографии апартамента */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Фотографии апартамента
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach(file => {
                              handleFileUpload(file, 'photos');
                            });
                          }
                        }}
                        className="hidden"
                        id="apartment-photos"
                      />
                      <label htmlFor="apartment-photos">
                        <Button asChild disabled={uploading}>
                          <span className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Загрузка...' : 'Загрузить фотографии'}
                          </span>
                        </Button>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {apartmentPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={`https://1.cycloscope.online/assets/${photo.id}`}
                            alt={photo.filename_download}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleFileDelete(photo.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Видео подъезда */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Видео подъезда
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], 'entrance');
                          }
                        }}
                        className="hidden"
                        id="entrance-video"
                      />
                      <label htmlFor="entrance-video">
                        <Button asChild disabled={uploading}>
                          <span className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Загрузка...' : 'Загрузить видео подъезда'}
                          </span>
                        </Button>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {entranceVideo.map((video) => (
                        <div key={video.id} className="relative group">
                          <video
                            controls
                            className="w-full h-48 rounded-lg"
                            preload="metadata"
                          >
                            <source src={`https://1.cycloscope.online/assets/${video.id}`} type={video.type} />
                          </video>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleFileDelete(video.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Видео электронного замка */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Видео электронного замка
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], 'lock');
                          }
                        }}
                        className="hidden"
                        id="lock-video"
                      />
                      <label htmlFor="lock-video">
                        <Button asChild disabled={uploading}>
                          <span className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Загрузка...' : 'Загрузить видео замка'}
                          </span>
                        </Button>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lockVideo.map((video) => (
                        <div key={video.id} className="relative group">
                          <video
                            controls
                            className="w-full h-48 rounded-lg"
                            preload="metadata"
                          >
                            <source src={`https://1.cycloscope.online/assets/${video.id}`} type={video.type} />
                          </video>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleFileDelete(video.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-primary">FAQ Тексты</h2>
                <Button onClick={() => setShowFaqForm(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать FAQ
                </Button>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>FAQ по заселению</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-sm text-muted-foreground">
                      {apartment.faq_checkin || 'Не заполнено'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>FAQ по апартаментам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-sm text-muted-foreground">
                      {apartment.faq_apartment || 'Не заполнено'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>FAQ по району</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-sm text-muted-foreground">
                      {apartment.faq_area || 'Не заполнено'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {showFaqForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Редактирование FAQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="faq_checkin">FAQ по заселению</Label>
                        <Textarea
                          id="faq_checkin"
                          value={faqForm.faq_checkin}
                          onChange={(e) => setFaqForm(prev => ({ ...prev, faq_checkin: e.target.value }))}
                          placeholder="Введите информацию о заселении..."
                          rows={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq_apartment">FAQ по апартаментам</Label>
                        <Textarea
                          id="faq_apartment"
                          value={faqForm.faq_apartment}
                          onChange={(e) => setFaqForm(prev => ({ ...prev, faq_apartment: e.target.value }))}
                          placeholder="Введите информацию об апартаментах..."
                          rows={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq_area">FAQ по району</Label>
                        <Textarea
                          id="faq_area"
                          value={faqForm.faq_area}
                          onChange={(e) => setFaqForm(prev => ({ ...prev, faq_area: e.target.value }))}
                          placeholder="Введите информацию о районе..."
                          rows={5}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveFaq}>Сохранить</Button>
                        <Button variant="outline" onClick={() => setShowFaqForm(false)}>Отмена</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-primary">Информация об апартаменте</h2>
              
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Название:</strong> {apartment.title}
                      </div>
                      <div>
                        <strong>Номер:</strong> {apartment.apartment_number}{apartment.building_number}
                      </div>
                      <div>
                        <strong>Адрес:</strong> {apartment.base_address}
                      </div>
                      <div>
                        <strong>Код подъезда:</strong> {apartment.code_building || 'Не указан'}
                      </div>
                      <div>
                        <strong>Код замка:</strong> {apartment.code_lock || 'Не указан'}
                      </div>
                      <div>
                        <strong>WiFi пароль:</strong> {apartment.wifi_password || 'Не указан'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Контактная информация</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Менеджер:</strong> {apartment.manager_name || 'Не указан'}
                      </div>
                      <div>
                        <strong>Телефон:</strong> {apartment.manager_phone || 'Не указан'}
                      </div>
                      <div className="col-span-2">
                        <strong>Email:</strong> {apartment.manager_email || 'Не указан'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetailDirectus;
