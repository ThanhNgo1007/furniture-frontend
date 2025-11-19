/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterAlt } from '@mui/icons-material'
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { fetchAllProducts } from '../../../State/customer/ProductSlice'
import FilterSection from './FilterSection'
import ProductCard from './ProductCard'

const Product = () => {
  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'))
  const [sort, setSort] = useState()
  const [page, setPage] = useState(1)
  const dispatch = useAppDispatch()
  const [searchParam, setSearchParams] = useSearchParams()
  const { category } = useParams()
  const { product } = useAppSelector(store => store)
  const handleSortChange = (event: any) => {
    setSort(event.target.value)
  }

  const handlePageChange = (value: number) => {
    setPage(value)
  }

  // Trong file: Product.tsx

  useEffect(() => {
    // 1. Lấy tất cả giá trị
    const [minPrice, maxPrice] = searchParam.get('price')?.split('-') || []
    const color = searchParam.get('color')
    const minDiscount = searchParam.get('discount')
      ? Number(searchParam.get('discount'))
      : undefined
    const pageNumber = page - 1 // page lấy từ state

    // 2. TẠO MỘT OBJECT PHẲNG chứa TẤT CẢ tham số
    const params = {
      category: category, // Lấy từ useParams
      color: color || '',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minDiscount: minDiscount,
      pageNumber: pageNumber,
      sort: sort || '' // Lấy từ state 'sort'
    }

    // 3. Dispatch object phẳng này
    dispatch(fetchAllProducts(params))

    // 4. Thêm `page`, `sort`, `dispatch` vào dependency array
  }, [category, searchParam, page, sort, dispatch])
  return (
    <div className="-z-10 mt-10">
      <div>
        <h1
          className="text-3xl font-bold text-center pb-5 px-9
        uppercase space-x-2"
        >
          Dressers & storage drawers
        </h1>
      </div>
      <div className="lg:flex">
        <section className="filter_section hidden lg:block w-[15%]">
          <FilterSection />
        </section>
        <div className="w-full lg:w-[85%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton>
                  <FilterAlt />
                </IconButton>
              )}
              {!isLarge && (
                <Box>
                  <FilterSection />
                </Box>
              )}
            </div>
            <FormControl size="small" sx={{ width: '200px' }}>
              <InputLabel id="demo-simple-select-label">Sort</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                label="Sort"
                onChange={handleSortChange}
              >
                <MenuItem value={'price_low'}>Price: Low - High</MenuItem>
                <MenuItem value={'price_high'}>Price: High - Low</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider />
          <section
            className="products_section grid sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 gap-y-5 px-4 justify-center max-w-[1500px] mx-auto"
          >
            {product.products.map(item => (
              <ProductCard item={item} />
            ))}
          </section>
          <div className="flex justify-center py-2">
            <Pagination
              onChange={(e, value) => handlePageChange(value)}
              count={10}
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
