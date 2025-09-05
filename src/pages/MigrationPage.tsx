import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataMigration from "@/components/DataMigration";

const MigrationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-wave p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Button>
          
          <h1 className="text-4xl font-bold font-playfair text-primary mb-2">
            Миграция данных
          </h1>
          <p className="text-muted-foreground">
            Перенос данных из Supabase в Directus CMS
          </p>
        </div>

        <DataMigration />
      </div>
    </div>
  );
};

export default MigrationPage;
