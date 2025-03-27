'use client'

import { Button } from '@/components/ui/button'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })
    router.push(newUrl)
  }

  return (
    <div className='flex gap-2'>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) <= 1}
        onClick={() => handleClick('prev')}
      >
        Previous
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('next')}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
