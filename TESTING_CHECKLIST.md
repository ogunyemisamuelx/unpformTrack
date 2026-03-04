# Testing Checklist ✅

Use this checklist to test your platform before deployment.

## 🖥️ Desktop Testing (Chrome, Firefox, Safari)

### Login Page
- [ ] Form displays correctly
- [ ] Can enter name, email, password
- [ ] Error messages show for invalid credentials
- [ ] Successfully redirects after login
- [ ] Gradient background looks good

### Staff Profile Page
- [ ] Name displays at top
- [ ] Email shows correctly
- [ ] Upload button visible and clickable
- [ ] Empty state shows for new users
- [ ] Images display in grid (3 columns on desktop)
- [ ] Date/time stamps readable
- [ ] Front/back badges show correct colors
- [ ] Hover effects work on images
- [ ] Sign out button works

### Upload Modal
- [ ] Modal opens on button click
- [ ] "Take Photo" button works (camera access)
- [ ] "Upload from Gallery" button works
- [ ] Camera preview displays
- [ ] Can capture photo
- [ ] Preview shows captured/uploaded image
- [ ] Can select Front/Back
- [ ] Front button turns blue when selected
- [ ] Back button turns red when selected
- [ ] Can retake photo
- [ ] Upload button works
- [ ] Loading state shows during upload
- [ ] Modal closes on success
- [ ] Page refreshes with new image

### Admin Dashboard
- [ ] Stats cards display correctly
- [ ] Active/inactive/total staff counts accurate
- [ ] Total documents count correct
- [ ] Search box works
- [ ] Active Only filter toggles
- [ ] Staff cards display in grid
- [ ] Can click to expand staff details
- [ ] Recent uploads show for each staff
- [ ] Front/back badges show on thumbnails
- [ ] Inactive users marked clearly
- [ ] Empty state shows when no results

---

## 📱 Mobile Testing (iPhone)

### Safari iOS
- [ ] Login page responsive
- [ ] All form fields accessible
- [ ] Keyboard doesn't cover inputs
- [ ] Can submit form

### Profile Page Mobile
- [ ] Header fits screen
- [ ] Name and email readable
- [ ] Upload button large enough to tap
- [ ] Images stack in single column
- [ ] Images display full width
- [ ] Cards have proper spacing
- [ ] Sign out button accessible

### Camera on iPhone
- [ ] "Take Photo" requests camera permission
- [ ] Camera preview shows full screen
- [ ] Can switch front/back camera
- [ ] Capture button easy to tap
- [ ] Preview shows captured image clearly
- [ ] Front/Back buttons large enough
- [ ] Upload button works
- [ ] Returns to profile after upload

### Upload from Photos (iPhone)
- [ ] "Upload from Gallery" opens photo picker
- [ ] Can select photo from library
- [ ] Preview shows selected photo
- [ ] Can proceed with upload

### Admin Dashboard Mobile
- [ ] Stats cards stack vertically
- [ ] All 4 stat cards visible
- [ ] Search box full width
- [ ] Staff cards stack in single column
- [ ] Can tap to expand details
- [ ] Thumbnails display correctly

---

## 📱 Mobile Testing (Android)

### Chrome Android
- [ ] Login works
- [ ] Profile page responsive
- [ ] Upload button accessible
- [ ] Camera access works
- [ ] File upload works
- [ ] Images display properly
- [ ] Admin dashboard responsive

---

## 💻 Tablet Testing (iPad)

### Profile Page Tablet
- [ ] Images display in 2 columns
- [ ] Header proportional
- [ ] Upload modal sized well
- [ ] Camera/upload options clear

### Admin Dashboard Tablet
- [ ] Stats cards in 2x2 grid
- [ ] Staff cards in 2 columns
- [ ] Search and filters accessible

---

## 🔐 Authentication Testing

### Valid Login
- [ ] Admin can login with admin email
- [ ] Staff can login with their email
- [ ] Redirects to correct page (admin → /admin, staff → /profile)

### Invalid Login
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Error message disappears on retry

### Session Management
- [ ] Logged in user stays logged in on refresh
- [ ] Cannot access /profile without login
- [ ] Cannot access /admin without login
- [ ] Non-admin cannot access /admin

