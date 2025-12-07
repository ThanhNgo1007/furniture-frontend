import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import InactiveProductTable from './InactiveProductTable'
import ProductTable from './ProductTable'

const Products = () => {
  const [tab, setTab] = useState(0)

  return (
    <div>
      <h1 className="font-bold mb-5 text-2xl">Các sản phẩm của bạn</h1>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Đang bán" />
          <Tab label="Ngưng bán" />
        </Tabs>
      </Box>

      {tab === 0 && <ProductTable />}
      {tab === 1 && <InactiveProductTable />}
    </div>
  )
}

export default Products