import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaFile {
  id: string;
  filename: string;
  file_path: string;
  file_type: 'image' | 'video';
  description: string;
}

interface MediaDisplayProps {
  category: string;
  className?: string;
}

export const MediaDisplay = ({ category, className }: MediaDisplayProps) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const { data, error } = await supabase
          .from('media_files')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setFiles(data as MediaFile[]);
        }
      } catch (error) {
        console.error('Error loading media files:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [category]);

  if (loading) {
    return <div className="text-muted-foreground">Загрузка...</div>;
  }

  if (files.length === 0) {
    return <div className="text-muted-foreground">Медиафайлы не загружены</div>;
  }

  return (
    <div className={className}>
      {files.map((file) => (
        <div key={file.id} className="mb-4">
          {file.file_type === 'image' && (
            <img
              src={file.file_path}
              alt={file.description}
              className="w-full max-w-md h-auto rounded-lg shadow-ocean"
            />
          )}
          {file.file_type === 'video' && (
            <video
              src={file.file_path}
              controls
              className="w-full max-w-md h-auto rounded-lg shadow-ocean"
            />
          )}
          {file.description && (
            <p className="text-sm text-muted-foreground mt-2">{file.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};