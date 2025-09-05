import { useState, useEffect } from "react";
import { useDirectusMedia } from "@/hooks/useDirectus";
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
  filename_download: string;
  title?: string;
  description?: string;
  type: string;
  filesize: number;
  width?: number;
  height?: number;
  duration?: number;
  folder?: string;
}

interface MediaDisplayProps {
  apartmentId?: string;
  category?: string;
  fallbackText?: string;
  className?: string;
}

export const MediaDisplay = ({ apartmentId, category, fallbackText, className }: MediaDisplayProps) => {
  const { getFilesByFolder } = useDirectusMedia();
  const [photos, setPhotos] = useState<MediaFile[]>([]);
  const [videos, setVideos] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, [apartmentId, category]);

  const loadMedia = async () => {
    try {
      const folderName = category || `apartment-${apartmentId}`;
      
      const mediaFiles = await getFilesByFolder(folderName);
      
      // Разделяем файлы на фото и видео
      const photoFiles = mediaFiles.filter(file => 
        file.type.startsWith('image/')
      );
      const videoFiles = mediaFiles.filter(file => 
        file.type.startsWith('video/')
      );
      
      setPhotos(photoFiles);
      setVideos(videoFiles);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <SkeletonMedia />
      </div>
    );
  }

  const allMedia = [...photos, ...videos];

  if (allMedia.length === 0) {
    return (
      <div className={`text-center py-8 ${className || ''}`}>
        <p className="text-muted-foreground">
          {fallbackText || "Медиа файлы не найдены"}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="stagger-item">
          <h3 className="mb-6 uppercase text-left text-gradient">ФОТОГАЛЕРЕЯ</h3>
          
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {photos.map((photo) => (
                <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer group overflow-hidden rounded-xl shadow-gentle hover:shadow-premium transition-all duration-300 hover-lift">
                        <img
                          src={`/api/assets/${photo.id}`}
                          alt={photo.description || photo.title || photo.filename_download}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full">
                      <img
                        src={`/api/assets/${photo.id}`}
                        alt={photo.description || photo.title || photo.filename_download}
                        className="w-full h-auto max-h-[80vh] object-contain"
                        loading="lazy"
                      />
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Video Section */}
      {videos.length > 0 && (
        <div className="stagger-item">
          <h3 className="mb-6 uppercase text-left text-gradient">ВИДЕО-ОБЗОР</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="overflow-hidden rounded-xl shadow-gentle hover:shadow-premium transition-all duration-300 hover-lift">
                <video
                  controls
                  className="w-full h-64 object-cover"
                  preload="metadata"
                >
                  <source src={`/api/assets/${video.id}`} type={video.type} />
                  Ваш браузер не поддерживает воспроизведение видео.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};