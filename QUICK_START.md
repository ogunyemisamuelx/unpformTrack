# Quick Start Guide ⚡

Get your logistics platform running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Git installed

## Step 1: Install (1 min)

```bash
npm install
```

## Step 2: Setup Accounts (2 min)

### Neon Database (Free)
1. Go to [neon.tech](https://neon.tech) → Sign up
2. Create project → Copy connection string
3. Save for next step

### Cloudinary (Free)
1. Go to [cloudinary.com](https://cloudinary.com) → Sign up
2. Dashboard → Copy: Cloud Name, API Key, API Secret
3. Save for next step

## Step 3: Configure .env (1 min)

Create `.env` file:

```env
DATABASE_URL="paste-neon-connection-string-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-any-random-long-string-here"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="paste-cloud-name"
CLOUDINARY_API_KEY="paste-api-key"
CLOUDINARY_API_SECRET="paste-api-secret"
ADMIN_EMAIL="youremail@company.com"
STAFF_CREDENTIALS="staff1@company.com:password1,staff2@company.com:password2"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
(Or just paste any random 32+ character string)

## Step 4: Setup Database (30 sec)

```bash
npm run db:push
npm run setup
```

You'll see: ✅ Users created successfully!

## Step 5: Run! (10 sec)

```bash
npm run dev
```

Open: **http://localhost:3000**

Login with your admin email or staff emails!

---

## What's Next?

- **Upload test photos** as staff
- **View admin dashboard** with admin account
- **Deploy to Vercel** (see DEPLOYMENT_GUIDE.md)
- **Customize colors** in `tailwind.config.ts`

---

## Quick Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run setup        # Add/update users from .env
npm run db:studio    # Open database GUI
```

---

## Need Help?

Check out:
- `README.md` - Full documentation
- `DEPLOYMENT_GUIDE.md` - Deploy to production
- `.env.example` - Environment variable template

🎉 **You're all set!** Happy shipping!
