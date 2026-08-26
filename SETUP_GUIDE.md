# 📖 **دليل إعداد المشروع من الصفر**

**للحصول على تجربة سلسة عند clone المشروع لأول مرة**

---

## 🎯 **الهدف**

هذا الدليل **يضمن** أن كل شيء يعمل بشكل صحيح تلقائيًا عند:
1. **Clone المشروع**
2. **تشغيل `npm install`**
3. **تشغيل `docker-compose up -d`**

---

## 🚀 **خطوات الإعداد التلقائي**

### **1️⃣ Clone المشروع**

```bash
# استنساخ المشروع
git clone https://github.com/DevHive1/Github-devy.git
cd Github-devy

# التحقق من أن جميع الملفات موجوده
git status
```

**الملفات الأساسية التي يجب أن تكون موجوده:**
```
.
├── README.md              # الدليل الرئيسي (مختصر)
├── README-ORIGINAL.md     # الدليل الأصلي الكامل
├── README-UPDATED.md      # الدليل المحدث سابقاً
├── SETUP_GUIDE.md         # هذا الدليل
├── .env.example           # نموذج ملف البيئة
├── docker-compose.yml     # إعداد Docker
├── Dockerfile             # Dockerfile الرئيسي
├── package.json           # الاعتمادات
├── server.ts              # السيرفر الرئيسي
├── server/
│   ├── database/
│   │   ├── postgres.ts    # اتصال PostgreSQL
│   │   └── redis.ts       # اتصال Redis
│   └── routes/
│       ├── postgres.ts   # API PostgreSQL
│       ├── redis.ts      # API Redis
│       └── ...
└── src/                  # الكود الأمامي
```

---

### **2️⃣ إعداد البيئة**

#### **خيار A: باستخدام Docker (أفضل)**

```bash
# إنشاء ملف .env من النموذج
cp .env.example .env

# تشغيل جميع الخدمات (App + PostgreSQL + Redis)
docker-compose up -d

# التحقق من أن جميع الحاويات تعمل
docker-compose ps
```

**الناتج المتوقع:**
```
      Name                     Command               State           Ports
--------------------------------------------------------------------------------------
github-devy   node dist/server.cjs           Up      0.0.0.0:9876->9876/tcp
ollama         /bin/sh -c /bin/ollama s ...   Up      0.0.0.0:11434->11434/tcp
postgres       docker-entrypoint.sh postgres   Up      0.0.0.0:5432->5432/tcp
redis          docker-entrypoint.sh redis ... Up      0.0.0.0:6379->6379/tcp
```

#### **خيار B: تثبيت محلي (بدون Docker)**

```bash
# تثبيت الاعتمادات
npm install

# إنشاء ملف .env
cp .env.example .env

# تحرير .env (اختياري - إذا كنت تريد استخدام قواعد بيانات محلية)
nano .env  # أو أي محرر آخر

# بناء المشروع
npm run build

# تشغيل السيرفر
npm start
```

---

### **3️⃣ اختبار المشروع**

#### **اختبار السيرفر**

```bash
# التحقق من أن السيرفر يعمل
curl http://localhost:9876/api/postgres/test
curl http://localhost:9876/api/redis/test
```

**الناتج المتوقع:**
```json
// PostgreSQL
{"success":true,"message":"PostgreSQL connected successfully","timestamp":"2024-01-01T12:00:00.000Z"}

// Redis
{"success":true,"status":"pong"}
```

#### **اختبار المنصة**

افتح المتصفح واذهب إلى:
```
http://localhost:9876
```

**المتوقع:**
- ✅ المنصة تفتح بدون أخطاء
- ✅ Terminal يعمل
- ✅ File Explorer يظهر
- ✅ AI Features تعمل (إذا كانت GEMINI_API_KEY مضبوطة)

---

## 🛠️ **إعداد قواعد البيانات**

### **PostgreSQL**

#### **في Docker**

```bash
# PostgreSQL يعمل تلقائيًا مع docker-compose
# يمكنك الدخول إليه باستخدام:
docker exec -it postgres psql -U devy -d devy

# أو من خارج Docker
psql -h localhost -U devy -d devy
```

#### **محليًا (بدون Docker)**

```bash
# تثبيت PostgreSQL
# Ubuntu/Debian:
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Fedora:
sudo dnf install -y postgresql-server postgresql-contrib

# macOS (Homebrew):
brew install postgresql
brew services start postgresql

# إنشاء مستخدم وقاعدة بيانات
sudo -u postgres createuser devy
sudo -u postgres createdb devy
sudo -u postgres psql -c "ALTER USER devy WITH PASSWORD 'devy123'"

# تحديث .env
POSTGRES_URL=postgresql://devy:devy123@localhost:5432/devy
```

### **Redis**

#### **في Docker**

