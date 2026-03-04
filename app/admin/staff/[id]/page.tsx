import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StaffProfileView from '@/components/StaffProfileView'

export default async function StaffProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (!session.user.isAdmin) {
    redirect('/profile')
  }

  // Fetch the staff member with their document pairs
  const staff = await prisma.user.findUnique({
    where: { 
      id: params.id,
      isAdmin: false, // Ensure we're only viewing staff, not other admins
    },
    include: {
      documentPairs: {
        orderBy: { uploadedAt: 'desc' },
      },
    },
  })

  if (!staff) {
    redirect('/admin')
  }

  return <StaffProfileView staff={staff} />
}
