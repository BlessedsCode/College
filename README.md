# Менеджер задач

Учебный проект Никиты (РПО-5, IT Top College).

## Стек
- **Бэкенд**: Python 3.12 + FastAPI + SQLite + JWT
- **Фронтенд**: React 18 + Vite + React Router + Axios

## Структура
```
task-manager/
├── backend/
│   ├── main.py          # Точка входа FastAPI, CORS, роутеры
│   ├── database.py      # SQLAlchemy engine, сессия, Base
│   ├── models.py        # ORM: User, Task
│   ├── auth.py          # JWT валидация, get_current_user
│   ├── routers/
│   │   ├── users.py     # /api/users: register, login, me
│   │   └── tasks.py     # /api/tasks: CRUD
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx           # Роутинг, PrivateRoute
        ├── main.jsx          # React root
        ├── api/client.js     # Axios + JWT interceptor
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Tasks.jsx
```

## Запуск

### Бэкенд
```bash
cd backend
uv venv venv --python 3.12
source venv/bin/activate
uv pip install -r requirements.txt
uvicorn main:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Фронтенд
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

## API

| Метод | URL | Описание | Авторизация |
|-------|-----|----------|-------------|
| POST | /api/users/register | Регистрация | нет |
| POST | /api/users/login | Логин → JWT | нет |
| GET | /api/users/me | Текущий пользователь | Bearer |
| GET | /api/tasks/ | Список задач | Bearer |
| POST | /api/tasks/ | Создать задачу | Bearer |
| GET | /api/tasks/{id} | Получить задачу | Bearer |
| PATCH | /api/tasks/{id} | Обновить задачу | Bearer |
| DELETE | /api/tasks/{id} | Удалить задачу | Bearer |
