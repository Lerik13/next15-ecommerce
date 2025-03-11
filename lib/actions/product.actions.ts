'use server'

import { prisma } from '@/db/prisma'
import { convertToPlainObject } from '../utils'
import { LATEST_PRODUCTS_LIMIT } from '../constants'

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  })

  return convertToPlainObject(data)
}
