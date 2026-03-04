import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (!session.user.isAdmin) {
    redirect('/profile')
  }

  // Fetch all users with their document pairs (EXCLUDE admin users)
  const users = await prisma.user.findMany({
    where: {
      isAdmin: false, // Only show staff members, not admins
    },
    include: {
      _count: {
        select: { documentPairs: true },
      },
    },
    orderBy: [
      { isActive: 'desc' }, // Active users first
      { name: 'asc' },
    ],
  })

  return <AdminDashboard users={users} />
}
