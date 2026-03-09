import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// Explicitly configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database to check admin status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    // Get document pair ID from request
    const { searchParams } = new URL(request.url)
    const documentPairId = searchParams.get('id')

    if (!documentPairId) {
      return NextResponse.json({ error: 'Document pair ID is required' }, { status: 400 })
    }

    // Get the document pair to access Cloudinary IDs
    const documentPair = await prisma.documentPair.findUnique({
      where: { id: documentPairId },
      select: {
        id: true,
        frontCloudinaryId: true,
        backCloudinaryId: true,
      },
    })

    if (!documentPair) {
      return NextResponse.json({ error: 'Document pair not found' }, { status: 404 })
    }

    // Delete images from Cloudinary
    const deletePromises = []

    if (documentPair.frontCloudinaryId) {
      deletePromises.push(
        cloudinary.uploader.destroy(documentPair.frontCloudinaryId)
      )
    }

    if (documentPair.backCloudinaryId) {
      deletePromises.push(
        cloudinary.uploader.destroy(documentPair.backCloudinaryId)
      )
    }

    await Promise.all(deletePromises)

    // Delete the document pair from database
    await prisma.documentPair.delete({
      where: { id: documentPairId },
    })

    return NextResponse.json({
      success: true,
      message: 'Document pair deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting document pair:', error)
    return NextResponse.json(
      { error: 'Failed to delete document pair' },
      { status: 500 }
    )
  }
}
