import Link from 'next/link'
import { Button } from './ui/button'

const ViewAllProductsButton = () => {
  return (
    <div className='flex justify-center items-center my-8'>
      <Button asChild className='px-8 py-4n text-lg font-semibold'>
        <Link href='/search'>View All Products</Link>
      </Button>
    </div>
  )
}

export default ViewAllProductsButton
