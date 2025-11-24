
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { colors } from '../../../data/filter/color'
import { discount } from '../../../data/filter/discount'
import { price } from '../../../data/filter/price'

const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false)
  const handleColorToggle = () => {
    setExpendColor(!expendColor)
  }

  const [searchParams, setSearchParams] = useSearchParams()

  // BƯỚC 1: Đọc các giá trị filter hiện tại từ URL
  // Nếu không có giá trị, đặt là chuỗi rỗng ""
  const color = searchParams.get('color') || ''
  const discountParam = searchParams.get('discount') || ''
  const priceParam = searchParams.get('price') || ''

  // Hàm update vẫn giữ nguyên, nó đã chính xác
  const updateFilterParams = (e: any) => {
    const { value, name } = e.target
    if (value) {
      searchParams.set(name, value)
    } else {
      searchParams.delete(name)
    }
    setSearchParams(searchParams)
  }

  // BƯỚC 2: Đơn giản hóa hàm clearAllFilters
  // Chỉ cần set searchParams về rỗng, các RadioGroup sẽ tự động cập nhật
  const clearAllFilters = () => {
    setSearchParams({})
    setExpendColor(false) // Reset cả UI mở rộng màu nếu cần
  }

  return (
    <div className="-z-50 space-y-5">
      <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
        <p className="text-lg font-semibold">Filters</p>
        <Button
          onClick={clearAllFilters}
          size="small"
          className="cursor-pointer font-semibold"
        >
          Clear all
        </Button>
      </div>
      <Divider />
      <div className="px-9 space-y-6">
        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                pb: '14px',
                pt: '15px'
              }}
              className="text-2xl font-semibold"
              id="color"
            >
              Color
            </FormLabel>
            <RadioGroup
              aria-labelledby="color"
              name="color"
              onChange={updateFilterParams}
              // BƯỚC 3: Dùng `value={color}` thay vì `defaultValue`
              value={color}
            >
              {colors.slice(0, expendColor ? colors.length : 3).map(item => (
                <FormControlLabel
                  value={item.name}
                  control={<Radio size="small" />}
                  key={item.name}
                  label={
                    <div className="flex items-center gap-3">
                      <p>{item.name}</p>
                      <span
                        style={{ backgroundColor: item.hex }}
                        className={`h-5 w-5 rounded-full ${
                          item.name === 'White' ? 'border' : ''
                        }`}
                      ></span>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
          <div>
            <button
              onClick={handleColorToggle}
              className="text-gray-500 flex item-center cursor-pointer hover:text-yellow-400"
            >
              {expendColor ? 'Show less' : `+${colors.length - 3} More`}
            </button>
          </div>
        </section>

        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                pb: '14px',
                pt: '15px'
              }}
              className="text-2xl font-semibold"
              id="discount"
            >
              {' '}
              {/* Sửa id cho đúng */}
              Discount {/* Sửa lỗi copy-paste: "Color" -> "Discount" */}
            </FormLabel>
            <RadioGroup
              aria-labelledby="discount"
              onChange={updateFilterParams}
              name="discount"
              // BƯỚC 3: Dùng `value={discountParam}` thay vì `defaultValue`
              value={discountParam}
            >
              {discount.map((item, index) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>

        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                pb: '14px',
                pt: '15px'
              }}
              className="text-2xl font-semibold"
              id="price"
            >
              Price
            </FormLabel>
            <RadioGroup
              aria-labelledby="price"
              onChange={updateFilterParams}
              name="price"
              // BƯỚC 3: Dùng `value={priceParam}` thay vì `defaultValue`
              value={priceParam}
            >
              {price.map((item, index) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                  sx={{
                    pb: '10px',
                    pt: '10px'
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  )
}

export default FilterSection
