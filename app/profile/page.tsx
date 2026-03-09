import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileClient from '@/components/ProfileClient'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user with their document pairs
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      coverPhotoUrl: true,
      documentPairs: {
        orderBy: { uploadedAt: 'desc' },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  return <ProfileClient user={user} />
}
