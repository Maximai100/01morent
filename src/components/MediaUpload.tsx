import { useState, useEffect } from "react";
import { useDirectusMedia } from "@/hooks/useDirectus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Video } from "lucide-react";

interface MediaUploadProps {
  category: string;
  title: string;
  onUploadSuccess?: () => void;
}

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

export const MediaUpload = ({ category, title, onUploadSuccess }: MediaUploadProps) => {
  const { uploadFile, getFilesByFolder } = useDirectusMedia();
  const { toast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadFiles();
  }, [category]);

  const loadFiles = async () => {
    try {
      const mediaFiles = await getFilesByFolder(category);
      setFiles(mediaFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список файлов",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(fileList)) {
        await uploadFile(file, category);
      }

      toast({
        title: "Файлы загружены!",
        description: `Успешно загружено ${fileList.length} файл(ов)`,
      });

      setDescription("");
      loadFiles();
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить файлы",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (type.startsWith('video/')) {
      return <Video className="w-4 h-4" />;
    }
    return <Upload className="w-4 h-4" />;
  };

  return (
    <Card className="w-full">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        {/* Upload Section */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="file-upload">Выберите файлы</Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Описание (опционально)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание файлов..."
              className="mt-1"
            />
          </div>
          
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Загрузка...' : 'Загрузить файлы'}
          </Button>
        </div>

        {/* Files List */}
        <div className="space-y-2">
          <h4 className="font-medium">Загруженные файлы ({files.length})</h4>
          {files.length === 0 ? (
            <p className="text-muted-foreground text-sm">Файлы не найдены</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium">
                        {file.title || file.filename_download}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.filesize)} • {file.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement delete functionality
                      console.log('Delete file:', file.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};