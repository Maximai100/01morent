# Настройка Directus для проекта MORENT

## 1. Установка и настройка Directus

### Локальная установка
```bash
# Создать новый проект Directus
npx create-directus-project@latest morent-directus

# Перейти в папку проекта
cd morent-directus

# Запустить Directus
npm run dev
```

### Облачная установка
Используйте [Directus Cloud](https://directus.cloud/) для быстрого развертывания.

## 2. Создание коллекций в Directus

### Коллекция "apartments"
Создайте коллекцию с следующими полями:

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

### Коллекция "guests"
Создайте коллекцию с следующими полями:

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

## 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Directus Configuration
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_TOKEN=your_directus_token_here
```

## 4. Получение токена доступа

1. Войдите в админ-панель Directus
2. Перейдите в Settings > Access Tokens
3. Создайте новый токен с правами на чтение/запись
4. Скопируйте токен в переменную `VITE_DIRECTUS_TOKEN`

## 5. Настройка прав доступа

### Публичные права (для гостевых страниц)
- `apartments`: Read access для всех
- `guests`: Read access для всех
- `directus_files`: Read access для всех

### Административные права (для панели менеджера)
- `apartments`: Full access для аутентифицированных пользователей
- `guests`: Full access для аутентифицированных пользователей
- `directus_files`: Full access для аутентифицированных пользователей

## 6. Миграция данных из Supabase

Используйте скрипт миграции для переноса существующих данных:

```typescript
// Пример миграции
import { apartmentsAPI, guestsAPI, dataUtils } from '@/integrations/directus/client';
import { supabase } from '@/integrations/supabase/client';

const migrateData = async () => {
  // Миграция апартаментов
  const { data: apartments } = await supabase.from('apartments').select('*');
  
  for (const apartment of apartments || []) {
    const directusApartment = dataUtils.convertApartmentToDirectus(apartment);
    await apartmentsAPI.create(directusApartment);
  }
  
  // Миграция гостей
  const { data: guests } = await supabase.from('guests').select('*');
  
  for (const guest of guests || []) {
    const directusGuest = dataUtils.convertGuestToDirectus(guest);
    await guestsAPI.create(directusGuest);
  }
};
```

## 7. Тестирование интеграции

После настройки проверьте работу интеграции:

1. Запустите приложение: `npm run dev`
2. Перейдите в панель менеджера
3. Создайте новый апартамент
4. Проверьте, что данные сохранились в Directus
5. Создайте бронирование
6. Проверьте отображение данных на гостевой странице

## 8. Дополнительные настройки

### Webhooks
Настройте webhooks в Directus для уведомлений о:
- Новых бронированиях
- Изменениях статуса
- Обновлениях апартаментов

### API Rate Limiting
Настройте ограничения на количество запросов к API для защиты от злоупотреблений.

### Backup
Настройте автоматическое резервное копирование базы данных Directus.
