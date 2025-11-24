import CategoryGrid from './CategoryGrid/CategoryGrid'
import CommunityImpact from './CommunityImpact'
import Deal from './Deal/Deal'
import DecorCategory from './DecorCategory'
import RoomCategory from './ShopByCategory/ShopByCategory'

const Home = () => {
  return (
    <>
        <div className='space-y-5 lg:space-y-10 relative'>
            <DecorCategory/>
            <CategoryGrid/>
            <Deal/>
            <CommunityImpact/>
            <RoomCategory/>
        </div>
          </>
      
          
          )
          }

          export default Home