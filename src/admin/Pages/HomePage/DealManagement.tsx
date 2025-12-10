
import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { bulkDeleteDeals, createDeal, deleteDeal, fetchDeals, updateDeal } from "../../../State/admin/dealSlice";
import { fetchAllProducts } from "../../../State/customer/ProductSlice";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import type { Deal } from "../../../types/dealTypes";
import type { Product } from "../../../types/ProductTypes";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface Category {
  id: number;
  categoryId: string;
  name: string;
  level: number;
  parentCategoryId?: string;
}

export default function DealManagement() {
  const dispatch = useAppDispatch();
  const { deals } = useAppSelector(state => state.deal || { deals: [] });
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    discount: 0,
    image: ''
  });
  const [maxDiscount, setMaxDiscount] = useState(100);

  // Bulk Delete State
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchDeals());
    fetchProductsData();
  }, [dispatch]);

  const fetchProductsData = async () => {
    try {
      const resultAction = await dispatch(fetchAllProducts({ pageSize: 100 }));
      if (fetchAllProducts.fulfilled.match(resultAction)) {
        const productsData = resultAction.payload.content || [];
        setProducts(productsData);
        extractCategories(productsData);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const extractCategories = (productsData: Product[]) => {
    const uniqueCategories = new Map<number, Category>();
    productsData.forEach((product: Product) => {
      if (product.category && product.category.level === 3 && product.category.id) {
        const cat = product.category;
        const catId = cat.id!; 
        if (!uniqueCategories.has(catId)) {
          uniqueCategories.set(catId, {
            id: catId,
            categoryId: cat.categoryId,
            name: cat.name,
            level: cat.level,
            parentCategoryId: cat.parentCategory?.categoryId
          });
        }
      }
    });
    setCategories(Array.from(uniqueCategories.values()));
  };

  const calculateMaxDiscount = (categoryId: string) => {
    // Find products in this category
    const categoryProducts = products.filter(p => p.category?.categoryId === categoryId);
    
    if (categoryProducts.length === 0) {
      return 0;
    }

    // Get max discount from products in this category
    const maxProductDiscount = Math.max(...categoryProducts.map(p => p.discountPercent || 0));
    return maxProductDiscount;
  };

  const handleCategoryChange = (selectedId: string) => {
    setFormData({ ...formData, categoryId: selectedId, discount: 0 });
    
    // Find the selected category to get its categoryId
    const selectedCategory = categories.find(cat => cat.id.toString() === selectedId);
    if (selectedCategory) {
      const max = calculateMaxDiscount(selectedCategory.categoryId);
      setMaxDiscount(max);
    }
  };

  const handleCreate = () => {
    setEditingDeal(null);
    setFormData({
      categoryId: '',
      discount: 0,
      image: ''
    });
    setMaxDiscount(100);
    setOpenDialog(true);
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    const categoryId = deal.category.categoryId;
    setFormData({
      categoryId: deal.category.id?.toString() || '',
      discount: deal.discount,
      image: deal.image || ''
    });
    const max = calculateMaxDiscount(categoryId);
    setMaxDiscount(max);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    // Find the selected category
    const selectedCategory = categories.find(cat => cat.id.toString() === formData.categoryId);
    if (!selectedCategory) {
      alert('Vui lòng chọn danh mục');
      return;
    }

    // Validate discount
    const maxAllowed = calculateMaxDiscount(selectedCategory.categoryId);
    if (formData.discount > maxAllowed) {
      alert(`Giảm giá không được vượt quá ${maxAllowed}% (mức giảm giá tối đa của các sản phẩm trong danh mục này)`);
      return;
    }

    const payload = {
      category: { id: parseInt(formData.categoryId) },
      discount: formData.discount,
      image: formData.image
    };

    if (editingDeal) {
      await dispatch(updateDeal({ id: editingDeal.id!, deal: payload }));
    } else {
      await dispatch(createDeal(payload));
    }
    setOpenDialog(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ưu đãi này?')) {
      await dispatch(deleteDeal(id));
    }
  };

  // Bulk Delete Handlers
  const handleToggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedIds([]);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = deals.map((deal) => deal.id!).filter((id) => id !== undefined);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một ưu đãi để xóa');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} ưu đãi đã chọn?`)) {
      await dispatch(bulkDeleteDeals(selectedIds));
      setSelectedIds([]);
      setIsDeleteMode(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
        {!isDeleteMode ? (
          <>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleCreate}>
              Tạo ưu đãi mới
            </Button>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleToggleDeleteMode}>
              Xóa
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="error" onClick={handleDeleteSelected}>
              Xóa đã chọn ({selectedIds.length})
            </Button>
            <Button variant="outlined" onClick={handleToggleDeleteMode}>
              Hủy
            </Button>
          </>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="deals table">
          <TableHead>
            <TableRow>
              {isDeleteMode && (
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedIds.length > 0 && selectedIds.length < deals.length}
                    checked={deals.length > 0 && selectedIds.length === deals.length}
                    onChange={handleSelectAll}
                    inputProps={{
                      'aria-label': 'select all deals',
                    }}
                    sx={{ color: 'white' }}
                  />
                </StyledTableCell>
              )}
              <StyledTableCell>STT</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Ảnh</StyledTableCell>
              <StyledTableCell>Danh mục</StyledTableCell>
              <StyledTableCell>ID Danh mục</StyledTableCell>
              <StyledTableCell>Giảm giá %</StyledTableCell>
              <StyledTableCell align="right">Hành động</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map((deal, index) => {
              const isItemSelected = selectedIds.indexOf(deal.id!) !== -1;
              return (
                <StyledTableRow 
                  key={deal.id}
                  hover
                  onClick={() => isDeleteMode && handleSelectRow(deal.id!)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{ cursor: isDeleteMode ? 'pointer' : 'default' }}
                >
                  {isDeleteMode && (
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': `enhanced-table-checkbox-${index}`,
                        }}
                      />
                    </StyledTableCell>
                  )}
                  <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{deal.id}</StyledTableCell>
                <StyledTableCell>
                  <img src={deal.image || deal.category.image} alt={deal.category.name} style={{ width: 50, height: 50, objectFit: 'cover' }} 
                       onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50' }} />
                </StyledTableCell>
                <StyledTableCell>{deal.category.name}</StyledTableCell>
                <StyledTableCell>{deal.category.categoryId}</StyledTableCell>
                <StyledTableCell>
                  <Chip label={`${deal.discount}%`} color="error" size="small" />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button onClick={() => handleEdit(deal)} size="small">
                    <Edit />
                  </Button>
                  <Button onClick={() => handleDelete(deal.id!)} size="small" color="error">
                    <Delete />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            )})}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDeal ? 'Cập nhật ưu đãi' : 'Tạo ưu đãi mới'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục (Chỉ cấp 3)</InputLabel>
            <Select
              value={formData.categoryId}
              label="Danh mục (Chỉ cấp 3)"
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label={`Phần trăm giảm giá (Tối đa: ${maxDiscount}%)`}
            type="number"
            fullWidth
            value={formData.discount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value <= maxDiscount) {
                setFormData({ ...formData, discount: value });
              }
            }}
            inputProps={{ min: 0, max: maxDiscount }}
            helperText={`Giảm giá tối đa cho phép: ${maxDiscount}% (dựa trên sản phẩm trong danh mục này)`}
          />
          <TextField
            margin="dense"
            label="URL Ảnh"
            type="text"
            fullWidth
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            helperText="Nhập URL của ảnh ưu đãi"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
