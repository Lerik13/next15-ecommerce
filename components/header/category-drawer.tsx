import { getAllCategories } from '@/lib/actions/product.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { Button } from '../ui/button'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

const CategoryDrawer = async () => {
  const categories = await getAllCategories()

  return (
    <Drawer direction='left'>
      <DrawerTrigger>
        <Button variant='outline'>
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full max-w-sm'>
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className='space-y-1 mt-4'>
            {categories.map((x) => (
              <Button
                variant='ghost'
                className='w-full justify-start'
                key={x.category}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${x.category}`}>
                    {x.category} ({x._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

export default CategoryDrawer
