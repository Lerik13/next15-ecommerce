import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/actions/order.actions'
import { ShippingAddress } from '@/types'
import OrderDetailsTable from './order-details-table'
import { auth } from '@/auth'
import Stripe from 'stripe'

export const metadata: Metadata = {
  title: 'Order Details',
}

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let client_secret = null

  // Check if not paid and using Stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    })
    client_secret = paymentIntent.client_secret
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      stripeClientSecret={client_secret}
      isAdmin={session?.user?.role === 'admin' || false}
    />
  )
}

export default OrderDetailsPage
