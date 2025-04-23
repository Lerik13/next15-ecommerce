'use client'

import { Review } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import ReviewForm from './review-form'

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string
  productId: string
  productSlug: string
}) => {
  const [reviews, setReviews] = useState<Review[]>([])

  return (
    <div className='space-y-4'>
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm userId={userId} productId={productId} />
      ) : (
        <div>
          Please
          <Link
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
            className='text-blue-700 px-2'
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className='flex flex-col gap-3'>{/* REVIEWS HERE */}</div>
    </div>
  )
}

export default ReviewList
