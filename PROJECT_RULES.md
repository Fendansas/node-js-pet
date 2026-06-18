# Правила проекта Node.js (Express 5 + Mongoose)

## 📋 Структура проекта

```
├── app.js                  # Точка входа, настройка сервера
├── config/
│   └── db.js               # Подключение к MongoDB
├── controllers/            # Логика обработки запросов
│   ├── base.controller.js  # Базовый контроллер с общими методами
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── admin.controller.js
│   ├── post.controller.js
│   ├── product.controller.js
│   ├── task.controller.js
│   ├── event.controller.js
│   ├── anomaly.controller.js
│   └── index.controller.js
├── models/                 # Mongoose-схемы и модели
│   ├── user.js
│   ├── role.js
│   ├── permission.js
│   ├── post.js
│   ├── product.js
│   ├── task.js
│   ├── event.js
│   └── Anomaly.js
├── routes/                 # Маршруты Express
│   ├── index.js            # Главный роутер
│   ├── index.routes.js
│   ├── auth.routes.js
│   ├── profile.routes.js
│   ├── admin.routes.js
│   ├── post.routes.js
│   ├── product.routes.js
│   ├── task.routes.js
│   ├── event.routes.js
│   ├── anomaly.routes.js
│   └── api.routes.js
├── services/               # Бизнес-логика
│   ├── auth.service.js
│   ├── user.service.js
│   ├── rbac.service.js     # Ролевой доступ
│   ├── post.service.js
│   ├── product.service.js
│   ├── task.service.js
│   ├── event.service.js
│   ├── anomaly.service.js
│   └── avatar.service.js   # Работа с GridFS
├── middleware/             # Express-мидлвары
│   ├── auth.middleware.js  # Аутентификация
│   ├── current-user.middleware.js
│   ├── attachUser.js       # Подключение пользователя к запросу
│   ├── online.middleware.js
│   ├── admin.middleware.js
│   ├── permission.middleware.js
│   ├── validation.middleware.js
│   ├── upload.js           # Настройки Multer
│   └── upload.middleware.js
├── validators/             # Валидация данных (express-validator)
│   ├── auth.validator.js
│   ├── user.validator.js
│   ├── post.validator.js
│   ├── product.validator.js
│   ├── task.validator.js
│   ├── event.validator.js
│   ├── rbac.validator.js
│   └── anomaly.validator.js
├── database/
│   └── seeders/            # Сеeding данных
│       ├── rbac.seed.js
│       └── admin.seed.js
├── views/                  # EJS-шаблоны
│   ├── partials/           # Переиспользуемые части (header, footer)
│   ├── admin/              # Админ-панель
│   ├── errors/             # Страницы ошибок
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── profile.ejs
│   ├── edit-profile.ejs
│   ├── posts/
│   ├── products/
│   ├── tasks/
│   ├── events/
│   └── anomaly/
├── public/                 # Статические файлы (CSS, JS, img)
└── exports/
```

## 🏗 Архитектурные правила

### 1. Слои приложения (MVC + Services)

Каждый ресурс имеет чёткое разделение:

```
Запрос → Routes → Controllers → Services → Models
                    ↓
              Validators (до контроллера)
              Middleware (до маршрута)
```

- **Routes** — только определение маршрутов и привязка к контроллерам
- **Controllers** — обработка HTTP-запросов, вызов сервисов, отправка ответов
- **Services** — чистая бизнес-логика, без HTTP-зависимостей
- **Models** — Mongoose-схемы, валидации на уровне БД
- **Validators** — схема валидации express-validator для маршрута
- **Middleware** — сквозная логика (аутентификация, авторизация, онлайн-статус)

### 2. Именование файлов

- Файлы: `kebab-case` (`auth.controller.js`, `user.service.js`)
- Экспорты: `camelCase` (`export const authController`, `export default User`)
- Переменные: `camelCase`
- Константы: `UPPER_SNAKE_CASE`

### 3. Экспорты

- **Controllers, Services, Validators** — named exports (`export const name`)
- **Models, Routes** — default export (`export default Model`)
- **app.js** — `export const app` для тестирования

### 4. Async/Await

- Всегда используй `async/await`, не используй `.then()`
- Облавливай ошибки через try/catch в контроллерах или через глобальный error handler
- В middleware используй `(req, res, next)` с async/await

### 5. Импорт

- Используй только ES Module imports (`import ... from ...`)
- Динамические импорты — только для опциональной подгрузки (`await import()`)
- Все пути импорта — относительные, с `.js` расширением

## 📝 Правила написания кода

### Контроллеры

```javascript
export const getPosts = async (req, res) => {
    try {
        const { posts, total } = await postService.getPosts(req.query);
        res.json({ success: true, data: posts, total });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};
```

