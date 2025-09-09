# راه‌اندازی hrbooteh با XAMPP MySQL

## مرحله 1: راه‌اندازی XAMPP

1. **شروع خدمات XAMPP**:
   - باز کردن XAMPP Control Panel
   - کلیک روی "Start" برای Apache (اختیاری)
   - کلیک روی "Start" برای MySQL (ضروری)

2. **بررسی اتصال MySQL**:
   - MySQL باید روی پورت 3306 اجرا شود
   - اگر پورت تغییر کرده، فایل `.env.development` را آپدیت کنید

## مرحله 2: ساخت دیتابیس

### روش 1: استفاده از phpMyAdmin (آسان‌تر)

1. در مرورگر به آدرس `http://localhost/phpmyadmin` بروید
2. روی "SQL" کلیک کنید
3. محتویات فایل `backend/create_database.sql` را کپی و پیست کنید
4. روی "Go" کلیک کنید

### روش 2: استفاده از MySQL Command Line

```bash
# وارد شدن به MySQL
mysql -u root -p

# اجرای فایل SQL
source C:/Users/ASUS/Desktop/hrbooteh-pathfinder/backend/create_database.sql

# یا کپی کردن محتوا و اجرای مستقیم
```

## مرحله 3: تنظیم Backend

1. **نصب dependencies جدید**:
   ```bash
   cd C:/Users/ASUS/Desktop/hrbooteh-pathfinder/backend
   pip install -r requirements.txt
   ```

2. **بررسی فایل environment**:
   - فایل `backend/.env.development` باید شامل موارد زیر باشد:
   ```
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=hrbooteh_db
   ```

3. **اجرای backend**:
   ```bash
   cd backend
   python start-dev.py
   ```

## مرحله 4: تست اتصال

1. Backend روی `http://localhost:8000` اجرا می‌شود
2. API Documentation: `http://localhost:8000/docs`
3. Health Check: `http://localhost:8000/health`

## مرحله 5: اجرای کامل برنامه

```bash
cd C:/Users/ASUS/Desktop/hrbooteh-pathfinder
npm run dev
```

این کار هم frontend (http://localhost:8080) و هم backend (http://localhost:8000) را اجرا می‌کند.

## عیب‌یابی (Troubleshooting)

### خطای اتصال به MySQL

1. **بررسی وضعیت MySQL در XAMPP**:
   - مطمئن شوید که MySQL در XAMPP Control Panel "Running" است

2. **تغییر پورت**:
   - اگر MySQL روی پورت دیگری اجرا می‌شود، فایل `.env.development` را آپدیت کنید

3. **تغییر رمز عبور root**:
   - اگر برای root رمز عبور گذاشته‌اید، در فایل `.env.development`:
   ```
   DB_PASSWORD=your_mysql_root_password
   ```

### خطای Permission

اگر خطای دسترسی دریافت کردید:
```sql
-- در phpMyAdmin این کوئری را اجرا کنید:
GRANT ALL PRIVILEGES ON hrbooteh_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### تأیید ساخت جداول

در phpMyAdmin یا MySQL command line:
```sql
USE hrbooteh_db;
SHOW TABLES;
```

باید 3 جدول ببینید:
- users
- assessments  
- assessment_messages

## جداول ایجاد شده

1. **users**: اطلاعات کاربران (ایمیل، نام، رمز عبور هش شده)
2. **assessments**: ارزیابی‌ها (نوع ارزیابی، وضعیت، نتایج تحلیل)
3. **assessment_messages**: پیام‌های گفتگو (پیام کاربر و AI)

## تست عملکرد

پس از راه‌اندازی، می‌توانید:
1. ثبت‌نام کاربر جدید
2. ورود به سیستم
3. شروع ارزیابی جدید
4. گفتگو با AI
5. مشاهده نتایج

---

**نکته**: اگر هر مشکلی داشتید، فایل‌های لاگ را در پوشه `backend/logs/` بررسی کنید.
