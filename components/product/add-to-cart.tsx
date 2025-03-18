'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Cart, CartItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter()

  const handleAddToCart = async () => {
    const res = await addItemToCart(item)

    if (!res.success) {
      toast.error(res.message)
      return
    }

    // Handle success add to cart
    toast.success(res.message, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    })
  }

  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId)
    if (res.success) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }

    return
  }

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId)

  return existItem ? (
    <>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        <Minus className='h-4 w-4' />
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        <Plus className='h-4 w-4' />
      </Button>
    </>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <Plus /> Add to Cart
    </Button>
  )
}

export default AddToCart
