//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
import ProductCarousel from '@/components/product/product-carousel'
import ProductList from '@/components/product/product-list'
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions'

const HomePage = async () => {
  //await delay(2000)
  const latestProducts = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
    </>
  )
}

export default HomePage
