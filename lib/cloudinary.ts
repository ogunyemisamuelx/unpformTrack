import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export async function uploadToCloudinary(file: File) {
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const dataURI = `data:${file.type};base64,${base64}`

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'logistics-staff-uploads',
    resource_type: 'auto',
  })

  return {
    cloudinaryId: result.public_id,
    imageUrl: result.secure_url,
  }
}
