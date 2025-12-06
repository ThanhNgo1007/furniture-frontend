/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Close, FilterAlt } from '@mui/icons-material'; // Thêm Close icon
import {
    Box,
    Button,
    Divider,
    Drawer, // Thêm Drawer
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchAllProducts } from '../../../State/customer/ProductSlice';
import { getWishlistByUserId } from '../../../State/customer/wishlistSlice';

import FilterSection from './FilterSection';
import ProductCard from './ProductCard';

const Product = () => {
  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'))
  const [sort, setSort] = useState("") 
  const [page, setPage] = useState(1)
  const dispatch = useAppDispatch()
  const [searchParam] = useSearchParams() 
  const { category } = useParams()
  const product = useAppSelector(store => store.product)
  const { t } = useTranslation()
  
  // --- STATE MỚI: Quản lý đóng/mở Filter trên Mobile ---
  const [openFilter, setOpenFilter] = useState(false);

  const handleSortChange = (event: any) => {
    setSort(event.target.value)
  }

  const handlePageChange = (value: number) => {
    setPage(value)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if(localStorage.getItem("jwt")) {
        dispatch(getWishlistByUserId());
    }
  }, [dispatch]);

  useEffect(() => {
    const colorValue = searchParam.get('color')
    const priceValue = searchParam.get('price')
    const discountValue = searchParam.get('discount')
    const stock = searchParam.get('stock')
    
    const isFiltering = colorValue || priceValue || discountValue || stock || sort;

    let minPrice = undefined;
    let maxPrice = undefined;

    if (priceValue) {
        const [min, max] = priceValue.split('-');
        minPrice = Number(min);
        maxPrice = max && max !== "null" ? Number(max) : undefined; 
    }

    const data = {
      category: category || "",
      color: colorValue || "",
      minPrice: minPrice,      
      maxPrice: maxPrice,      
      minDiscount: discountValue ? Number(discountValue) : undefined,
      sort: isFiltering ? (sort || "price_low") : "random",
      pageNumber: page - 1,
      stock: stock || null,
      pageSize: isFiltering ? 12 : 8
    }

    dispatch(fetchAllProducts(data))

  }, [category, searchParam, sort, page, dispatch]) 

  return (
    <div className="-z-10 mt-10">
      <div>
        <h1 className="text-3xl font-bold text-center pb-5 px-9 uppercase space-x-2">
          {(() => {
            if (!category) return "";
            if (t(`category.level2.${category}`) !== `category.level2.${category}`) {
              return t(`category.level2.${category}`);
            }
            if (t(`category.level3.${category}`) !== `category.level3.${category}`) {
              return t(`category.level3.${category}`);
            }
            return category.replace(/-/g, " ");
          })()}
        </h1>
      </div>
      <div className="lg:flex">
        {/* Filter cho Desktop (Giữ nguyên) */}
        <section className="filter_section hidden lg:block w-[15%]">
          <FilterSection />
        </section>
        
        <div className="w-full lg:w-[85%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="relative w-[50%]">
              {/* Nút mở Filter cho Mobile */}
              {!isLarge && (
                 <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setOpenFilter(true)} // Mở Drawer khi click
                 >
                    <IconButton>
                        <FilterAlt />
                    </IconButton>
                    <span className="text-sm font-bold hover:text-teal-600 transition-colors">
                        {t('product_listing.filters')}
                    </span>
                 </div>
              )}
            </div>
            
            <FormControl size="small" sx={{ width: '200px' }}>
              <InputLabel>{t('product_listing.sort')}</InputLabel>
              <Select
                value={sort}
                label={t('product_listing.sort')}
                onChange={handleSortChange}
              >
                <MenuItem value={'price_low'}>{t('product_listing.price_low_high')}</MenuItem>
                <MenuItem value={'price_high'}>{t('product_listing.price_high_low')}</MenuItem>
                <MenuItem value={'newest'}>{t('product_listing.newest')}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider />
          
          <section className="products_section">
            {product.products && product.products.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-4 justify-center max-w-[1500px] mx-auto">
                {product.products.map((item: any) => (
                  <ProductCard item={item} key={item.id} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] opacity-60 w-full">
                <FilterAlt sx={{ fontSize: 80, color: 'gray', mb: 2 }} />
                <p className="text-xl font-medium text-gray-500">
                  {t('product_listing.no_products_found') || "Không tìm thấy sản phẩm nào"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Vui lòng thử lại với bộ lọc khác
                </p>
              </div>
            )}
          </section>

          <div className="flex justify-center py-10">
            <Pagination
              onChange={(_e, value) => handlePageChange(value)}
              count={product.totalPages || 1} 
              color="primary"
              page={page}
            />
          </div>
        </div>
      </div>

      {/* --- COMPONENT DRAWER (FILTER MOBILE) --- */}
      <Drawer
        anchor="bottom" // Trượt từ dưới lên (giống các app TMĐT)
        open={openFilter}
        onClose={() => setOpenFilter(false)} // Bấm ra ngoài (backdrop) thì đóng
        sx={{ 
            '& .MuiDrawer-paper': { 
                height: '85vh', // Chiếm 85% chiều cao màn hình
                borderTopLeftRadius: 16, 
                borderTopRightRadius: 16 
            } 
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header của Drawer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <span className="text-xl font-bold text-gray-800">{t('product_listing.filter_products')}</span>
                <IconButton onClick={() => setOpenFilter(false)}>
                    <Close />
                </IconButton>
            </Box>

            {/* Nội dung Filter (Có thể cuộn) */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
                <FilterSection />
            </Box>

            {/* Footer (Nút Xem kết quả) */}
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                 <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => setOpenFilter(false)} // Đóng drawer -> useEffect đã chạy khi filter thay đổi
                    sx={{ 
                        bgcolor: 'teal', 
                        color: 'white', 
                        py: 1.5, 
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#0d9488' } 
                    }}
                 >
                    {t('product_listing.show_results')}
                 </Button>
            </Box>
        </Box>
      </Drawer>
      {/* --------------------------------------- */}
    </div>
  )
}

export default Product