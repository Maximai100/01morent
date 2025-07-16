import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaFile {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  description: string | null;
}

interface MediaDisplayProps {
  category: string;
  fallbackText?: string;
  className?: string;
  horizontal?: boolean;
}

export const MediaDisplay = ({ 
  category, 
  fallbackText = "Нет доступных файлов",
  className = "",
  horizontal = false
}: MediaDisplayProps) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMediaFiles = async () => {
      try {
        const { data, error } = await supabase
          .from('media_files')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Ошибка загрузки медиафайлов:', error);
          return;
        }

        setMediaFiles(data || []);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaFiles();
  }, [category]);

  if (loading) {
    return (
      <div className={`min-h-[200px] flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (mediaFiles.length === 0) {
    return (
      <div className={`bg-muted rounded-xl p-8 text-center min-h-[200px] flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div className={horizontal ? 
      `flex gap-4 overflow-x-auto pb-4 ${className}` : 
      `grid gap-4 ${className}`
    }>
      {mediaFiles.map((file) => {
        const fileUrl = `https://ugsbqgajuvcdlxsyivvo.supabase.co/storage/v1/object/public/media/${file.file_path}`;
        
        if (file.file_type.startsWith('image/')) {
          return (
            <div key={file.id} className={`relative group ${horizontal ? 'flex-shrink-0 w-80' : ''}`}>
              <img 
                src={fileUrl}
                alt={file.description || file.filename}
                loading="lazy"
                className={`object-cover rounded-xl shadow-gentle hover:shadow-ocean transition-all duration-300 ${
                  horizontal ? 'w-80 h-64' : 'w-full h-64'
                }`}
              />
              {file.description && (
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  {file.description}
                </p>
              )}
            </div>
          );
        }
        
        if (file.file_type.startsWith('video/')) {
          return (
            <div key={file.id} className={`relative group ${horizontal ? 'flex-shrink-0 w-80' : ''}`}>
              <video 
                controls
                className={`rounded-xl shadow-gentle ${
                  horizontal ? 'w-80 max-h-64' : 'w-full max-h-64'
                }`}
                preload="metadata"
              >
                <source src={fileUrl} type={file.file_type} />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
              {file.description && (
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  {file.description}
                </p>
              )}
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};