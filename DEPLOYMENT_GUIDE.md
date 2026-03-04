# Deployment Guide 🚀

Step-by-step guide to deploy your Logistics Staff Platform.

## Part 1: Database Setup (Neon PostgreSQL)

### Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create new project: "logistics-platform"
4. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this as `DATABASE_URL` in your `.env`

---

## Part 2: Cloudinary Setup

### Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. From Dashboard, copy:
   - **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`
4. Add these to your `.env`

---

## Part 3: Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` file:

```env
# Database (from Neon)
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run this command: openssl rand -base64 32"

# Cloudinary (from Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your-api-secret"

# Admin (your uncle's email)
ADMIN_EMAIL="uncle@yourcompany.com"

# Staff - Add all staff emails with passwords
# Format: email:password,email:password
STAFF_CREDENTIALS="john.doe@company.com:John2024!,jane.smith@company.com:Jane2024!,mike.johnson@company.com:Mike2024!"
```

### 3. Generate NextAuth Secret

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output and paste as `NEXTAUTH_SECRET`

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### 5. Create Users

```bash
# Run the setup script
npx ts-node scripts/setup-users.ts
```

You should see:
```
✅ Admin user created/updated: uncle@yourcompany.com
✅ Staff user created/updated: john.doe@company.com
✅ Staff user created/updated: jane.smith@company.com
...
🎉 User setup completed successfully!
```

### 6. Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and test:
- Login with admin email and password "admin123" (change this!)
- Login with staff emails and their passwords
- Upload some test images

---

## Part 4: Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Logistics Staff Platform"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/logistics-platform.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. **Add Environment Variables** (click "Environment Variables"):

```
DATABASE_URL = your-neon-connection-string
NEXTAUTH_SECRET = your-generated-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
ADMIN_EMAIL = uncle@yourcompany.com
STAFF_CREDENTIALS = email1:pass1,email2:pass2,...
```

5. Click "Deploy"
6. Wait 2-3 minutes for deployment

### 3. Update NextAuth URL

1. After deployment, copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. In Vercel Dashboard → Settings → Environment Variables
3. Edit `NEXTAUTH_URL` to your production URL
4. Redeploy (Deployments → three dots → Redeploy)

### 4. Run Setup on Production

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env pull .env.production
npx ts-node scripts/setup-users.ts
```

**Option B: Manually via Prisma Studio**
1. Run locally: `npx prisma studio`
2. Manually create users with hashed passwords

---

## Part 5: Share with Staff

### Admin Login (Your Uncle)

**URL:** `https://your-app.vercel.app`

**Email:** (ADMIN_EMAIL from .env)  
**Password:** `admin123` (CHANGE THIS IMMEDIATELY!)

To change admin password:
1. Login as admin
2. Go to Prisma Studio: `npx prisma studio`
3. Update password field with new bcrypt hash

### Staff Login

Share with each staff member privately:

```
🔐 Logistics Platform Login

URL: https://your-app.vercel.app

Your Credentials:
Email: their-email@company.com
Password: their-password

Please keep this confidential.
```

---

## Part 6: Ongoing Management

### Add New Staff Member

1. Edit `.env` file, add to `STAFF_CREDENTIALS`:
   ```
   STAFF_CREDENTIALS="existing@email.com:pass1,newemail@company.com:newpass"
   ```

2. Run setup script:
   ```bash
   npx ts-node scripts/setup-users.ts
   ```

3. Deploy changes to Vercel:
   - Update environment variable in Vercel
   - Redeploy

4. Share credentials with new staff member

### Remove Staff Member (Deactivate)

1. Remove their email from `STAFF_CREDENTIALS` in `.env`
2. Update on Vercel environment variables
3. Their account becomes inactive (can't login)
4. All their uploaded documents remain in the system

### Backup Data

**Export Database:**
```bash
# Using Prisma
npx prisma db pull
```

**Export from Neon:**
- Neon Dashboard → Your Project → Backups
- Download SQL dump

**Cloudinary Backup:**
- All images automatically backed up
- Download from Cloudinary Media Library if needed

---

## Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is correct
- Ensure Neon database is running
- Check IP whitelist in Neon (should allow all for Vercel)

### "Cloudinary upload failed"
- Verify all 3 Cloudinary env vars are set
- Check credentials in Cloudinary dashboard
- Ensure no extra spaces in .env

### "NextAuth error"
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches deployment URL
- For production, must be HTTPS

### "Can't login after deployment"
- Run setup script on production
- Check user exists: `npx prisma studio`
- Verify password format in `STAFF_CREDENTIALS`

### Camera not working
- Must use HTTPS (Vercel provides this)
- Check browser camera permissions
- Try different browser

---

## Security Checklist ✅

Before going live:

- [ ] Change admin password from "admin123"
- [ ] Use strong passwords for all staff
- [ ] Enable 2FA on Vercel account
- [ ] Enable 2FA on Neon account
- [ ] Enable 2FA on Cloudinary account
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Never commit `.env` to GitHub
- [ ] Use environment variables in Vercel only
- [ ] Regularly backup database
- [ ] Monitor Cloudinary usage (free tier limits)

---

## Support

If you encounter issues:
1. Check error logs in Vercel Dashboard
2. Check database logs in Neon Dashboard
3. Test locally first with `npm run dev`
4. Review this guide step-by-step

Good luck! 🚀
