import { Card } from "@/components/ui/card";

export const ApartmentFAQ = () => {
  return (
    <Card className="p-8 shadow-gentle">
      <h3 className="text-2xl font-bold text-primary mb-8 text-center">АПАРТАМЕНТЫ</h3>
      
      <div className="space-y-8">
        {/* Apartments FAQ */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary">FAQ</span>
          </div>
          <div>
            <p className="text-foreground mb-2">Часто</p>
            <p className="text-foreground mb-2">встречающиеся</p>
            <p className="text-foreground mb-4">вопросы:</p>
            <p className="text-sm text-muted-foreground mb-4">(Взять информацию из файла)</p>
            <Card className="p-4 bg-muted border-primary/20">
              <p className="text-sm text-foreground">
                <span className="font-medium">1.</span> Видео как включить плиту (загружается в админ панели)
              </p>
            </Card>
          </div>
        </div>

        {/* Territory FAQ */}
        <div className="border-t border-border pt-8">
          <h4 className="text-xl font-bold text-primary mb-6 text-center">Территория</h4>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary">FAQ</span>
            </div>
            <div>
              <p className="text-foreground mb-2">Часто</p>
              <p className="text-foreground mb-2">встречающиеся</p>
              <p className="text-foreground mb-4">вопросы:</p>
              <p className="text-sm text-muted-foreground">(Взять информацию из файла)</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};