'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { cartItemSchema } from '@/lib/validators'
import { CartItem } from '@/types'
import { cookies } from 'next/headers'

export async function addItemToCart(data: CartItem) {
  try {
    // Check for Cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found')

    // Get session and user Id
    const session = await auth()
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    // Get cart
    const cart = await getMyCart()

    // Parse and validate item
    const item = cartItemSchema.parse(data)

    // Find product in DB
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    })

    // TESTING
    console.log({
      'Session Cart Id': sessionCartId,
      'user Id': userId,
      'Item Requested': item,
      'Product found': product,
    })

    return {
      success: true,
      message: 'Item added to Cart',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getMyCart() {
  // Check for Cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  if (!sessionCartId) throw new Error('Cart session not found')

  // Get session and user Id
  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  // Get user cart from DB
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  })

  if (!cart) return undefined

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}
