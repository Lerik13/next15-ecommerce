'use client'

import { Check, Loader } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createOrder } from '@/lib/actions/order.actions'
import { toast } from 'sonner'

const PlaceOrderForm = () => {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const res = await createOrder()

    if (res.success) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }

    if (res.redirectTo) {
      router.push(res.redirectTo)
    }
  }

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className='w-full'>
        {pending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Check className='w-4 h-4' />
        )}{' '}
        Place Order
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <PlaceOrderButton />
    </form>
  )
}

export default PlaceOrderForm
