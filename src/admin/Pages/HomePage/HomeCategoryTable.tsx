import { Delete, Edit } from "@mui/icons-material";
import { Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../config/Api";
import { furnituresLevelThree } from "../../../data/category/levelthree/furnituresLevelThree";
import { lightingLevelThree } from "../../../data/category/levelthree/lightingLevelThree";
import { outdoorLevelThree } from "../../../data/category/levelthree/outdoorLevelThree";
import { rugsLevelThree } from "../../../data/category/levelthree/rugsLevelThree";
import type { HomeCategory } from "../../../types/homeCategoryTypes";

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
  name: string;
  categoryId: string;
  parentCategoryId: string;
  parentCategoryName: string;
}

// Combine all level 3 categories
const allLevelThreeCategories: Category[] = [
  ...furnituresLevelThree,
  ...lightingLevelThree,
  ...outdoorLevelThree,
  ...rugsLevelThree
];

export default function HomeCategoryTable() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HomeCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    categoryId: '',
    section: 'GRID',
    displayOrder: 0,
    isActive: true
  });
  
  // Bulk Delete State
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/home-category');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleEdit = (category: HomeCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      image: category.image,
      categoryId: category.categoryId,
      section: category.section || 'GRID',
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive !== undefined ? category.isActive : true
    });
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      image: '',
      categoryId: '',
      section: 'GRID',
      displayOrder: 0,
      isActive: true
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      // Validation for GRID section
      if (formData.section === 'GRID') {
        const gridCategories = categories.filter(c => c.section === 'GRID');
        
        // Check max 5 items
        if (!editingCategory && gridCategories.length >= 5) {
          alert('Maximum 5 items allowed in GRID section');
          return;
        }

        // Check display order range
        if (formData.displayOrder < 1 || formData.displayOrder > 5) {
          alert('Display order must be between 1 and 5');
          return;
        }

        // Check unique display order
        const isDuplicateOrder = gridCategories.some(c => 
          c.displayOrder === formData.displayOrder && 
          (!editingCategory || c.id !== editingCategory.id)
        );

        if (isDuplicateOrder) {
          alert(`Display order ${formData.displayOrder} is already taken in GRID section`);
          return;
        }
      }

      if (editingCategory) {
        // Update existing
        await api.patch(`/admin/home-category/${editingCategory.id}`, formData);
      } else {
        // Create new
        await api.post('/admin/home-category', formData);
      }
      setOpenDialog(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  // Bulk Delete Handlers
  const handleToggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedIds([]); // Reset selection when toggling
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = categories.map(cat => cat.id).filter((id): id is number => id !== undefined);
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
        selectedIds.slice(selectedIndex + 1),
      );
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("No items selected for deletion.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      try {
        // Delete each selected item
        await Promise.all(selectedIds.map(id => api.delete(`/admin/home-category/${id}`)));
        
        // Refresh and reset
        fetchCategories();
        setSelectedIds([]);
        setIsDeleteMode(false);
      } catch (error) {
        console.error("Failed to delete selected categories:", error);
        alert("Failed to delete some categories. Please try again.");
      }
    }
  };

  return (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
        {!isDeleteMode ? (
          <>
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Create New Category
            </Button>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleToggleDeleteMode}>
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="error" onClick={handleDeleteSelected}>
              Delete Selected ({selectedIds.length})
            </Button>
            <Button variant="outlined" onClick={handleToggleDeleteMode}>
              Cancel
            </Button>
          </>
        )}
      </div>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {isDeleteMode && (
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedIds.length > 0 && selectedIds.length < categories.length}
                    checked={categories.length > 0 && selectedIds.length === categories.length}
                    onChange={handleSelectAll}
                    inputProps={{
                      'aria-label': 'select all categories',
                    }}
                    sx={{ color: 'white' }}
                  />
                </StyledTableCell>
              )}
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Category ID</StyledTableCell>
              <StyledTableCell>Section</StyledTableCell>
              <StyledTableCell>Order</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => {
              const isItemSelected = selectedIds.indexOf(category.id!) !== -1;
              return (
                <StyledTableRow 
                  key={category.id}
                  hover
                  onClick={() => isDeleteMode && handleSelectRow(category.id!)}
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
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>{category.id}</StyledTableCell>
                  <StyledTableCell>
                    <img src={category.image} alt={category.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                  </StyledTableCell>
                  <StyledTableCell>{category.name}</StyledTableCell>
                  <StyledTableCell>{category.categoryId}</StyledTableCell>
                  <StyledTableCell>
                    <Chip label={category.section} color="primary" size="small" />
                  </StyledTableCell>
                  <StyledTableCell>{category.displayOrder}</StyledTableCell>
                  <StyledTableCell>
                    <Chip 
                      label={category.isActive ? 'Active' : 'Inactive'} 
                      color={category.isActive ? 'success' : 'default'} 
                      size="small" 
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button onClick={(e) => { e.stopPropagation(); handleEdit(category); }} disabled={isDeleteMode}>
                      <Edit />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.categoryId}
              label="Category"
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {allLevelThreeCategories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.name} ({cat.categoryId}) - {cat.parentCategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Section</InputLabel>
            <Select
              value={formData.section}
              label="Section"
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            >
              <MenuItem value="GRID">GRID</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Display Order"
            type="number"
            fullWidth
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
            inputProps={formData.section === 'GRID' ? { min: 1, max: 5 } : {}}
            helperText={formData.section === 'GRID' ? "Enter a number between 1 and 5" : ""}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.isActive}
              label="Status"
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value as boolean })}
            >
              <MenuItem value={true as any}>Active</MenuItem>
              <MenuItem value={false as any}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}