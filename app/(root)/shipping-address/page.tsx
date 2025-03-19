import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getMyCart } from '@/lib/actions/cart.actions'
import { auth } from '@/auth'
import { getUserById } from '@/lib/actions/user.actions'

export const metadata: Metadata = {
  title: 'Shipping Address',
}

const ShippingAddressPage = async () => {
  const cart = await getMyCart()

  if (!cart || cart.items.length === 0) redirect('/cart')

  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error('No User ID')

  const user = await getUserById(userId)

  return <>Address</>
}

export default ShippingAddressPage
