'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CartItem } from '@/types'
import { Button } from '@/components/ui/button'
import { addItemToCart } from '@/lib/actions/cart.actions'
import { PlusIcon } from 'lucide-react'

const AddToCart = ({ item }: { item: CartItem }) => {
  //toast('Event has been created.')
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

  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <PlusIcon /> Add to Cart
    </Button>
  )
}

export default AddToCart
