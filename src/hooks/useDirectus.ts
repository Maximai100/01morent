import { useState, useEffect, useCallback } from 'react';
import { apartmentsAPI, bookingsAPI, mediaAPI, DirectusApartment, DirectusBooking } from '@/integrations/directus/client';
import { toast } from 'sonner';

// Хук для работы с апартаментами через Directus
export const useDirectusApartments = () => {
  const [apartments, setApartments] = useState<DirectusApartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadApartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apartmentsAPI.getAll();
      setApartments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки апартаментов';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createApartment = useCallback(async (apartmentData: Omit<DirectusApartment, 'id' | 'date_created' | 'date_updated'>) => {
    try {
      const newApartment = await apartmentsAPI.create(apartmentData);
      setApartments(prev => [newApartment, ...prev]);
      toast.success('Апартамент создан успешно');
      return newApartment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания апартамента';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateApartment = useCallback(async (id: string, apartmentData: Partial<DirectusApartment>) => {
    try {
      const updatedApartment = await apartmentsAPI.update(id, apartmentData);
      setApartments(prev => prev.map(apt => apt.id === id ? updatedApartment : apt));
      toast.success('Апартамент обновлен успешно');
      return updatedApartment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления апартамента';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteApartment = useCallback(async (id: string) => {
    try {
      await apartmentsAPI.delete(id);
      setApartments(prev => prev.filter(apt => apt.id !== id));
      toast.success('Апартамент удален успешно');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления апартамента';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const getApartmentById = useCallback(async (id: string): Promise<DirectusApartment | null> => {
    try {
      return await apartmentsAPI.getById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки апартамента';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  useEffect(() => {
    loadApartments();
  }, [loadApartments]);

  return {
    apartments,
    loading,
    error,
    loadApartments,
    createApartment,
    updateApartment,
    deleteApartment,
    getApartmentById
  };
};

// Хук для работы с бронированиями через Directus
export const useDirectusBookings = () => {
  const [bookings, setBookings] = useState<DirectusBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки бронирований';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (bookingData: Omit<DirectusBooking, 'id' | 'date_created' | 'date_updated'>) => {
    try {
      const newBooking = await bookingsAPI.create(bookingData);
      setBookings(prev => [newBooking, ...prev]);
      toast.success('Бронирование создано успешно');
      return newBooking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания бронирования';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateBooking = useCallback(async (id: string, bookingData: Partial<DirectusBooking>) => {
    try {
      const updatedBooking = await bookingsAPI.update(id, bookingData);
      setBookings(prev => prev.map(booking => booking.id === id ? updatedBooking : booking));
      toast.success('Бронирование обновлено успешно');
      return updatedBooking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления бронирования';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteBooking = useCallback(async (id: string) => {
    try {
      await bookingsAPI.delete(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast.success('Бронирование удалено успешно');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления бронирования';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const getBookingsByApartment = useCallback(async (apartmentId: string): Promise<DirectusBooking[]> => {
    try {
      return await bookingsAPI.getByApartment(apartmentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки бронирований';
      toast.error(errorMessage);
      return [];
    }
  }, []);

  const getBookingById = useCallback(async (id: string): Promise<DirectusBooking | null> => {
    try {
      return await bookingsAPI.getById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки бронирования';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const getBookingBySlug = useCallback(async (slug: string): Promise<DirectusBooking | null> => {
    try {
      return await bookingsAPI.getBySlug(slug);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки бронирования';
      toast.error(errorMessage);
      return null;
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return {
    bookings,
    loading,
    error,
    loadBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingsByApartment,
    getBookingById,
    getBookingBySlug
  };
};

// Хук для работы с медиафайлами через Directus
export const useDirectusMedia = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, folder?: string) => {
    setUploading(true);
    setError(null);
    
    try {
      const uploadedFile = await mediaAPI.upload(file, folder);
      toast.success('Файл загружен успешно');
      return uploadedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки файла';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const getFilesByFolder = useCallback(async (folder: string) => {
    try {
      return await mediaAPI.getByFolder(folder);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки файлов';
      toast.error(errorMessage);
      return [];
    }
  }, []);

  const deleteFile = useCallback(async (id: string) => {
    try {
      await mediaAPI.delete(id);
      toast.success('Файл удален успешно');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления файла';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    uploading,
    error,
    uploadFile,
    getFilesByFolder,
    deleteFile
  };
};

