# 🚀 Github-devy

**منصة تطوير متكاملة مع دعم AI و Terminal و إدارة الملفات**

---

## 📋 **محتويات**

- [🚀 البدء السريع](#-البدء-السريع)
- [📥 التثبيت](#-التثبيت)
- [🏃‍♂️ التشغيل](#-التشغيل)
- [🛠️ الأوامر المتاحة](#-الأوامر-المتاحة)
- [⚙️ التكوين](#-التكوين)
- [🌐 واجهة API](#-واجهة-api)
- [🐳 Docker](#-docker)
- [🔒 الأمن](#-الأمن)
- [📱 دعم المنصات](#-دعم-المنصات)
- [📝 المساهمة](#-المساهمة)
- [📜 الترخيص](#-الترخيص)

---

## 🚀 **البدء السريع**

### **طريقة 1: باستخدام Docker (أفضل للإنتاج)**

```bash
# استنساخ المشروع
git clone https://github.com/DevHive1/Github-devy.git
cd Github-devy

# إنشاء ملف البيئة
cp .env.example .env

# تشغيل جميع الخدمات (App + PostgreSQL + Redis)
docker-compose up -d

# عرض حالة الخدمات
docker-compose ps

# الوصول إلى المنصة
# ستفتح على: http://localhost:9876
```

### **طريقة 2: تثبيت محلي**

```bash
# استنساخ المشروع
git clone https://github.com/DevHive1/Github-devy.git
cd Github-devy

# تثبيت الاعتمادات
npm install

# إنشاء ملف البيئة
cp .env.example .env
# تحرير .env وإضافة مفاتيح API الخاصة بك

# بناء المشروع
npm run build

# تشغيل السيرفر
npm start
```

المنصة ستفتح على: **http://localhost:9876**

---

## 📥 **التثبيت**

### المتطلبات المسبقة

| النظام | المتطلبات | ملاحظات |
|--------|-------------|----------|
| **Windows** | Node.js 18+ | يدعم Git Bash, WSL, cmd.exe |
| **Linux** | Node.js 18+ | Ubuntu, Fedora, Arch, etc. |
| **macOS** | Node.js 18+ | Intel & Apple Silicon |
| **Termux** | Node.js 18+ | Android via Termux |
| **Docker** | Docker 20+ | للتشغيل باستخدام حاويات |

### تثبيت الاعتمادات

```bash
# تثبيت جميع الاعتمادات
npm install

# تثبيت الاعتمادات الإنتاج فقط
npm install --only=production

# تحديث الاعتمادات
npm update
```

### تثبيت قواعد البيانات (اختياري)

```bash
# PostgreSQL + Redis (مستحث)
docker-compose up -d postgres redis

# MongoDB (اختياري)
docker-compose up -d mongo
```

---

## 🏃‍♂️ **التشغيل**

### تطوير (Development)

```bash
# تشغيل في وضع التطوير (مع hot reload)
npm run dev

# تشغيل السيرفر فقط
npm run server

# تشغيل الفrontend فقط
npm run client
```

### إنتاج (Production)

```bash
# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start

# تشغيل مع PM2 (مستحث)
npm install -g pm2
pm2 start dist/server.cjs --name github-devy
pm2 save
pm2 startup
```

---

## 🛠️ **الأوامر المتاحة**

### أوامر المشروع

| الأمر | الوصف |
|-------|------|
| `npm start` | تشغيل التطبيق في وضع الإنتاج |
| `npm run dev` | تشغيل في وضع التطوير |
| `npm run build` | بناء المشروع كامل |
| `npm run build:server` | بناء السيرفر فقط |
| `npm run build:client` | بناء الفrontend فقط |
| `npm run lint` | فحص الكود باستخدام TypeScript |
| `npm run syntax-check` | فحص syntax TypeScript |
| `npm run ts-check` | فحص Types TypeScript |
| `npm run check-all` | تشغيل جميع الفحوصات |

### أوامر Docker

```bash
# بناء الصورة
docker build -t github-devy .

# تشغيل الحاوية
docker run -p 9876:9876 --name github-devy github-devy

# تشغيل مع docker-compose
docker-compose up -d

# إيقاف docker-compose
docker-compose down

# عرض logs
docker-compose logs -f

# دخول إلى PostgreSQL
psql -h localhost -U devy -d devy

# دخول إلى Redis CLI
redis-cli
```

---

## ⚙️ **التكوين**

### ملف البيئة (.env)

انسخ الملف `.env.example` إلى `.env` واملأ القيم الخاصة بك:

```bash
cp .env.example .env
```

#### متغيرات البيئة الرئيسية

```env
# إعدادات السيرفر
PORT=9876
NODE_ENV=development

# مفاتيح AI (مطلوبة)
# احصل على API Key من: https://ai.google.dev/gemini-api/docs/api-key
GEMINI_API_KEY=

# إعدادات AI المحلية (اختيارية)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
LM_STUDIO_URL=http://localhost:1234
LM_STUDIO_MODEL=local-model

# GitHub Integration
# توليد token من: https://github.com/settings/tokens
GITHUB_TOKEN=

# قواعد البيانات
POSTGRES_URL=postgresql://devy:devy123@localhost:5432/devy
DATABASE_URL=mongodb://localhost:27017/github-devy
REDIS_URL=redis://localhost:6379

# الأمن
# توليد باستخدام: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=
JWT_SECRET=

# التكوين العام
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
WORKSPACE_ROOT=.agent_workspace
MAX_WORKSPACE_SIZE=1073741824
LOG_LEVEL=info
LOG_FORMAT=json
```

### توليد مفاتيح آمنه

```bash
# توليد SESSION_SECRET (32 byte hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# توليد JWT_SECRET (32 byte hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# توليد API Key عشوائي (64 character)
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

---

## 🌐 **واجهة API**

### قاعدة URL

```
http://localhost:9876/api/
```

### **PostgreSQL API Endpoints**

| Method | Endpoint | الوصف |
|--------|----------|------|
| GET | `/api/postgres/test` | اختبار اتصال PostgreSQL |
| GET | `/api/postgres/tables` | قائمة جميع الجداول |
| GET | `/api/postgres/tables/:name` | معلومات الجدول |
| POST | `/api/postgres/tables` | إنشاء جدول جديد |
| GET | `/api/postgres/:table` | الحصول على جميع السجلات |
| GET | `/api/postgres/:table/:id` | الحصول على سجل واحد |
| POST | `/api/postgres/:table` | إدراج سجل جديد |
| PUT | `/api/postgres/:table/:id` | تحديث سجل |
| DELETE | `/api/postgres/:table/:id` | حذف سجل |
| POST | `/api/postgres/transaction` | تنفيذ معاملات |

### **Redis API Endpoints**

| Method | Endpoint | الوصف |
|--------|----------|------|
| GET | `/api/redis/test` | اختبار اتصال Redis |
| GET | `/api/redis/status` | حالة الاتصال |
| POST | `/api/redis/reconnect` | إعادة الاتصال |
| GET | `/api/redis/keys` | قائمة جميع المفاتيح |
| POST | `/api/redis/set` | حفظ قيمة |
| GET | `/api/redis/get/:key` | الحصول على قيمة |
| DELETE | `/api/redis/del/:key` | حذف مفتاح |
| POST | `/api/redis/incr/:key` | زيادة قيمة |
| POST | `/api/redis/decr/:key` | نقص قيمة |
| POST | `/api/redis/hset/:key` | حفظ حقل في hash |
| GET | `/api/redis/hget/:key/:field` | الحصول على حقل من hash |
| GET | `/api/redis/hgetall/:key` | الحصول على جميع حقول hash |

### **SQLite API Endpoints**

| Method | Endpoint | الوصف |
|--------|----------|------|
| POST | `/api/db/list` | قائمة ملفات SQLite في workspace |
| POST | `/api/db/query` | تنفيذ استعلام على قاعدة بيانات |

### أمثلة استخدام API

#### PostgreSQL Examples:

```bash
# Test connection
curl http://localhost:9876/api/postgres/test

# List tables
curl http://localhost:9876/api/postgres/tables

# Create table
curl -X POST http://localhost:9876/api/postgres/tables \
  -H "Content-Type: application/json" \
  -d '{"tableName": "users", "schema": "username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL"}'

# Insert data
curl -X POST http://localhost:9876/api/postgres/users \
  -H "Content-Type: application/json" \
  -d '{"data": {"username": "devhive", "email": "dev@devhive.com"}}'

# Get all users
curl http://localhost:9876/api/postgres/users

# Get single user
curl http://localhost:9876/api/postgres/users/1
```

#### Redis Examples:

```bash
# Test connection
curl http://localhost:9876/api/redis/test

# Set key-value with TTL
curl -X POST http://localhost:9876/api/redis/set \
  -H "Content-Type: application/json" \
  -d '{"key": "session:123", "value": "user_data", "ttl": 3600}'

# Get value
curl http://localhost:9876/api/redis/get/session:123

# Increment counter
curl -X POST http://localhost:9876/api/redis/incr/counter
```

---

## 🐳 **Docker**

### **تشغيل جميع الخدمات**

```bash
# بدء جميع الخدمات
docker-compose up -d

# عرض حالة الخدمات
docker-compose ps

# عرض logs
docker-compose logs -f

# إيقاف جميع الخدمات
docker-compose down

# إزالة جميع البيانات (حذر!)
docker-compose down -v
```

### **الاتصال بقواعد البيانات داخل Docker**

| الخدمة | Host | Port | User | Password | Database |
|---------|------|------|------|----------|----------|
| PostgreSQL | `postgres` | 5432 | `devy` | `devy123` | `devy` |
| Redis | `redis` | 6379 | - | - | - |
| MongoDB | `mongo` | 27017 | `root` | `example` | `github-devy` |

**مثال:**
```env
# في .env
POSTGRES_URL=postgresql://devy:devy123@postgres:5432/devy
REDIS_URL=redis://redis:6379
DATABASE_URL=mongodb://root:example@mongo:27017/github-devy
```

### **أوامر PostgreSQL مفيدة**

```bash
# الدخول إلى PostgreSQL
psql -h localhost -U devy -d devy

# إنشاء جدول
psql -h localhost -U devy -d devy -c "
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
"

# إدراج بيانات
psql -h localhost -U devy -d devy -c "
  INSERT INTO users (username, email) VALUES ('devhive', 'dev@devhive.com');
"

# استعلام
psql -h localhost -U devy -d devy -c "SELECT * FROM users;"
```

### **نسخ احتياطي واستعادة**

#### PostgreSQL Backup:

```bash
# نسخ احتياطي
pg_dump -U devy -d devy -h localhost -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# استعادة
pg_restore -U devy -d devy -h localhost -c backup_20240101.dump

# نسخ احتياطي ك SQL
pg_dump -U devy -d devy -h localhost > backup_$(date +%Y%m%d).sql

# استعادة من SQL
psql -U devy -d devy -h localhost < backup_20240101.sql
```

#### MongoDB Backup:

```bash
# نسخ احتياطي
mongodump --uri="mongodb://root:example@localhost:27017/github-devy" --out=backup_$(date +%Y%m%d)

# استعادة
mongorestore --uri="mongodb://root:example@localhost:27017/github-devy" backup_20240101
```

---

## 🔒 **الأمن**

### **أفضل الممارسات**

1. **كلمات مرور قوية**
   ```bash
   # توليد كلمة مرور عشوائية (32 حرف)
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **لا تستخدم root user**
   ```sql
   -- في PostgreSQL
   CREATE USER app_user WITH PASSWORD 'strong_password';
   CREATE DATABASE app_db OWNER app_user;
   GRANT ALL PRIVILEGES ON DATABASE app_db TO app_user;
   ```

3. **تقييد الوصول**
   ```yaml
   # في docker-compose.yml
   postgres:
     environment:
       - POSTGRES_USER=app_user
       - POSTGRES_PASSWORD=strong_password
       - POSTGRES_DB=app_db
     # لا تعرض البورت خارجيًا في الإنتاج
     # ports:
     #   - "5432:5432"
   ```

4. **استخدام SSL**
   ```env
   POSTGRES_URL=postgresql://user:password@host:5432/db?sslmode=require
   ```

5. **لا تشارك .env**
   - أضف `.env` إلى `.gitignore`
   - لا ترفع ملف `.env` إلى Git

---

## 📱 **دعم المنصات**

### Windows

يدعم النظام:
- **Git Bash** (مستحث)
- **WSL** (Windows Subsystem for Linux)
- **cmd.exe** (نظام Windows الأصلي)

```bash
# في Git Bash
npm install
npm run dev

# في WSL
npm install
npm run dev
```

### Linux

```bash
# على Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm
npm install
npm run dev

# على Fedora
sudo dnf install -y nodejs npm
npm install
npm run dev
```

### macOS

```bash
# باستخدام Homebrew
brew install node
npm install
npm run dev
```

### Termux (Android)

```bash
pkg update
pkg upgrade
pkg install nodejs
npm install
npm run dev
```

---

## 📝 **المساهمة**

### إعداد بيئة التطوير

```bash
git clone https://github.com/DevHive1/Github-devy.git
cd Github-devy
npm install
```

### Git Hooks

المشروع يستخدم Husky لـ Git Hooks:
- **pre-commit**: تشغيل `npm run check-all` قبل كل commit
- **commit-msg**: التحقق من صيغة commit message

### قواعد Commit Messages

استخدم [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: إضافة ميزة جديدة
fix: إصلاح خطأ
chore: تغييرات عامة
refactor: إعادة هيكله الكود
docs: تحديث الوثائق
```

---

## 📜 **الترخيص**

MIT License - انظر [LICENSE](LICENSE) لمزيد من التفاصيل.

---

## 🆘 **الدعم**

- **مشكلات فنية**: افتح issue على [GitHub Issues](https://github.com/DevHive1/Github-devy/issues)
- **أسئلة عامة**: راسل على DevHive1
- **مساهمات**: مرحب بها عبر Pull Requests

---

## 📚 **المصادر**

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Gemini AI](https://ai.google.dev/)

---

**نظام مطور بواسطة DevHive1**

---

## 📌 **ملفات README الأخرى**

- [README-ORIGINAL.md](README-ORIGINAL.md) - النسخة الأصلية الكاملة (881 سطر)
- [README-UPDATED.md](README-UPDATED.md) - النسخة المحدثة سابقاً (427 سطر)

النسخة الحالية هي **نسخة مختصرة** مع التركيز على **البدء السريع** و **الاستخدام العملي**.
