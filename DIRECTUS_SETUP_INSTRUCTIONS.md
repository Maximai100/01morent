# Настройка Directus для проекта Morent

## Проблема
Приложение не может подключиться к Directus из-за ошибки 403. Это означает, что не настроены переменные окружения.

## Решение

### 1. Создайте файл `.env` в корне проекта

Создайте файл `.env` со следующим содержимым:

```env
# Directus Configuration
VITE_DIRECTUS_URL=https://1.cycloscope.online
VITE_DIRECTUS_TOKEN=your_directus_token_here

# Collection names (if different from default)
VITE_APARTMENTS_COLLECTION=apartments
VITE_BOOKINGS_COLLECTION=bookings
```

### 2. Получите токен доступа в Directus

1. Откройте админ-панель Directus: https://1.cycloscope.online/admin
2. Войдите в систему
3. Перейдите в **Settings** > **Access Tokens**
4. Создайте новый токен с правами:
   - **Read** для коллекций `apartments` и `bookings`
   - **Create, Update, Delete** для коллекций `apartments` и `bookings`
   - **Read, Create, Update, Delete** для коллекции `directus_files`
5. Скопируйте созданный токен

### 3. Обновите файл `.env`

Замените `your_directus_token_here` на ваш реальный токен:

```env
VITE_DIRECTUS_URL=https://1.cycloscope.online
VITE_DIRECTUS_TOKEN=abc123def456ghi789...
```

### 4. Проверьте имена коллекций (если нужно)

Если у вас коллекции называются по-другому (не `apartments` и `bookings`), обновите переменные в `.env`:

```env
VITE_APARTMENTS_COLLECTION=your_apartments_collection_name
VITE_BOOKINGS_COLLECTION=your_bookings_collection_name
```

**Как узнать имена коллекций:**
1. Откройте админ-панель Directus
2. Перейдите в **Content** → **Collections**
3. Найдите ваши коллекции и скопируйте их точные имена

### 5. Перезапустите приложение

После создания файла `.env` перезапустите сервер разработки:

```bash
npm run dev
```

## Проверка подключения

После настройки переменных окружения:

1. Откройте страницу "Управление апартаментами"
2. Апартаменты должны загрузиться из Directus
3. Вы сможете создавать новые бронирования

## Безопасность

⚠️ **Важно**: Файл `.env` содержит секретные данные и не должен попадать в репозиторий. Убедитесь, что он добавлен в `.gitignore`.

## Альтернативное решение

Если у вас нет доступа к созданию токенов, можно настроить публичный доступ к коллекциям в Directus:

1. В админ-панели Directus перейдите в **Settings** > **Roles & Permissions**
2. Выберите роль **Public**
3. Дайте права на чтение коллекций `apartments` и `bookings`
4. В этом случае токен не нужен, но функционал будет ограничен только чтением
