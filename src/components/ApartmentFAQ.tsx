import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MediaDisplay } from "@/components/MediaDisplay";
import { WaveDivider } from "@/components/WaveDivider";
const apartmentFAQData = [{
  question: "Возможно ли заселиться раньше 15:00?",
  answer: "Стандартное время заезда - 15:00.\nЕсли Вы прибыли раньше времени заселения, то мы постараемся помочь с хранением багажа, либо заселим Вас сразу при наличии возможности. Гарантированный ранний заезд оплачивается дополнительно в размере 50% от стоимости суток Вашей брони и дает право заселиться в любое удобное время с 7:00. Заселение ранее 7:00 оплачивается, как полные сутки."
}, {
  question: "Возможно ли выехать позже 12:00?",
  answer: "Стандартное время выезда - 12:00.\nЕсли Вы желаете выехать позже времени выселения, то при наличии свободного номера, мы сообщим Вам время возможного продления или постараемся помочь с хранением багажа.\nГарантированный поздний выезд оплачивается дополнительно в размере 50% стоимости суток Вашей брони и дает право находиться в апартаментах до 22:00. Нахождение в номере после 22:00 оплачивается, как полные сутки."
}, {
  question: "Где можно оставить машину? Есть ли парковка?",
  answer: "В ЖК Сорренто парк\nПлатная парковка при бронировании заранее, по цене 700 руб/ сутки.\nТакже есть открытая неохраняемая парковка на улице."
}, {
  question: "Какие возможны способы оплаты?",
  answer: "Мы присылаем Вам счет на почту для оплаты по безналичному расчету, а также принимаем к оплате наличные."
}, {
  question: "Возможно ли выполнение особых пожеланий?",
  answer: "Да, конечно! Мы будем рады помочь Вам в организации досуга. Наша команда с большим удовольствием организует сюрприз Вашим любимым, поможет с составлением туристической поездки по достопримечательностям, забронирует прогулку на яхте, доставит прокатный автомобиль прямо к аэропорту или к любым апартаментам или закажет трансфер.\n\nДля наилучшего результата свяжитесь с нами заранее (как минимум за 2 дня до даты) и согласуйте всё необходимое."
}, {
  question: "Как заказать уборку?",
  answer: "Позвоните по телефону 88007005501. Замена полотенец 500 рублей, замена белья 500 рублей, влажная уборка 1500 рублей."
}, {
  question: "Куда выбросить мусор?",
  answer: "Видео расположения мусорных баков (загружается из админ панели)"
}, {
  question: "Можно ли оставить багаж?",
  answer: "Багаж можно оставлять до 21-00 стоимость хранения чемодана 500р сумка/рюкзак 300 рублей"
}, {
  question: "Можно ли пить воду из под крана?",
  answer: "Мы не можем рекомендовать пить воду из под крана так как специальный фильтр не установлен. Однако большинство жителей сочи воду из под крана пьют. Под раковиной расположена техническая вода на случай отключения."
}];
const territoryFAQData = [{
  question: "Где заказывают еду?",
  answer: "Самые удобные сервисы САМОКАТ 15-20 минут доставки. ВКУС ВИЛЛ 30-60минут доставки. Яндекс еда."
}, {
  question: "Как заказать экскурсию?",
  answer: "Информация будет добавлена позже."
}, {
  question: "Как заказать авто?",
  answer: "Информация будет добавлена позже."
}, {
  question: "Описание территории?",
  answer: "Информация будет добавлена позже."
}, {
  question: "Как дойти до пляжа?",
  answer: "Информация будет добавлена позже."
}];
export const ApartmentFAQ = () => {
  return (
    <>
      <Card className="p-8 shadow-premium hover-lift wave-divider">
        <div className="space-y-8">
          {/* Apartments FAQ */}
          <div className="stagger-item">
            <h3 className="mb-6 uppercase text-gradient">АПАРТАМЕНТЫ</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-gold bg-gradient-to-r from-primary/10 to-gold/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-gold">FAQ</span>
              </div>
              <div>
                <p className="text-foreground text-lg font-medium leading-relaxed">Часто встречающиеся вопросы</p>
              </div>
            </div>
          
            <Accordion type="single" collapsible className="w-full">
              {apartmentFAQData.map((item, index) => (
                <AccordionItem key={index} value={`apartment-${index}`} className="border-b border-primary/20">
                  <AccordionTrigger className="text-left hover:text-gold transition-colors py-6 text-base font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                    {item.question === "Куда выбросить мусор?" && (
                      <div className="mt-4">
                        <MediaDisplay category="trash_location" />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Territory FAQ */}
          <WaveDivider variant="subtle" className="my-8" />
          <div className="stagger-item border-t border-gold/20 pt-8">
            <h3 className="mb-6 mt-8 uppercase text-gradient">ТЕРРИТОРИЯ</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-gold bg-gradient-to-r from-primary/10 to-gold/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-gold">FAQ</span>
              </div>
              <div>
                <p className="text-foreground text-lg font-medium leading-relaxed">Часто встречающиеся вопросы</p>
              </div>
            </div>
          
            <Accordion type="single" collapsible className="w-full">
              {territoryFAQData.map((item, index) => (
                <AccordionItem key={index} value={`territory-${index}`} className="border-b border-primary/20">
                  <AccordionTrigger className="text-left hover:text-gold transition-colors py-6 text-base font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                    {item.question === "Как заказать экскурсию?" && (
                      <div className="mt-4">
                        <MediaDisplay category="excursion_info" />
                      </div>
                    )}
                    {item.question === "Как заказать авто?" && (
                      <div className="mt-4">
                        <MediaDisplay category="car_rental" />
                      </div>
                    )}
                    {item.question === "Описание территории?" && (
                      <div className="mt-4">
                        <MediaDisplay category="territory_description" />
                      </div>
                    )}
                    {item.question === "Как дойти до пляжа?" && (
                      <div className="mt-4">
                        <MediaDisplay category="beach_directions" />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Card>
      <WaveDivider variant="primary" />
    </>
  );
};