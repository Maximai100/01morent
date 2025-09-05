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

// Создание клиента Directus
export const directus = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(rest())
  .with(authentication());

// Функция для аутентификации (если используется токен)
export const authenticateDirectus = async () => {
  if (DIRECTUS_TOKEN) {
    await directus.setToken(DIRECTUS_TOKEN);
  }
};

// API функции для апартаментов
export const apartmentsAPI = {
  // Получить все апартаменты
  getAll: async (): Promise<DirectusApartment[]> => {
    await authenticateDirectus();
    return await directus.request(readItems('apartments', {
      sort: ['-created_at']
    }));
  },

  // Получить апартамент по ID
  getById: async (id: string): Promise<DirectusApartment | null> => {
    await authenticateDirectus();
    try {
      const apartments = await directus.request(readItems('apartments', {
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
  create: async (apartment: Omit<DirectusApartment, 'id' | 'created_at' | 'updated_at'>): Promise<DirectusApartment> => {
    await authenticateDirectus();
    return await directus.request(createItem('apartments', apartment));
  },

  // Обновить апартамент
  update: async (id: string, apartment: Partial<DirectusApartment>): Promise<DirectusApartment> => {
    await authenticateDirectus();
    return await directus.request(updateItem('apartments', id, apartment));
  },

  // Удалить апартамент
  delete: async (id: string): Promise<void> => {
    await authenticateDirectus();
    await directus.request(deleteItem('apartments', id));
  }
};

// API функции для бронирований
export const bookingsAPI = {
  // Получить все бронирования
  getAll: async (): Promise<DirectusBooking[]> => {
    await authenticateDirectus();
    return await directus.request(readItems('bookings', {
      sort: ['-date_created']
    }));
  },

  // Получить бронирования по апартаменту
  getByApartment: async (apartmentId: string): Promise<DirectusBooking[]> => {
    await authenticateDirectus();
    return await directus.request(readItems('bookings', {
      filter: { apartment_id: { _eq: apartmentId } },
      sort: ['-date_created']
    }));
  },

  // Получить бронирование по ID
  getById: async (id: string): Promise<DirectusBooking | null> => {
    await authenticateDirectus();
    try {
      const bookings = await directus.request(readItems('bookings', {
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
      const bookings = await directus.request(readItems('bookings', {
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
    return await directus.request(createItem('bookings', booking));
  },

  // Обновить бронирование
  update: async (id: string, booking: Partial<DirectusBooking>): Promise<DirectusBooking> => {
    await authenticateDirectus();
    return await directus.request(updateItem('bookings', id, booking));
  },

  // Удалить бронирование
  delete: async (id: string): Promise<void> => {
    await authenticateDirectus();
    await directus.request(deleteItem('bookings', id));
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
  // Конвертировать апартамент из Supabase в Directus формат
  convertApartmentToDirectus: (supabaseApartment: any): Omit<DirectusApartment, 'id' | 'date_created' | 'date_updated'> => {
    return {
      title: supabaseApartment.name || 'Апартаменты Морент',
      apartment_number: supabaseApartment.number || '',
      building_number: 'Б', // По умолчанию
      base_address: supabaseApartment.address || 'Нагорный тупик 13',
      description: supabaseApartment.description,
      photos: null,
      video_entrance: null,
      video_lock: null,
      wifi_name: null,
      wifi_password: supabaseApartment.wifi_password,
      code_building: supabaseApartment.entrance_code,
      code_lock: supabaseApartment.lock_code,
      faq_checkin: null,
      faq_apartment: null,
      faq_area: null,
      map_embed_code: null,
      manager_name: 'Морент',
      manager_phone: '88007005501',
      manager_email: 'morent_sochi@mail.ru'
    };
  },

  // Конвертировать гостя из Supabase в Directus формат
  convertGuestToDirectus: (supabaseGuest: any): Omit<DirectusBooking, 'id' | 'date_created' | 'date_updated'> => {
    const slug = `${supabaseGuest.name.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}`;
    return {
      apartment_id: supabaseGuest.apartment_id,
      guest_name: supabaseGuest.name,
      checkin_date: supabaseGuest.check_in_date,
      checkout_date: supabaseGuest.check_out_date,
      slug: slug
    };
  },

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
