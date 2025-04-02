'use client'

import { productDefaultValues } from '@/lib/constants'
import { insertProductSchema, updateProductSchema } from '@/lib/validators'
import { Product } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'create' | 'update'
  product?: Product
  productId?: string
}) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === 'create' ? insertProductSchema : updateProductSchema
    ),
    defaultValues:
      product && type === 'update' ? product : productDefaultValues,
  })

  return (
    <Form {...form}>
      <form className='space-y-8'>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Name */}
          {/* Slug */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Category */}
          {/* Brand */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Price */}
          {/* Stock */}
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* Images */}
        </div>
        <div className='upload-field'>{/* isFeatured */}</div>
        <div className=''>{/* Description */}</div>
        <div className=''>{/* Submit */}</div>
      </form>
    </Form>
  )
}

export default ProductForm
