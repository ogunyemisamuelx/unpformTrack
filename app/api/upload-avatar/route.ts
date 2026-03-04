import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const avatar = formData.get('avatar') as File

    if (!avatar) {
      return NextResponse.json({ error: 'Avatar image is required' }, { status: 400 })
    }

    // Get current user to check if they have existing avatar
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatarCloudinaryId: true },
    })

    // Delete old avatar from Cloudinary if exists
    if (user?.avatarCloudinaryId) {
      try {
        await cloudinary.uploader.destroy(user.avatarCloudinaryId)
      } catch (err) {
        console.error('Failed to delete old avatar:', err)
      }
    }

    // Upload new avatar to Cloudinary
    const { cloudinaryId, imageUrl } = await uploadToCloudinary(avatar)

    // Update user's avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        avatarUrl: imageUrl,
        avatarCloudinaryId: cloudinaryId,
      },
    })

    return NextResponse.json({ 
      success: true, 
      avatarUrl: updatedUser.avatarUrl 
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
