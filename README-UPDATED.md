# Github-devy

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

### تثبيت الاعتمادات

```bash
# تثبيت جميع الاعتمادات
npm install

# تثبيت الاعتمادات الإنتاج فقط
npm install --only=production

# تحديث الاعتمادات
npm update
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

| الأمر | الوصف |
|-------|------|
| `npm start` | تشغيل التطبيق في وضع الإنتاج |
| `npm run dev` | تشغيل في وضع التطوير |
| `npm run build` | بناء المشروع كامل |
| `npm run build:server` | بناء السيرفر فقط |
| `npm run build:client` | بناء الفrontend فقط |
| `npm run lint` | فحص الكود باستخدام ESLint |
| `npm run syntax-check` | فحص syntax TypeScript |
| `npm run ts-check` | فحص Types TypeScript |
| `npm run check-all` | تشغيل جميع الفحوصات |
| `npm run server` | تشغيل السيرفر فقط |
| `npm run client` | تشغيل الفrontend فقط |

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
GEMINI_API_KEY=your_gemini_api_key_here

# إعدادات AI المحلية (اختيارية)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
LM_STUDIO_URL=http://localhost:1234
LM_STUDIO_MODEL=local-model

# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token

# قاعدة البيانات (اختيارية)
DATABASE_URL=mongodb://localhost:27017/github-devy
POSTGRES_URL=postgresql://user:password@localhost:5432/github-devy
REDIS_URL=redis://localhost:6379

# الأمن
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here

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

### endpoints الرئيسية

| Method | Endpoint | الوصف |
|--------|----------|------|
| GET | `/api/` | قائمة المساحات (Workspaces) |
| POST | `/api/create` | إنشاء مساحة جديدة |
| POST | `/api/switch` | التبديل بين المساحات |
| DELETE | `/api/:id` | حذف مساحة |
| GET | `/api/health` | فحص صحة النظام |
| GET | `/api/files` | قائمة الملفات |
| POST | `/api/files` | رفع ملف |
| GET | `/api/files/:path` | قراءة ملف |
| PUT | `/api/files/:path` | تحديث ملف |
| DELETE | `/api/files/:path` | حذف ملف |

### أمثلة استخدام API

```bash
# الحصول على قائمة المساحات
curl http://localhost:9876/api/

# إنشاء مساحة جديدة
curl -X POST http://localhost:9876/api/create \
  -H "Content-Type: application/json" \
  -d '{"name": "my-workspace"}'

# التبديل إلى مساحة
curl -X POST http://localhost:9876/api/switch \
  -H "Content-Type: application/json" \
  -d '{"workspaceId": "12345"}'

# فحص صحة النظام
curl http://localhost:9876/api/health
```

---

## 🐳 **Docker**

### بناء وصورة Docker

```bash
# بناء الصورة
docker build -t github-devy:latest .

# تشغيل الحاوية
docker run -d \
  --name github-devy \
  -p 9876:9876 \
  -v $(pwd)/.agent_workspace:/.agent_workspace \
  -e GEMINI_API_KEY=your_api_key \
  -e NODE_ENV=production \
  github-devy:latest
```

### docker-compose (مستحث)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "9876:9876"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./.agent_workspace:/.agent_workspace
```

تشغيل:
```bash
docker-compose up -d
```

---

## 🔒 **الأمن**

### أفضل الممارسات

1. **لا تشارك .env** - أضف .env إلى .gitignore
2. **استخدم HTTPS** - في الإنتاج، استخدم reverse proxy مثل Nginx
3. **تحديث الاعتمادات** - نفذ `npm audit` بانتظام
4. **مفاتيح قوية** - استخدم مفاتيح طويلة وعشوائية
5. **ودائع محدودة** - لا تعط صلاحيات غير ضرورية

### فحص الأمن

```bash
# فحص الاعتمادات
npm audit

# فحص الاعتمادات وإصلاحها
npm audit fix

# فحص الكود بحثاً عن مشاكل
npm run check-all
```

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

###Git Hooks

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
- [Gemini AI](https://ai.google.dev/)

---

**نظام مطور بواسطة DevHive1**