```bash
# Redis يعمل تلقائيًا مع docker-compose
# يمكنك الدخول إليه باستخدام:
docker exec -it redis redis-cli

# أو من خارج Docker
redis-cli
```

#### **محليًا (بدون Docker)**

```bash
# تثبيت Redis
# Ubuntu/Debian:
sudo apt update
sudo apt install -y redis-server

# Fedora:
sudo dnf install -y redis

# macOS (Homebrew):
brew install redis
brew services start redis

# تحديث .env
REDIS_URL=redis://localhost:6379
```

---

## 🔧 **إعداد مفاتيح API**

### **Google Gemini API Key (مطلوبة للـ AI)**

1. اذهب إلى: [https://ai.google.dev/gemini-api/docs/api-key](https://ai.google.dev/gemini-api/docs/api-key)
2. سجل دخول بحساب Google
3. أنشئ API Key جديد
4. أضفه إلى `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

### **GitHub Personal Access Token (اختياري)**

1. اذهب إلى: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. أنشئ Personal Access Token جديد
3. اختر الصلاحيات المطلوبة
4. أضفه إلى `.env`:

```env
GITHUB_TOKEN=your_github_token_here
```

### **توليد مفاتيح أمنية**

```bash
# توليد SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# توليد JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# أضفها إلى .env
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here
```

---

## 📋 **قائمة التحقق من الإعداد**

- [ ] **Clone المشروع** (`git clone`)
- [ ] **ملف .env موجود** (`cp .env.example .env`)
- [ ] **الاعتمادات مثبتة** (`npm install`)
- [ ] **Docker يعمل** (`docker --version`)
- [ ] **PostgreSQL يعمل** (`docker-compose ps`)
- [ ] **Redis يعمل** (`docker-compose ps`)
- [ ] **المشروع مبني** (`npm run build`)
- [ ] **السيرفر يعمل** (`npm start` أو `docker-compose up -d`)
- [ ] **المنصة تفتح** (http://localhost:9876)
- [ ] **PostgreSQL API يعمل** (`curl http://localhost:9876/api/postgres/test`)
- [ ] **Redis API يعمل** (`curl http://localhost:9876/api/redis/test`)
- [ ] **GEMINI_API_KEY مضبوط** (إذا كنت تريد استخدام AI)

---

## 🚨 **حل المشكلات الشائعة**

### **مشكلة 1: Docker ليس مثبتًا**

```bash
# تثبيت Docker على Ubuntu
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker

# تثبيت Docker على macOS
brew install docker docker-compose
```

### **مشكلة 2: Node.js ليس مثبتًا**

```bash
# تثبيت Node.js على Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت Node.js على macOS
brew install node
```

### **مشكلة 3: PostgreSQL لا يعمل**

```bash
# التحقق من حالة PostgreSQL
sudo systemctl status postgresql

# بدء PostgreSQL
sudo systemctl start postgresql

# تمكين بدء تلقائي
sudo systemctl enable postgresql
```

### **مشكلة 4: Redis لا يعمل**

```bash
# التحقق من حالة Redis
sudo systemctl status redis

# بدء Redis
sudo systemctl start redis

# تمكين بدء تلقائي
sudo systemctl enable redis
```

### **مشكلة 5: البورت 9876 مستخدم**

```bash
# إيجاد العملية التي تستخدم البورت
sudo lsof -i :9876

# قتل العملية
sudo kill -9 <PID>

# أو تغيير البورت في .env
PORT=3000
```

### **مشكلة 6: أخطاء في بناء المشروع**

```bash
# حذف node_modules و إعادة التثبيت
rm -rf node_modules package-lock.json
npm install

# بناء المشروع مرة أخرى
npm run build
```

### **مشكلة 7: قاعدة البيانات لا تتصل**

```bash
# التحقق من اتصال PostgreSQL
psql -h localhost -U devy -d devy -c "SELECT 1"

# التحقق من اتصال Redis
redis-cli ping

# التحقق من متغيرات البيئة
cat .env | grep POSTGRES_URL
cat .env | grep REDIS_URL
```

---

## 📚 **المصادر الإضافية**

- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

---

## 🎯 **الخطوات التالية**

بعد الإعداد الناجح:

1. **جرب المنصة**: استكشف جميع الميزات
2. **قم بإنشاء Workspace**: ابدأ مشروعًا جديدًا
3. **استخدم Terminal**: جرب الأوامر
4. **جرب AI**: إذا كانت GEMINI_API_KEY مضبوطة
5. **اقرأ الوثائق**: [README.md](README.md) أو [README-ORIGINAL.md](README-ORIGINAL.md)

---

**تم إعداد المشروع بنجاح!** 🎉

إذا واجهت أي مشكله، راجع قسم [حل المشكلات الشائعة](#-حل-المشكلات-الشائعة) أو افتح issue على [GitHub Issues](https://github.com/DevHive1/Github-devy/issues).
