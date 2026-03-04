/**
 * Setup Script - Run this once to populate users from .env
 * 
 * Usage: npx ts-node scripts/setup-users.ts
 * 
 * This script reads STAFF_CREDENTIALS from .env and creates users in the database
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const staffCredentials = process.env.STAFF_CREDENTIALS

  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL not set in .env')
  }

  if (!staffCredentials) {
    throw new Error('STAFF_CREDENTIALS not set in .env')
  }

  // Create or update admin user
  console.log('Setting up admin user...')
  const adminPassword = await bcrypt.hash('admin123', 10) // Default password, should be changed
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      isAdmin: true,
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: 'Administrator',
      password: adminPassword,
      isAdmin: true,
      isActive: true,
    },
  })
  console.log(`✅ Admin user created/updated: ${adminEmail}`)

  // Parse and create staff users
  const staffList = staffCredentials.split(',').map((cred) => {
    const [email, password] = cred.trim().split(':')
    return { email, password }
  })

  console.log('\nSetting up staff users...')
  
  for (const staff of staffList) {
    if (!staff.email || !staff.password) {
      console.log(`⚠️  Skipping invalid credential entry`)
      continue
    }

    const hashedPassword = await bcrypt.hash(staff.password, 10)
    
    // Extract name from email (before @)
    const name = staff.email.split('@')[0].replace(/[._-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        password: hashedPassword,
        isActive: true,
      },
      create: {
        email: staff.email,
        name: name,
        password: hashedPassword,
        isAdmin: false,
        isActive: true,
      },
    })
    
    console.log(`✅ Staff user created/updated: ${staff.email}`)
  }

  console.log('\n🎉 User setup completed successfully!')
  console.log(`\nTotal users created:`)
  console.log(`- 1 Admin`)
  console.log(`- ${staffList.length} Staff members`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
