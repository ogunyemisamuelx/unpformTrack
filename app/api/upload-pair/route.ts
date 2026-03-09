import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const frontImage = formData.get('frontImage') as File
    const backImage = formData.get('backImage') as File
    const reference = formData.get('reference') as string

    if (!frontImage || !backImage) {
      return NextResponse.json({ error: 'Both front and back images are required' }, { status: 400 })
    }

    // Upload both images to Cloudinary
    const frontUpload = await uploadToCloudinary(frontImage)
    const backUpload = await uploadToCloudinary(backImage)

    // Save paired document to database
    const documentPair = await prisma.documentPair.create({
      data: {
        userId: session.user.id,
        frontCloudinaryId: frontUpload.cloudinaryId,
        frontImageUrl: frontUpload.imageUrl,
        backCloudinaryId: backUpload.cloudinaryId,
        backImageUrl: backUpload.imageUrl,
        reference: reference && reference.trim() !== '' ? reference.trim() : null,
      },
    })

    return NextResponse.json({ success: true, documentPair })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
