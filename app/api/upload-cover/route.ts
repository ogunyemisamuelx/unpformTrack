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
    const coverPhoto = formData.get('coverPhoto') as File

    if (!coverPhoto) {
      return NextResponse.json({ error: 'Cover photo is required' }, { status: 400 })
    }

    // Get current user to check if they have existing cover photo
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coverPhotoCloudinaryId: true },
    })

    // Delete old cover photo from Cloudinary if exists
    if (user?.coverPhotoCloudinaryId) {
      try {
        await cloudinary.uploader.destroy(user.coverPhotoCloudinaryId)
      } catch (err) {
        console.error('Failed to delete old cover photo:', err)
      }
    }

    // Upload new cover photo to Cloudinary
    const { cloudinaryId, imageUrl } = await uploadToCloudinary(coverPhoto)

    // Update user's cover photo in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        coverPhotoUrl: imageUrl,
        coverPhotoCloudinaryId: cloudinaryId,
      },
    })

    return NextResponse.json({ 
      success: true, 
      coverPhotoUrl: updatedUser.coverPhotoUrl 
    })
  } catch (error) {
    console.error('Cover photo upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
