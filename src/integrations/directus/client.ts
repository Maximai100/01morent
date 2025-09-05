import { createDirectus, rest, authentication, readItems, createItem, updateItem, deleteItem, uploadFiles } from '@directus/sdk';

// Типы для Directus коллекций (адаптированы под существующую схему)
export interface DirectusApartment {
  id: string;
  date_created: string;
  date_updated: string | null;
  title: string;
  apartment_number: string;
  building_number: string;
  base_address: string;
  description: string | null;
  photos: string | null; // File ID в Directus
  video_entrance: string | null; // File ID в Directus
  video_lock: string | null; // File ID в Directus
  wifi_name: string | null;
  wifi_password: string | null;
  code_building: string | null;
  code_lock: string | null;
  faq_checkin: string | null;
  faq_apartment: string | null;
  faq_area: string | null;
  map_embed_code: string | null;
  manager_name: string | null;
  manager_phone: string | null;
  manager_email: string | null;
}

export interface DirectusBooking {
  id: string;
  date_created: string;
  date_updated: string | null;
  guest_name: string;
  checkin_date: string;
  checkout_date: string;
  apartment_id: string;
  slug: string;
}

export interface DirectusMediaFile {
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
  uploaded_by?: string;
  uploaded_on: string;
  modified_by?: string;
  modified_on: string;
  storage: string;
  metadata?: any;
}

export interface DirectusSchema {
  apartments: DirectusApartment[];
  bookings: DirectusBooking[];
  directus_files: DirectusMediaFile[];
}

// Конфигурация Directus
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN || '';
const APARTMENTS_COLLECTION = import.meta.env.VITE_APARTMENTS_COLLECTION || 'apartments';
const BOOKINGS_COLLECTION = import.meta.env.VITE_BOOKINGS_COLLECTION || 'bookings';

// Создание клиента Directus
export const directus = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(rest())
  .with(authentication());

// Функция для аутентификации (если используется токен)
export const authenticateDirectus = async () => {
  if (DIRECTUS_TOKEN) {
    try {
      await directus.setToken(DIRECTUS_TOKEN);
      console.log('Directus token set successfully');
    } catch (error) {
      console.error('Error setting Directus token:', error);
      throw error;
    }
  } else {
    console.warn('No Directus token provided');
  }
};

// API функции для апартаментов
export const apartmentsAPI = {
  // Получить все апартаменты
  getAll: async (): Promise<DirectusApartment[]> => {
    await authenticateDirectus();
    try {
      console.log('Fetching apartments from Directus...');
      const result = await directus.request(readItems(APARTMENTS_COLLECTION, {
        sort: ['-date_created']
      }));
      console.log('Apartments fetched successfully:', result.length, 'items');
      return result;
    } catch (error) {
      console.error('Error fetching apartments:', error);
      throw error;
    }
  },

  // Получить апартамент по ID
  getById: async (id: string): Promise<DirectusApartment | null> => {
    await authenticateDirectus();
    try {
      const apartments = await directus.request(readItems(APARTMENTS_COLLECTION, {
        filter: { id: { _eq: id } },
        limit: 1
      }));
      return apartments[0] || null;
    } catch (error) {
      console.error('Error fetching apartment:', error);
      return null;
    }
  },

  // Создать новый апартамент
  create: async (apartment: Omit<DirectusApartment, 'id' | 'date_created' | 'date_updated'>): Promise<DirectusApartment> => {
    await authenticateDirectus();
    return await directus.request(createItem(APARTMENTS_COLLECTION, apartment));
  },

  // Обновить апартамент
  update: async (id: string, apartment: Partial<DirectusApartment>): Promise<DirectusApartment> => {
    await authenticateDirectus();
    return await directus.request(updateItem(APARTMENTS_COLLECTION, id, apartment));
  },

  // Удалить апартамент
  delete: async (id: string): Promise<void> => {
    await authenticateDirectus();
    await directus.request(deleteItem(APARTMENTS_COLLECTION, id));
  }
};

// API функции для бронирований
export const bookingsAPI = {
  // Получить все бронирования
  getAll: async (): Promise<DirectusBooking[]> => {
    await authenticateDirectus();
    return await directus.request(readItems(BOOKINGS_COLLECTION, {
      sort: ['-date_created']
    }));
  },

  // Получить бронирования по апартаменту
  getByApartment: async (apartmentId: string): Promise<DirectusBooking[]> => {
    await authenticateDirectus();
    return await directus.request(readItems(BOOKINGS_COLLECTION, {
      filter: { apartment_id: { _eq: apartmentId } },
      sort: ['-date_created']
    }));
  },

  // Получить бронирование по ID
  getById: async (id: string): Promise<DirectusBooking | null> => {
    await authenticateDirectus();
    try {
      const bookings = await directus.request(readItems(BOOKINGS_COLLECTION, {
        filter: { id: { _eq: id } },
        limit: 1
      }));
      return bookings[0] || null;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  },

  // Получить бронирование по слагу
  getBySlug: async (slug: string): Promise<DirectusBooking | null> => {
    await authenticateDirectus();
    try {
      const bookings = await directus.request(readItems(BOOKINGS_COLLECTION, {
        filter: { slug: { _eq: slug } },
        limit: 1
      }));
      return bookings[0] || null;
    } catch (error) {
      console.error('Error fetching booking by slug:', error);
      return null;
    }
  },

  // Создать новое бронирование
  create: async (booking: Omit<DirectusBooking, 'id' | 'date_created' | 'date_updated'>): Promise<DirectusBooking> => {
    await authenticateDirectus();
    return await directus.request(createItem(BOOKINGS_COLLECTION, booking));
  },

  // Обновить бронирование
  update: async (id: string, booking: Partial<DirectusBooking>): Promise<DirectusBooking> => {
    await authenticateDirectus();
    return await directus.request(updateItem(BOOKINGS_COLLECTION, id, booking));
  },

  // Удалить бронирование
  delete: async (id: string): Promise<void> => {
    await authenticateDirectus();
    await directus.request(deleteItem(BOOKINGS_COLLECTION, id));
  }
};

// API функции для медиафайлов
export const mediaAPI = {
  // Загрузить файл
  upload: async (file: File, folder?: string): Promise<DirectusMediaFile> => {
    await authenticateDirectus();
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }
    
    const files = await directus.request(uploadFiles(formData));
    return files[0];
  },

  // Получить файлы по папке
  getByFolder: async (folder: string): Promise<DirectusMediaFile[]> => {
    await authenticateDirectus();
    return await directus.request(readItems('directus_files', {
      filter: { folder: { _eq: folder } },
      sort: ['-uploaded_on']
    }));
  },

  // Удалить файл
  delete: async (id: string): Promise<void> => {
    await authenticateDirectus();
    await directus.request(deleteItem('directus_files', id));
  }
};

// Утилиты для работы с данными
export const dataUtils = {
  // Генерировать слаг для бронирования
  generateSlug: (guestName: string): string => {
    const cleanName = guestName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
    return `${cleanName}.${Date.now()}`;
  },

  // Получить полный адрес апартамента
  getFullAddress: (apartment: DirectusApartment): string => {
    return `${apartment.base_address}, корпус ${apartment.building_number}, апартаменты ${apartment.apartment_number}`;
  },

  // Получить отображаемое название апартамента
  getDisplayName: (apartment: DirectusApartment): string => {
    return `${apartment.title} ${apartment.apartment_number}${apartment.building_number}`;
  }
};

export default directus;
