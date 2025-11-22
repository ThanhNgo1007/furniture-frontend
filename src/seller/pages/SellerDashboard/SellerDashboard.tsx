import SellerRoutes from '../../../Routes/SellerRoutes'
import SellerDrawerList from '../../components/SellerDrawerList/SellerDrawerList'

const SellerDashboard = () => {

  const toggleDrawer = () => {
    // Drawer toggle logic here
  }
  return (
    <div>
        <div className="lg:flex lg:h-[93.5vh]">
            <section className='hidden lg:block h-full'>
                <SellerDrawerList toggleDrawer={toggleDrawer}/>
            </section>
            <section className='p-10 w-full lg:w-[80%] overflow-y-auto'>
                <SellerRoutes/>
            </section>
        </div>
    </div>
  )
}

export default SellerDashboard