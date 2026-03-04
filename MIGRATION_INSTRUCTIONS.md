# Migration Instructions - New Features Added! 🚀

## What Changed?

We've restructured the platform with major improvements:

### ✅ Added Features:
1. **Profile Avatars** - Staff can upload profile pictures
2. **Paired Document Upload** - Upload front AND back of forms together in one session
3. **Better Display** - Documents shown side-by-side (front + back)

---

## ⚠️ IMPORTANT: Database Migration Required

Your old database structure is incompatible with the new version. You need to migrate.

### Option 1: Fresh Start (Recommended for Testing)

**If you're still testing with your 4 emails:**

1. **Delete old database data:**
   ```bash
   npx prisma migrate reset
   ```

2. **Push new schema:**
   ```bash
   npx prisma db push
   ```

3. **Recreate test users:**
   ```bash
   npm run setup
   ```

4. **Start fresh:**
   ```bash
   npm run dev
   ```

All your old test data will be gone, but you'll have the new structure!

---

### Option 2: Keep Old Data (Advanced)

**If you have important data to preserve:**

This is more complex. You'll need to:
1. Export existing images from old database
2. Manually pair them (front + back)
3. Import into new structure

**This is NOT recommended for test data.**

---

## What to Test After Migration

### 1. Profile Avatar Upload
- [ ] Login as staff
- [ ] Click on avatar (default shows first letter of name)
- [ ] Upload a profile picture (camera or file)
- [ ] See it updates immediately
- [ ] Login as admin and see staff avatar in dashboard

### 2. Document Upload (New Flow!)
- [ ] Click "Upload New Form"
- [ ] Choose camera or file upload
- [ ] **Step 1:** Capture/upload FRONT side
- [ ] **Step 2:** Capture/upload BACK side
- [ ] **Review:** See both sides before uploading
- [ ] Click "Upload Document (Front & Back)"
- [ ] See both sides displayed together in profile

### 3. Staff Profile View
- [ ] See avatar at top (round circle)
- [ ] See documents displayed in pairs
- [ ] Front on left (blue border), Back on right (red border)
- [ ] Date/time shown above each pair

### 4. Admin Dashboard
- [ ] See staff avatars in list
- [ ] Document count shows correctly
- [ ] Click "View Profile" on any staff
- [ ] See their avatar and paired documents
- [ ] Navigate back to dashboard

---

## Commands to Run

```bash
# 1. Stop your dev server (Ctrl+C)

# 2. Reset database (DELETES ALL DATA!)
npx prisma db push

# 3. Create users from .env
npm run setup

# 4. Start dev server
npm run dev
```

---

## Expected Results

### Staff Profile:
```
┌─────────────────────────────────────┐
│  [Avatar]  John Doe                 │
│            john@company.com         │
│  [Upload New Form Button]           │
│                                     │
│  Shipping Forms (2)                 │
│  ┌─────────────────────────────┐   │
│  │ December 15, 2024 • 3:45 PM │   │
│  │ ┌──────────┐  ┌──────────┐  │   │
│  │ │  FRONT   │  │   BACK   │  │   │
│  │ │  [Image] │  │  [Image] │  │   │
│  │ └──────────┘  └──────────┘  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Admin Dashboard:
```
┌──────────────────────────────┐
│ [Avatar] John Doe            │
│          john@company.com    │
│          Joined: Dec 1, 2024 │
│          [View Profile]      │
│                           2  │
│                    Documents │
└──────────────────────────────┘
```

---

## Troubleshooting

**Error: "relation 'images' does not exist"**
- You didn't run `npx prisma db push`
- Run it now!

**Error: "Unknown argument: images"**
- Old code referencing old schema
- Make sure you have the latest code
- Restart dev server

**Avatar not uploading:**
- Check Cloudinary credentials in `.env`
- Check browser console for errors

**Can't upload documents:**
- Check camera permissions
- Try file upload instead
- Check Cloudinary credentials

**Documents not showing:**
- Refresh the page
- Check if upload actually succeeded
- Check browser console for errors

---

## Need Help?

Test in this order:
1. ✅ Database migrated successfully
2. ✅ Users created from `.env`
3. ✅ Can login as staff
4. ✅ Can upload avatar
5. ✅ Can upload document pair (front + back)
6. ✅ Can view paired documents
7. ✅ Admin can see everything

Report which step fails!
