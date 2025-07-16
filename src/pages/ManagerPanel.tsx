import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/MediaUpload";
import { Copy, Share, Settings, Upload } from "lucide-react";

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
    const link = generateGuestLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Ссылка скопирована!",
      description: "Ссылка для гостя скопирована в буфер обмена",
    });
  };

  const handleShareLink = () => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-wave p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 shadow-ocean">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Панель менеджера MORENT</h1>
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
                  <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">
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
                      />
                    </div>

                    <div>
                      <Label htmlFor="apartment">Номер апартаментов</Label>
                      <Input
                        id="apartment"
                        value={formData.apartmentNumber}
                        onChange={(e) => updateFormData('apartmentNumber', e.target.value)}
                        placeholder="169"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkin">Дата заезда</Label>
                        <Input
                          id="checkin"
                          value={formData.checkIn}
                          onChange={(e) => updateFormData('checkIn', e.target.value)}
                          placeholder="08.06.2025 в 15:00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkout">Дата выезда</Label>
                        <Input
                          id="checkout"
                          value={formData.checkOut}
                          onChange={(e) => updateFormData('checkOut', e.target.value)}
                          placeholder="09.06.2025 в 12:00"
                        />
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
                        />
                      </div>
                      <div>
                        <Label htmlFor="lock">Код электронного замка</Label>
                        <Input
                          id="lock"
                          value={formData.electronicLockCode}
                          onChange={(e) => updateFormData('electronicLockCode', e.target.value)}
                          placeholder="1111"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="wifi">Wi-Fi логин/пароль</Label>
                      <Input
                        id="wifi"
                        value={formData.wifiPassword}
                        onChange={(e) => updateFormData('wifiPassword', e.target.value)}
                        placeholder="логин/пароль"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview and Actions */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-primary border-b border-border pb-2">
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
                      className="w-full bg-gradient-ocean shadow-ocean"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Скопировать ссылку
                    </Button>

                    <Button 
                      onClick={handleShareLink}
                      variant="outline"
                      className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white"
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