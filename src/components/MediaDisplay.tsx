import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SkeletonMedia } from "@/components/ui/skeleton";

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
      <div className={`${className} ${horizontal ? 'flex gap-4 overflow-hidden' : 'grid gap-4'}`}>
        {[1, 2, 3].map((i) => (
          <SkeletonMedia key={i} />
        ))}
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

  // Determine MIME type for video based on file extension
  const getVideoMimeType = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      case 'ogg': return 'video/ogg';
      case 'avi': return 'video/avi';
      case 'mov': return 'video/quicktime';
      default: return 'video/mp4';
    }
  };

  if (horizontal) {
    // Carousel view for horizontal layout
    return (
      <div className={`relative ${className}`}>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {mediaFiles.map((file) => {
              const fileUrl = file.file_path;
              
              return (
                <CarouselItem key={file.id} className="pl-2 md:pl-4 basis-auto">
                  <div className="flex-shrink-0 w-80">
                    {file.file_type === 'image' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <img 
                            src={fileUrl}
                            alt={file.filename}
                            loading="lazy"
                           onError={(e) => {
                              console.error('Image failed to load:', fileUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                            className="object-cover rounded-xl shadow-gentle hover:shadow-ocean transition-all duration-300 w-80 h-64 cursor-pointer hover-lift"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                          <img 
                            src={fileUrl}
                            alt={file.filename}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : file.file_type === 'video' ? (
                      <video 
                        controls
                        className="rounded-xl shadow-gentle w-80 max-h-64"
                        preload="metadata"
                      >
                        <source src={fileUrl} type={getVideoMimeType(file.filename)} />
                        Ваш браузер не поддерживает воспроизведение видео.
                      </video>
                    ) : null}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    );
  }

  // Grid view for non-horizontal layout
  return (
    <div className={`grid gap-4 ${className}`}>
      {mediaFiles.map((file) => {
        const fileUrl = file.file_path;
        
        if (file.file_type === 'image') {
          return (
            <Dialog key={file.id}>
              <DialogTrigger asChild>
                <img 
                  src={fileUrl}
                  alt={file.filename}
                  loading="lazy"
                  onError={(e) => {
                    console.error('Image failed to load:', fileUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  className="object-cover rounded-xl shadow-gentle hover:shadow-ocean transition-all duration-300 w-full h-64 cursor-pointer hover:scale-105"
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                <img 
                  src={fileUrl}
                  alt={file.filename}
                  className="w-full h-full object-contain rounded-lg"
                />
              </DialogContent>
            </Dialog>
          );
        }
        
        if (file.file_type === 'video') {
          return (
            <video 
              key={file.id}
              controls
              className="rounded-xl shadow-gentle w-full max-h-64"
              preload="metadata"
            >
              <source src={fileUrl} type={getVideoMimeType(file.filename)} />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          );
        }
        
        return null;
      })}
    </div>
  );
};