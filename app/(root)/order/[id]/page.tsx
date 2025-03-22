import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/actions/order.actions'

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

  return <>Details {order.totalPrice}</>
}

export default OrderDetailsPage
