# Logistics Staff Platform 🚚

A modern web platform for managing logistics staff and tracking shipping form documents. Built with Next.js, Prisma, and Cloudinary.

## Features ✨

- **Staff Authentication** - Secure login with email/password
- **Profile Management** - Each staff member has their own profile
- **Document Upload** - Upload shipping forms via camera or file upload
- **Front/Back Tagging** - Mark which side of the form each photo represents
- **Admin Dashboard** - Monitor all staff activities and uploaded documents
- **Inactive Staff Archiving** - Departed staff profiles preserved for records
- **Responsive Design** - Works on iPhone, Android, tablets, and laptops
- **Cloud Storage** - Images stored securely on Cloudinary

## Tech Stack 🛠️

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Database:** Neon PostgreSQL
- **ORM:** Prisma
- **Image Storage:** Cloudinary
- **Deployment:** Vercel

## Getting Started 🚀

### Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database
- Cloudinary account (free tier)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="your-neon-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Admin Email
ADMIN_EMAIL="admin@yourcompany.com"

# Staff Credentials (email:password,email:password)
STAFF_CREDENTIALS="john@company.com:pass123,jane@company.com:pass456"
```

3. **Set up the database:**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run setup script to create users
npx ts-node scripts/setup-users.ts
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## How to Use 📖

### For Staff Members

1. **Login** - Use your email and the password provided to you
2. **Upload Documents** - Click the "Upload Document" button
3. **Choose Method:**
   - Take a photo with your camera
   - Upload from your photo gallery
4. **Select Side** - Mark if it's the front or back of the form
5. **Submit** - Document is saved to your profile

### For Admin

1. **Login** - Use admin email with admin password
2. **View Dashboard** - See all staff and their statistics
3. **Monitor Activity** - Click on any staff card to see their uploads
4. **Filter** - Search by name/email or show active/inactive staff

### Managing Staff

**Adding New Staff:**
1. Add their email:password to `STAFF_CREDENTIALS` in `.env`
2. Run: `npx ts-node scripts/setup-users.ts`
3. Share their password privately

**Removing Staff:**
1. Remove their email:password from `STAFF_CREDENTIALS` in `.env`
2. Their profile becomes inactive (can't login)
3. All their documents remain accessible to admin

## Database Schema 📊

### Users Table
- `id` - Unique identifier
- `email` - Login email
- `name` - Full name
- `password` - Hashed password
- `isAdmin` - Admin privileges
- `isActive` - Account status (for archiving)
- `createdAt` - Account creation date

### Images Table
- `id` - Unique identifier
- `userId` - Associated user
- `cloudinaryId` - Cloudinary public ID
- `imageUrl` - Full image URL
- `side` - "front" or "back"
- `uploadedAt` - Upload timestamp

## Deployment 🌐

### Deploy to Vercel

1. **Push to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env`
   - Deploy!

3. **After deployment:**
   - Update `NEXTAUTH_URL` in Vercel environment variables
   - Run the setup script once: `npx ts-node scripts/setup-users.ts`

## Cloudinary Setup 🖼️

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add to `.env` file

## Security Notes 🔒

- Passwords are hashed with bcrypt
- Images stored securely on Cloudinary
- Session-based authentication
- Protected API routes
- Inactive users cannot login
- Admin-only dashboard access

## Customization 🎨

### Company Branding

Colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    blue: '#1e40af', // Change to your blue
    red: '#dc2626',  // Change to your red
  },
}
```

### Company Name

Update in:
- `app/layout.tsx` (metadata)
- `app/login/page.tsx` (login page header)

## Troubleshooting 🔧

**Database Connection Issues:**
- Check DATABASE_URL is correct
- Ensure IP is whitelisted in Neon

**Cloudinary Upload Fails:**
- Verify API credentials
- Check image size (max 10MB on free tier)

**Login Issues:**
- Run setup script again
- Check .env format (no spaces around =)

**Camera Not Working:**
- Enable camera permissions in browser
- Use HTTPS (required for camera access)

## Support 💬

For issues or questions, contact your system administrator.

## License

Private company use only.
