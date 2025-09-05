# Интеграция с Directus CMS

## 🎯 Обзор

Проект MORENT теперь поддерживает интеграцию с Directus CMS для управления апартаментами и бронированиями. Это позволяет использовать мощные возможности Directus для управления контентом, включая:

- **Управление контентом**: Интуитивный интерфейс для создания и редактирования апартаментов
- **Медиа-библиотека**: Централизованное хранение и управление фотографиями и видео
- **API**: RESTful и GraphQL API для интеграции с внешними системами
- **Права доступа**: Гибкая система ролей и разрешений
- **Версионирование**: Отслеживание изменений в данных

## 🚀 Быстрый старт

### 1. Установка Directus

#### Локальная установка
```bash
# Создать новый проект Directus
npx create-directus-project@latest morent-directus

# Перейти в папку проекта
cd morent-directus

# Запустить Directus
npm run dev
```

#### Облачная установка
Используйте [Directus Cloud](https://directus.cloud/) для быстрого развертывания.

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Directus Configuration
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_TOKEN=your_directus_token_here
```

### 3. Создание коллекций в Directus

#### Коллекция "apartments"
| Поле | Тип | Настройки |
|------|-----|-----------|
| id | UUID | Primary Key, Auto-generate |
| name | String | Required |
| number | String | Required |
| description | Text | Optional |
| address | String | Optional |
| wifi_password | String | Optional |
| entrance_code | String | Optional |
| lock_code | String | Optional |
| hero_title | String | Optional |
| hero_subtitle | String | Optional |
| contact_info | JSON | Optional |
| map_coordinates | JSON | Optional |
| loyalty_info | Text | Optional |
| faq_data | JSON | Optional |
| status | String | Dropdown: active, inactive, maintenance |
| created_at | DateTime | Auto-generate |
| updated_at | DateTime | Auto-generate |

#### Коллекция "guests"
| Поле | Тип | Настройки |
|------|-----|-----------|
| id | UUID | Primary Key, Auto-generate |
| apartment_id | UUID | Foreign Key to apartments |
| name | String | Required |
| check_in_date | DateTime | Required |
| check_out_date | DateTime | Required |
| guide_link | String | Optional |
| status | String | Dropdown: pending, confirmed, checked_in, checked_out, cancelled |
| contact_email | String | Optional |
| contact_phone | String | Optional |
| special_requests | Text | Optional |
| created_at | DateTime | Auto-generate |
| updated_at | DateTime | Auto-generate |

## 📱 Использование в приложении

### Доступные страницы

1. **Главная страница** (`/`) - Выбор между Supabase и Directus версиями
2. **Управление апартаментами (Directus)** (`/apartments-directus`) - Полнофункциональное управление через Directus
3. **Детальное управление апартаментом** (`/apartment/:id/manage-directus`) - Управление гостями конкретного апартамента
4. **Миграция данных** (`/migration`) - Перенос данных из Supabase в Directus

### Функциональность

#### Управление апартаментами
- ✅ Создание новых апартаментов
- ✅ Редактирование существующих апартаментов
- ✅ Удаление апартаментов
- ✅ Управление статусами (активен, неактивен, на обслуживании)
- ✅ Настройка контактной информации и координат

#### Управление гостями
- ✅ Создание бронирований
- ✅ Редактирование информации о гостях
- ✅ Управление статусами бронирований
- ✅ Генерация персонализированных ссылок для гостей
- ✅ Отслеживание контактной информации

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
  name: "Люкс у моря",
  number: "169",
  status: "active"
});

// Обновить апартамент
await apartmentsAPI.update(apartmentId, { status: "maintenance" });

// Удалить апартамент
await apartmentsAPI.delete(apartmentId);
```

### Гости
```typescript
import { guestsAPI } from '@/integrations/directus/client';

// Получить гостей по апартаменту
const guests = await guestsAPI.getByApartment(apartmentId);

// Создать новое бронирование
const newGuest = await guestsAPI.create({
  apartment_id: apartmentId,
  name: "Иван Иванов",
  check_in_date: "2025-06-08T15:00:00Z",
  check_out_date: "2025-06-09T12:00:00Z",
  status: "pending"
});
```

### Медиафайлы
```typescript
import { mediaAPI } from '@/integrations/directus/client';

// Загрузить файл
const file = await mediaAPI.upload(fileObject, 'apartment-photos');

// Получить файлы по папке
const files = await mediaAPI.getByFolder('apartment-photos');
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

### useDirectusGuests
```typescript
import { useDirectusGuests } from '@/hooks/useDirectus';

const {
  guests,
  loading,
  error,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestsByApartment
} = useDirectusGuests();
```

### useDataMigration
```typescript
import { useDataMigration } from '@/hooks/useDirectus';

const {
  migrating,
  progress,
  migrateFromSupabase
} = useDataMigration();
```

## 🔐 Безопасность

### Настройка прав доступа

#### Публичные права (для гостевых страниц)
- `apartments`: Read access для всех
- `guests`: Read access для всех
- `directus_files`: Read access для всех

#### Административные права (для панели менеджера)
- `apartments`: Full access для аутентифицированных пользователей
- `guests`: Full access для аутентифицированных пользователей
- `directus_files`: Full access для аутентифицированных пользователей

### Получение токена доступа

1. Войдите в админ-панель Directus
2. Перейдите в Settings > Access Tokens
3. Создайте новый токен с правами на чтение/запись
4. Скопируйте токен в переменную `VITE_DIRECTUS_TOKEN`

## 🚀 Развертывание

### Локальная разработка
```bash
# Установить зависимости
npm install

# Запустить Directus
cd morent-directus && npm run dev

# Запустить приложение
npm run dev
```

### Продакшн
1. Разверните Directus на вашем сервере
2. Настройте переменные окружения
3. Создайте коллекции и настройте права доступа
4. Выполните миграцию данных
5. Обновите переменные окружения в приложении

## 📊 Мониторинг и аналитика

Directus предоставляет встроенные возможности для:
- Отслеживания изменений в данных
- Аналитики использования API
- Мониторинга производительности
- Логирования операций

## 🔄 Синхронизация данных

После миграции вы можете:
- Использовать обе системы параллельно
- Синхронизировать данные между Supabase и Directus
- Постепенно переходить на Directus
- Сохранить резервные копии в Supabase

## 📞 Поддержка

При возникновении проблем:
1. Проверьте настройки Directus
2. Убедитесь в правильности переменных окружения
3. Проверьте права доступа к коллекциям
4. Обратитесь к документации Directus

## 🎉 Заключение

Интеграция с Directus значительно расширяет возможности управления контентом в проекте MORENT, предоставляя:

- Более гибкое управление данными
- Улучшенный пользовательский интерфейс
- Мощные API для интеграций
- Централизованное управление медиафайлами
- Расширенные возможности аналитики

Теперь вы можете эффективно управлять апартаментами и бронированиями через современную CMS платформу!
