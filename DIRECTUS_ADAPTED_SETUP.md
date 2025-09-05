# Настройка Directus для проекта MORENT (Адаптированная версия)

## 🎯 Обзор

Проект MORENT теперь полностью адаптирован под ваши существующие коллекции в Directus. Интеграция использует вашу текущую структуру данных без необходимости создания новых коллекций.

## 📊 Структура ваших коллекций

### **Коллекция "apartments"**
Ваша коллекция уже содержит все необходимые поля:

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID | Уникальный идентификатор |
| `date_created` | DateTime | Дата создания |
| `date_updated` | DateTime | Дата обновления |
| `title` | String | Название апартамента |
| `apartment_number` | String | Номер апартамента |
| `building_number` | String | Номер корпуса (А, Б, В) |
| `base_address` | String | Базовый адрес |
| `description` | Text | Описание апартамента |
| `photos` | File | Фотографии |
| `video_entrance` | File | Видео подъезда |
| `video_lock` | File | Видео замка |
| `wifi_name` | String | Название WiFi |
| `wifi_password` | String | Пароль WiFi |
| `code_building` | String | Код подъезда |
| `code_lock` | String | Код замка |
| `faq_checkin` | Text | FAQ по заселению |
| `faq_apartment` | Text | FAQ по апартаменту |
| `faq_area` | Text | FAQ по территории |
| `map_embed_code` | Text | Код карты |
| `manager_name` | String | Имя менеджера |
| `manager_phone` | String | Телефон менеджера |
| `manager_email` | String | Email менеджера |

### **Коллекция "bookings"**
Ваша коллекция бронирований:

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | UUID | Уникальный идентификатор |
| `date_created` | DateTime | Дата создания |
| `date_updated` | DateTime | Дата обновления |
| `guest_name` | String | Имя гостя |
| `checkin_date` | DateTime | Дата заезда |
| `checkout_date` | DateTime | Дата выезда |
| `apartment_id` | UUID | Ссылка на апартамент |
| `slug` | String | Уникальный слаг для ссылки |

## 🚀 Быстрый старт

### 1. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Directus Configuration
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_TOKEN=your_directus_token_here
```

### 2. Получение токена доступа

1. Войдите в админ-панель Directus
2. Перейдите в **Settings** → **Access Tokens**
3. Создайте новый токен с правами на чтение/запись
4. Скопируйте токен в переменную `VITE_DIRECTUS_TOKEN`

### 3. Настройка прав доступа

#### Публичные права (для гостевых страниц)
- `apartments`: Read access для всех
- `bookings`: Read access для всех
- `directus_files`: Read access для всех

#### Административные права (для панели менеджера)
- `apartments`: Full access для аутентифицированных пользователей
- `bookings`: Full access для аутентифицированных пользователей
- `directus_files`: Full access для аутентифицированных пользователей

## 📱 Использование в приложении

### Доступные страницы

1. **Главная страница** (`/`) - Выбор между Supabase и Directus версиями
2. **Управление апартаментами (Directus)** (`/apartments-directus`) - Полнофункциональное управление через Directus
3. **Детальное управление апартаментом** (`/apartment/:id/manage-directus`) - Управление бронированиями
4. **Миграция данных** (`/migration`) - Перенос данных из Supabase в Directus

### Функциональность

#### Управление апартаментами
- ✅ Создание новых апартаментов
- ✅ Редактирование существующих апартаментов
- ✅ Удаление апартаментов
- ✅ Управление корпусами (А, Б, В)
- ✅ Настройка WiFi и кодов доступа
- ✅ Управление контактной информацией менеджера

#### Управление бронированиями
- ✅ Создание бронирований
- ✅ Редактирование информации о гостях
- ✅ Генерация уникальных слагов
- ✅ Отслеживание дат заезда/выезда
- ✅ Связывание с апартаментами

#### Миграция данных
- ✅ Автоматический перенос апартаментов из Supabase
- ✅ Перенос всех бронирований
- ✅ Сохранение связей между апартаментами и гостями
- ✅ Прогресс-бар миграции

## 🔧 API функции

### Апартаменты
```typescript
import { apartmentsAPI } from '@/integrations/directus/client';