### Logout
- [ ] Sign out button works
- [ ] Redirects to login page
- [ ] Cannot access protected pages after logout

---

## 📤 Upload Testing

### Camera Upload
- [ ] Camera permission requested
- [ ] Camera preview works
- [ ] Can capture photo
- [ ] Captured photo clear quality
- [ ] Upload succeeds
- [ ] Image appears in profile immediately

### File Upload
- [ ] File picker opens
- [ ] Can select image file
- [ ] Preview shows correctly
- [ ] Upload succeeds
- [ ] Image appears in profile

### Front/Back Tagging
- [ ] Can select Front (turns blue)
- [ ] Can select Back (turns red)
- [ ] Selected side saves correctly
- [ ] Badge shows correct side on uploaded image

### Error Handling
- [ ] Shows error if upload fails
- [ ] Can retry after error
- [ ] Error message clear and helpful

---

## 👨‍💼 Admin Features Testing

### View All Staff
- [ ] All active staff visible
- [ ] Inactive staff hidden when "Active Only" enabled
- [ ] Inactive staff visible when "Show All" enabled
- [ ] Staff sorted alphabetically

### Search Functionality
- [ ] Can search by name
- [ ] Can search by email
- [ ] Search is case-insensitive
- [ ] Results update in real-time

### Staff Details
- [ ] Click staff card to expand
- [ ] Recent uploads display
- [ ] Can see up to 6 thumbnails
- [ ] "X more documents" shows if >6
- [ ] Click again to collapse

### Statistics
- [ ] Active count matches reality
- [ ] Inactive count correct
- [ ] Total staff accurate
- [ ] Total documents correct

---

## 🎨 UI/UX Testing

### Colors & Branding
- [ ] Blue (#1e40af) used for primary actions
- [ ] Red (#dc2626) used for secondary/accents
- [ ] Gradient header looks professional
- [ ] Colors accessible (good contrast)

### Animations
- [ ] Hover effects smooth
- [ ] Transitions not jarring
- [ ] Loading states clear
- [ ] No layout shifts

### Responsiveness
- [ ] No horizontal scrolling on mobile
- [ ] Text readable on all screen sizes
- [ ] Buttons large enough to tap
- [ ] Images scale properly
- [ ] No content cut off

---

## 🔧 Technical Testing

### Database
- [ ] Users created from .env
- [ ] Images saved to database
- [ ] Relationships work (user → images)
- [ ] Timestamps accurate

### Cloudinary
- [ ] Images upload to Cloudinary
- [ ] Images display from Cloudinary CDN
- [ ] Public IDs saved correctly
- [ ] Images optimized

### Performance
- [ ] Pages load quickly (<3 seconds)
- [ ] Images load progressively
- [ ] No console errors
- [ ] No console warnings (in production)

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## 🚀 Pre-Deployment Checklist

### Environment Variables
- [ ] All .env variables set in Vercel
- [ ] NEXTAUTH_URL points to production URL
- [ ] Database URL is production Neon DB
- [ ] Cloudinary credentials correct

### Security
- [ ] Admin password changed from default
- [ ] Staff passwords are strong
- [ ] .env not committed to Git
- [ ] HTTPS enabled (Vercel does this)

### Data
- [ ] Setup script run on production
- [ ] Users created successfully
- [ ] Can login with all accounts

### Final Checks
- [ ] Test full user flow (login → upload → logout)
- [ ] Test admin flow (login → view staff → logout)
- [ ] Check on mobile device
- [ ] Check on desktop
- [ ] Verify emails/names display correctly

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Camera doesn't work | Must use HTTPS (http:// won't work) |
| Can't login | Check user exists, run setup script |
| Images won't upload | Verify Cloudinary credentials |
| Blank page | Check browser console for errors |
| Slow loading | Check Cloudinary optimization |
| Wrong redirect after login | Check isAdmin flag in database |

---

## ✅ Sign Off

- [ ] All desktop tests passed
- [ ] All mobile tests passed
- [ ] All tablet tests passed
- [ ] Authentication works perfectly
- [ ] Uploads work from all methods
- [ ] Admin dashboard fully functional
- [ ] UI looks professional
- [ ] Performance acceptable
- [ ] Ready for production! 🚀

**Tested by:** _________________  
**Date:** _________________  
**Notes:** _________________
