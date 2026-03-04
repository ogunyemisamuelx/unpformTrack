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
    const image = formData.get('image') as File
    const side = formData.get('side') as string

    if (!image || !side) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (side !== 'front' && side !== 'back') {
      return NextResponse.json({ error: 'Invalid side value' }, { status: 400 })
    }

    // Upload to Cloudinary
    const { cloudinaryId, imageUrl } = await uploadToCloudinary(image)

    // Save to database
    const savedImage = await prisma.image.create({
      data: {
        userId: session.user.id,
        cloudinaryId,
        imageUrl,
        side,
      },
    })

    return NextResponse.json({ success: true, image: savedImage })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