// Получить все апартаменты
const apartments = await apartmentsAPI.getAll();

// Создать новый апартамент
const newApartment = await apartmentsAPI.create({
  title: "Апартаменты Морент",
  apartment_number: "169",
  building_number: "Б",
  base_address: "Нагорный тупик 13"
});

// Обновить апартамент
await apartmentsAPI.update(apartmentId, { 
  wifi_password: "новый_пароль" 
});

// Удалить апартамент
await apartmentsAPI.delete(apartmentId);
```

### Бронирования
```typescript
import { bookingsAPI } from '@/integrations/directus/client';

// Получить бронирования по апартаменту
const bookings = await bookingsAPI.getByApartment(apartmentId);

// Создать новое бронирование
const newBooking = await bookingsAPI.create({
  apartment_id: apartmentId,
  guest_name: "Иван Иванов",
  checkin_date: "2025-06-08T15:00:00Z",
  checkout_date: "2025-06-09T12:00:00Z",
  slug: "иван.иванов.1757086020906"
});

// Получить бронирование по слагу
const booking = await bookingsAPI.getBySlug("иван.иванов.1757086020906");
```

## 🎨 Хуки React

### useDirectusApartments
```typescript
import { useDirectusApartments } from '@/hooks/useDirectus';

const {
  apartments,
  loading,
  error,
  createApartment,
  updateApartment,
  deleteApartment
} = useDirectusApartments();
```

### useDirectusBookings
```typescript
import { useDirectusBookings } from '@/hooks/useDirectus';

const {
  bookings,
  loading,
  error,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByApartment,
  getBookingBySlug
} = useDirectusBookings();
```

## 🛠️ Утилиты

### dataUtils
```typescript
import { dataUtils } from '@/integrations/directus/client';

// Генерировать слаг для бронирования
const slug = dataUtils.generateSlug("Иван Иванов");

// Получить полный адрес апартамента
const address = dataUtils.getFullAddress(apartment);

// Получить отображаемое название
const name = dataUtils.getDisplayName(apartment);
```

## 🔄 Миграция данных

### Автоматическая миграция
1. Перейдите на страницу `/migration`
2. Нажмите "Начать миграцию"
3. Дождитесь завершения процесса
4. Проверьте данные в Directus

### Ручная миграция
```typescript
import { useDataMigration } from '@/hooks/useDirectus';

const { migrating, progress, migrateFromSupabase } = useDataMigration();

// Запустить миграцию
await migrateFromSupabase();
```

## 🎯 Особенности адаптации

### Соответствие полей
- `name` → `title`
- `number` → `apartment_number`
- `address` → `base_address`
- `entrance_code` → `code_building`
- `lock_code` → `code_lock`
- `guests` → `bookings`

### Новые возможности
- Управление корпусами (А, Б, В)
- Разделение WiFi названия и пароля
- Уникальные слаги для бронирований
- Расширенная контактная информация
- FAQ секции для апартаментов

## 🚀 Развертывание

### Локальная разработка
```bash
# Установить зависимости
npm install

# Запустить приложение
npm run dev
```

### Продакшн
1. Обновите переменные окружения
2. Убедитесь в правильности прав доступа
3. Выполните миграцию данных (если нужно)
4. Протестируйте все функции

## 📊 Мониторинг

### Проверка интеграции
1. Откройте `/apartments-directus`
2. Проверьте загрузку апартаментов
3. Создайте тестовый апартамент
4. Создайте тестовое бронирование
5. Проверьте генерацию ссылок

### Логи и ошибки
- Все ошибки отображаются через toast уведомления
- Логи доступны в консоли браузера
- API ошибки логируются в консоль

## 🎉 Заключение

Интеграция полностью адаптирована под ваши существующие коллекции Directus. Теперь вы можете:

- Использовать существующие данные без изменений
- Управлять апартаментами через удобный интерфейс
- Создавать и отслеживать бронирования
- Генерировать персонализированные ссылки для гостей
- Мигрировать данные из Supabase при необходимости

Все функции работают с вашей текущей структурой данных!
