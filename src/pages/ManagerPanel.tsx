import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/MediaUpload";
import { useFormValidation, validationRules } from "@/components/FormValidation";
import { Copy, Share, Settings, Upload, AlertCircle, ArrowLeft } from "lucide-react";

const ManagerPanel = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    apartmentNumber: '169',
    checkIn: '',
    checkOut: '',
    entranceCode: '',
    electronicLockCode: '',
    wifiPassword: '',
    guestName: ''
  });

  const { errors, validateForm, validateAndClearError, hasErrors } = useFormValidation(validationRules);

  const generateGuestLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      apartment: formData.apartmentNumber,
      checkin: formData.checkIn,
      checkout: formData.checkOut,
      entrance: formData.entranceCode,
      lock: formData.electronicLockCode,
      wifi: formData.wifiPassword
    });
    
    return `${baseUrl}/guide?${params.toString()}`;
  };

  const handleCopyLink = () => {
    if (!validateForm(formData)) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, исправьте ошибки в форме",
        variant: "destructive"
      });
      return;
    }

    const link = generateGuestLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Ссылка скопирована!",
      description: "Ссылка для гостя скопирована в буфер обмена",
    });
  };

  const handleShareLink = () => {
    if (!validateForm(formData)) {
      toast({
        title: "Ошибка валидации", 
        description: "Пожалуйста, исправьте ошибки в форме",
        variant: "destructive"
      });
      return;
    }

    const link = generateGuestLink();
    const message = `Здравствуйте, ${formData.guestName}!\n\nВаша инструкция по заселению в MORENT:\n${link}`;
    
    navigator.clipboard.writeText(message);
    toast({
      title: "Сообщение готово!",
      description: "Сообщение с инструкцией скопировано в буфер обмена",
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateAndClearError(field, value);
  };

  return (
    <div className="min-h-screen bg-gradient-wave p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 shadow-ocean">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold font-playfair text-primary uppercase">Панель менеджера MORENT</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Button>
          </div>

          <Tabs defaultValue="guest-data" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="guest-data" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Данные гостя
              </TabsTrigger>
              <TabsTrigger value="media-upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Медиафайлы
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guest-data" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold font-playfair text-primary border-b border-border pb-2 uppercase">
                    Данные для гостя
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="guestName">Имя гостя</Label>
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => updateFormData('guestName', e.target.value)}
                        placeholder="Иван Иванов"
                        className={errors.guestName ? "border-destructive" : ""}
                      />
                      {errors.guestName && (
                        <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.guestName}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="apartment">Номер апартаментов</Label>
                      <Input
                        id="apartment"
                        value={formData.apartmentNumber}
                        onChange={(e) => updateFormData('apartmentNumber', e.target.value)}
                        placeholder="169"
                        className={errors.apartmentNumber ? "border-destructive" : ""}
                      />
                      {errors.apartmentNumber && (
                        <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.apartmentNumber}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkin">Дата заезда</Label>
                        <Input
                          id="checkin"
                          value={formData.checkIn}
                          onChange={(e) => updateFormData('checkIn', e.target.value)}
                          placeholder="08.06.2025 в 15:00"
                          className={errors.checkIn ? "border-destructive" : ""}
                        />
                        {errors.checkIn && (
                          <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.checkIn}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="checkout">Дата выезда</Label>
                        <Input
                          id="checkout"
                          value={formData.checkOut}
                          onChange={(e) => updateFormData('checkOut', e.target.value)}
                          placeholder="09.06.2025 в 12:00"
                          className={errors.checkOut ? "border-destructive" : ""}
                        />
                        {errors.checkOut && (
                          <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.checkOut}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entrance">Код от подъезда</Label>
                        <Input
                          id="entrance"
                          value={formData.entranceCode}
                          onChange={(e) => updateFormData('entranceCode', e.target.value)}
                          placeholder="#2020"
                          className={errors.entranceCode ? "border-destructive" : ""}
                        />
                        {errors.entranceCode && (
                          <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.entranceCode}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lock">Код электронного замка</Label>
                        <Input
                          id="lock"
                          value={formData.electronicLockCode}
                          onChange={(e) => updateFormData('electronicLockCode', e.target.value)}
                          placeholder="1111"
                          className={errors.electronicLockCode ? "border-destructive" : ""}
                        />
                        {errors.electronicLockCode && (
                          <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.electronicLockCode}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="wifi">Wi-Fi логин/пароль</Label>
                      <Input
                        id="wifi"
                        value={formData.wifiPassword}
                        onChange={(e) => updateFormData('wifiPassword', e.target.value)}
                        placeholder="логин/пароль"
                        className={errors.wifiPassword ? "border-destructive" : ""}
                      />
                      {errors.wifiPassword && (
                        <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.wifiPassword}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview and Actions */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold font-playfair text-primary border-b border-border pb-2 uppercase">
                    Ссылка для отправки
                  </h2>

                  <Card className="p-4 bg-muted">
                    <Label className="text-sm font-medium">Ссылка для гостя:</Label>
                    <Textarea
                      value={generateGuestLink()}
                      readOnly
                      className="mt-2 h-20 resize-none"
                    />
                  </Card>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleCopyLink}
                      disabled={hasErrors}
                      className="w-full bg-gradient-ocean shadow-ocean disabled:opacity-50"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Скопировать ссылку
                    </Button>

                    <Button 
                      onClick={handleShareLink}
                      disabled={hasErrors}
                      variant="outline"
                      className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white disabled:opacity-50"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Подготовить сообщение для гостя
                    </Button>
                  </div>

                  <Card className="p-4 bg-accent/5 border-accent/20">
                    <h3 className="font-medium text-accent mb-2">Готовое сообщение:</h3>
                    <p className="text-sm text-foreground">
                      Здравствуйте, {formData.guestName || '[Имя гостя]'}!<br/>
                      Ваша инструкция по заселению в MORENT:<br/>
                      [Ссылка будет вставлена автоматически]
                    </p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media-upload" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <MediaUpload 
                  category="welcome_photos" 
                  title="Фотографии для секции приветствия" 
                />
                <MediaUpload 
                  category="checkin_videos" 
                  title="Видео для раздела заселение" 
                />
                <MediaUpload 
                  category="trash_location" 
                  title="Видео расположения мусорных баков" 
                />
                <MediaUpload 
                  category="territory_description" 
                  title="Описание территории" 
                />
                <MediaUpload 
                  category="beach_directions" 
                  title="Как дойти до пляжа" 
                />
                <MediaUpload 
                  category="excursion_info" 
                  title="Информация об экскурсиях" 
                />
                <MediaUpload 
                  category="car_rental" 
                  title="Аренда автомобилей" 
                />
                <MediaUpload 
                  category="general_info" 
                  title="Общая информация" 
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ManagerPanel;