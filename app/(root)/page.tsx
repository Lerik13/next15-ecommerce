//const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
import ProductList from '@/components/product/product-list'
import sampleData from '@/db/sample-data'

const HomePage = () => {
	//await delay(2000)

	return (
	<>
		<ProductList data={sampleData.products} title='Newest Arrivals' limit={4} />
	</>
	);
}
 
export default HomePage;