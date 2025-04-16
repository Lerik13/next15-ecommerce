'use server'

import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants'
import { convertToPlainObject, formatError } from '../utils'
import { insertProductSchema, updateProductSchema } from '../validators'
import { deleteImages } from './images.actions'
import { Prisma } from '@prisma/client'

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  })

  return convertToPlainObject(data)
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  })
}

// Get single product by it's ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  })

  return convertToPlainObject(data)
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string
  limit?: number
  page: number
  category?: string
  price?: string
  rating?: string
  sort?: string
}) {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {}

  const data = await prisma.product.findMany({
    where: { ...queryFilter },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  const dataCount = await prisma.product.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const productExist = await prisma.product.findFirst({
      where: { id },
    })
    if (!productExist) throw new Error('Product not found')

    const imagesToBeDeleted = [...productExist.images]

    if (productExist.isFeatured && productExist.banner) {
      imagesToBeDeleted.push(productExist.banner)
    }

    const imagesKeys = imagesToBeDeleted.map((image) => image.split('/').pop())

    await deleteImages(imagesKeys as string[])

    await prisma.product.delete({ where: { id } })

    revalidatePath('/admin/products')

    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data)
    await prisma.product.create({ data: product })

    revalidatePath('/admin/products')

    return { success: true, message: 'Product created successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data)
    const productExist = await prisma.product.findFirst({
      where: { id: product.id },
    })

    if (!productExist) throw new Error('Product not found')

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    })

    revalidatePath('/admin/products')

    return { success: true, message: 'Product updated successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  })

  return data
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return convertToPlainObject(data)
}