- Всегда оборачивай логику в `try/catch`
- Возвращай единый формат ответа: `{ success: boolean, data?: any, message?: string }`
- Логируй ошибки в `console.error`

### Сервисы

```javascript
export const getPosts = async (query = {}) => {
    const posts = await Post.find(query).populate('author');
    return posts;
};
```

- Не используй `req`, `res`, `next` — только бизнес-логику
- Принимай параметры, возвращай данные
- Не отправляй HTTP-ответы

### Middleware

```javascript
export const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user?.permissions.includes(permission)) {
            return res.status(403).json({ success: false, message: 'Доступ запрещён' });
        }
        next();
    };
};
```

- Факторизуй мидлвары с параметрами через higher-order function
- Всегда вызывай `next()` в конце, если доступ разрешён

### Валидаторы

```javascript
import { body, query } from 'express-validator';

export const createPostValidator = [
    body('title').trim().notEmpty().withMessage('Заголовок обязателен'),
    body('content').trim().notEmpty().withMessage('Содержимое обязательно'),
];
```

- Группируй валидации по маршруту
- Используй `express-validator`
- Возвращай сообщения на русском

### Модели (Mongoose)

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

- Используй `timestamps: true` для учёта createdAt/updatedAt
- Связи через `ref` + `.populate()`
- Все поля с типами и валидацией

## 🔐 Аутентификация и авторизация

### Поток аутентификации

1. **express-session** + **MongoStore** для хранения сессий
2. **bcrypt** для хеширования паролей
3. Пользователь загружается в `req.user` через `attachUser` middleware
4. Проверка прав через `permission.middleware.js`

### Роли и права

- RBAC (Role-Based Access Control) через модели `Role` и `Permission`
- Проверка прав через middleware `checkPermission(permission)`
- Админ-панель в отдельной директории `views/admin/`

## 🖼 Загрузка файлов

- Используем **Multer** + **GridFS** для хранения в MongoDB
- Лимит файла: 5MB (настроено в middleware)
- Аватары хранятся в GridFS, отдаются через `/api/avatars/:id`
- По умолчанию: `public/img/default-avatar.png`

## 🌐 Формат ответов API

### Успешный ответ
```json
{
    "success": true,
    "data": { ... }
}
```

### Ошибка
```json
{
    "success": false,
    "message": "Описание ошибки"
}
```

### Пагинация
```json
{
    "success": true,
    "data": [...],
    "total": 100,
    "page": 1,
    "pages": 10
}
```

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск сервера (nodemon с автоперезагрузкой)
npm start

# Seeding данных
npm run seed      # RBAC роли и права
npm run seed:admin # Создание админа
```

## 📦 Зависимости

| Пакет | Назначение |
|-------|-----------|
| express@5 | Фреймворк |
| mongoose@9 | MongoDB ODM |
| express-session + connect-mongo | Сессии в MongoDB |
| bcrypt | Хеширование паролей |
| express-validator | Валидация запросов |
| multer + multer-gridfs-storage + gridfs-stream | Загрузка файлов в GridFS |
| ejs | Шаблоны |
| dotenv | Переменные окружения |
| nodemon | Dev-сервер с автоперезагрузкой |

## 🌍 Переменные окружения (.env)

```env
MONGO_URI=mongodb://localhost:27017/dbname
SESSION_SECRET=your-secret-key
PORT=3001
```

## ✅ Чек-лист при добавлении нового ресурса

- [ ] Создать модель в `models/`
- [ ] Создать валидатор в `validators/`
- [ ] Создать сервис в `services/`
- [ ] Создать контроллер в `controllers/`
- [ ] Создать роуты в `routes/`
- [ ] Добавить роуты в `routes/index.js`
- [ ] Создать middleware (если нужна спец. проверка)
- [ ] Добавить EJS-шаблоны в `views/`
- [ ] Добавить seeding (если нужны начальные данные)
- [ ] Протестировать CRUD-операции

## 🐛 Обработка ошибок

1. **MulterError** — обработка в глобальном error handler (лимит файла и т.д.)
2. **ValidationError** — от express-validator (возвращается 400)
3. **MongooseError** — проблемы с БД (лог + 500)
4. **Unknown** — fallback error handler (лог + 500)

Глобальный error handler находится в `app.js` и обрабатывает multer-ошибки.

## 📌 Важные замечания

- Проект использует **ES Modules** (`"type": "module"` в package.json)
- Express **v5** — есть отличия от v4 (парсинг body, мидлвары)
- Все маршруты собираются в `routes/index.js` и подключаются в `app.js`
- Онлайн-система: обновляет `lastSeen` через middleware
- Сессия хранится в MongoDB через `MongoStore`
- Файлы хранятся в GridFS, не в файловой системе
