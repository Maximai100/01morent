import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDataMigration } from "@/hooks/useDirectus";
import { Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

const DataMigration = () => {
  const { migrating, progress, migrateFromSupabase } = useDataMigration();
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleMigration = async () => {
    setMigrationStatus('idle');
    setErrorMessage('');
    
    try {
      await migrateFromSupabase();
      setMigrationStatus('success');
    } catch (error) {
      setMigrationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Неизвестная ошибка');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-6 h-6" />
          Миграция данных в Directus
        </CardTitle>
        <CardDescription>
          Перенос данных из Supabase в Directus CMS для улучшенного управления контентом
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {migrationStatus === 'idle' && !migrating && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Миграция перенесет все апартаменты и бронирования из Supabase в Directus. 
              Убедитесь, что Directus настроен и доступен.
            </AlertDescription>
          </Alert>
        )}

        {migrationStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Миграция данных завершена успешно! Все данные перенесены в Directus.
            </AlertDescription>
          </Alert>
        )}

        {migrationStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Ошибка миграции: {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {migrating && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Миграция в процессе...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {Math.round(progress)}% завершено
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-semibold">Что будет перенесено:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Апартаменты (название, номер, описание, коды доступа)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Бронирования (гости, даты заезда/выезда, контакты)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Медиафайлы (фотографии и видео)
            </li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleMigration}
            disabled={migrating}
            className="flex-1 bg-gradient-ocean"
          >
            {migrating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Миграция...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Начать миграцию
              </>
            )}
          </Button>
          
          {migrationStatus === 'success' && (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/apartments-directus'}
              className="flex-1"
            >
              Перейти к Directus
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Примечание:</strong> Миграция не удалит данные из Supabase.</p>
          <p>После миграции вы сможете использовать обе системы параллельно.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataMigration;
