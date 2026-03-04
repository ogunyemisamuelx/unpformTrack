# How to Add Staff Members 👥

Simple guide to adding staff to your platform.

---

## 📧 Step 1: Collect Staff Emails

Ask each staff member for their email address. For example:
- John Doe → `john.doe@company.com`
- Jane Smith → `jane.smith@company.com`
- Bob Wilson → `bob.wilson@company.com`

---

## 🔐 Step 2: Create Passwords for Each Staff

**YOU create the passwords** (not the staff members). Make them:
- At least 8 characters
- Mix of letters and numbers
- Easy to remember but hard to guess

Example passwords:
- John Doe → `JohnPass2024!`
- Jane Smith → `JanePass2024!`
- Bob Wilson → `BobPass2024!`

> 💡 **Tip:** Use a pattern like `FirstnamePass2024!` for easier management

---

## ✍️ Step 3: Format for .env File

Now combine email and password with a colon (`:`) in between:

```
john.doe@company.com:JohnPass2024!
```

For multiple staff, separate with commas (NO SPACES!):

```
john.doe@company.com:JohnPass2024!,jane.smith@company.com:JanePass2024!,bob.wilson@company.com:BobPass2024!
```

---

## 📝 Step 4: Add to .env File

Open your `.env` file and find the `STAFF_CREDENTIALS` line.

**Before (example):**
```env
STAFF_CREDENTIALS="staff1@company.com:password123"
```

**After (your actual staff):**
```env
STAFF_CREDENTIALS="john.doe@company.com:JohnPass2024!,jane.smith@company.com:JanePass2024!,bob.wilson@company.com:BobPass2024!"
```

---

## 🔧 Step 5: Run Setup Script

After editing `.env`, run this command:

```bash
npm run setup
```

You should see:
```
✅ Staff user created/updated: john.doe@company.com
✅ Staff user created/updated: jane.smith@company.com
✅ Staff user created/updated: bob.wilson@company.com
🎉 User setup completed successfully!
```

---

## 📤 Step 6: Share Credentials with Staff

**Privately** tell each staff member their login info:

### Message Template:

```
🔐 Logistics Platform Access

URL: http://localhost:3000 (or your production URL)

Your Login Credentials:
━━━━━━━━━━━━━━━━━━━━
Email: john.doe@company.com
Password: JohnPass2024!

Please keep this confidential.
Do not share with anyone.
```

**Send this via:**
- Private message (WhatsApp, SMS)
- Email (individual, not group)
- In person (write it down for them)

---

## 📋 Complete Example

Let's say your company has 5 staff members:

| Name | Email | Password (you create) |
|------|-------|----------------------|
| John Doe | john.doe@company.com | JohnPass2024! |
| Jane Smith | jane.smith@company.com | JanePass2024! |
| Bob Wilson | bob.wilson@company.com | BobPass2024! |
| Alice Brown | alice.brown@company.com | AlicePass2024! |
| Charlie Davis | charlie.davis@company.com | CharliePass2024! |

**Your .env file would have:**

```env
STAFF_CREDENTIALS="john.doe@company.com:JohnPass2024!,jane.smith@company.com:JanePass2024!,bob.wilson@company.com:BobPass2024!,alice.brown@company.com:AlicePass2024!,charlie.davis@company.com:CharliePass2024!"
```

**Yes, it's all on ONE line!** (Even though it looks long)

---

## ✅ Checklist

- [ ] Collected all staff emails
- [ ] Created passwords for each staff member
- [ ] Formatted correctly (email:password,email:password)
- [ ] Added to `.env` file
- [ ] Ran `npm run setup`
- [ ] Saw success messages
- [ ] Shared credentials privately with each staff member
- [ ] Tested that each person can login

---

## 🔄 Adding MORE Staff Later

**New staff member joins? Easy!**

1. Add their `email:password` to the existing line in `.env`
2. Use a comma to separate from existing staff
3. Run `npm run setup` again
4. Share credentials with new person

**Example - Adding Mike Johnson:**

**Before:**
```env
STAFF_CREDENTIALS="john.doe@company.com:JohnPass2024!,jane.smith@company.com:JanePass2024!"
```

**After:**
```env
STAFF_CREDENTIALS="john.doe@company.com:JohnPass2024!,jane.smith@company.com:JanePass2024!,mike.johnson@company.com:MikePass2024!"
```

Then run: `npm run setup`

---

## 🚫 Removing Staff (Staff Leaves Company)

**Staff member leaves? Remove them:**

1. Delete their `email:password` from `.env`
2. Remove the comma if needed (to keep format clean)
3. Run `npm run setup` again
4. They can no longer login
5. Their uploaded documents stay in the system (for records)

**Example - Removing Jane:**

**Before:**
```env
STAFF_CREDENTIALS="john.doe@company.com:JohnPass2024!,jane.smith@company.com:JanePass2024!,bob.wilson@company.com:BobPass2024!"
```

**After:**
```env
STAFF_CREDENTIALS="john.doe@company.com:JohnPass2024!,bob.wilson@company.com:BobPass2024!"
```

Then run: `npm run setup`

---

## ❌ Common Mistakes to Avoid

### ❌ WRONG - Spaces in the credentials
```env
STAFF_CREDENTIALS="john@company.com : JohnPass , jane@company.com : JanePass"
```

### ✅ CORRECT - No spaces
```env
STAFF_CREDENTIALS="john@company.com:JohnPass,jane@company.com:JanePass"
```

---

### ❌ WRONG - Separate lines
```env
STAFF_CREDENTIALS="john@company.com:JohnPass"
STAFF_CREDENTIALS="jane@company.com:JanePass"
```

### ✅ CORRECT - One line, comma-separated
```env
STAFF_CREDENTIALS="john@company.com:JohnPass,jane@company.com:JanePass"
```

---

### ❌ WRONG - Missing colon
```env
STAFF_CREDENTIALS="john@company.com JohnPass"
```

### ✅ CORRECT - Colon between email and password
```env
STAFF_CREDENTIALS="john@company.com:JohnPass"
```

---

## 🆘 Troubleshooting

**"Staff can't login"**
- Check you ran `npm run setup` after editing `.env`
- Verify email and password exactly match what's in `.env`
- Make sure no extra spaces

**"Setup script fails"**
- Check format: `email:password,email:password`
- Make sure no special characters breaking the format
- Try with just one staff member first

**"Want to change a password"**
- Edit the password in `.env`
- Run `npm run setup` again
- Tell the staff member their new password

---

## 💡 Pro Tips

1. **Keep a separate document** with staff credentials (encrypted or secure location)
2. **Use a password manager** to generate strong passwords
3. **Test each account** after creating to make sure it works
4. **Tell staff to remember their password** (they can't reset it themselves)
5. **Change passwords periodically** for security

---

**Need help?** Check the other documentation files or test with just one staff member first!
