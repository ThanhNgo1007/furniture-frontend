/* eslint-disable @typescript-eslint/no-explicit-any */
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { furnituresLevelThree } from '../../../data/category/levelthree/furnituresLevelThree'
import { lightingLevelThree } from '../../../data/category/levelthree/lightingLevelThree'
import { outdoorLevelThree } from '../../../data/category/levelthree/outdoorLevelThree'
import { rugsLevelThree } from '../../../data/category/levelthree/rugsLevelThree'
import { decorLevelTwo } from '../../../data/category/leveltwo/decorLevelTwo'
import { furnituresLevelTwo } from '../../../data/category/leveltwo/furnituresLevelTwo'
import { lightingLevelTwo } from '../../../data/category/leveltwo/lightingLevelTwo'
import { outdoorLevelTwo } from '../../../data/category/leveltwo/outdoorLevelTwo'
import { rugsLevelTwo } from '../../../data/category/leveltwo/rugsLevelTwo'
import { mainCategory } from '../../../data/category/mainCategory'
import { colors } from '../../../data/filter/color'
import { markOutOfStock, reactivateProduct, softDeleteProduct, updateProduct } from '../../../State/seller/sellerProductSlice'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import type { Product } from '../../../types/ProductTypes'
import { uploadToCloudinary } from '../../../Util/uploadToCloudinary'

const categoryTwo: { [key: string]: any[] } = {
  furnitures: furnituresLevelTwo,
  rugs: rugsLevelTwo,
  lighting: lightingLevelTwo,
  outdoor: outdoorLevelTwo,
  decor: decorLevelTwo
}

const categoryThree: { [key: string]: any[] } = {
  furnitures: furnituresLevelThree,
  rugs: rugsLevelThree,
  lighting: lightingLevelThree,
  outdoor: outdoorLevelThree
}

interface EditProductDialogProps {
  open: boolean
  product: Product | null
  onClose: () => void
  isInactive?: boolean
}

const EditProductDialog = ({ open, product, onClose, isInactive = false }: EditProductDialogProps) => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(store => store.sellerProduct)
  const [uploadImage, setUploadingImage] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      msrpPrice: '',
      sellingPrice: '',
      quantity: '',
      color: '',
      images: [] as string[],
      category: '',
      category2: '',
      category3: ''
    },
    enableReinitialize: true,
    validate: values => {
      const errors: any = {}
      const isInteger = (v: any) => /^[0-9]+$/.test(v.toString())

      if (!values.msrpPrice) {
        errors.msrpPrice = 'Vui lòng nhập giá gốc'
      } else if (!isInteger(values.msrpPrice)) {
        errors.msrpPrice = 'Giá phải là số nguyên'
      }

      if (!values.sellingPrice) {
        errors.sellingPrice = 'Vui lòng nhập giá bán'
      } else if (!isInteger(values.sellingPrice)) {
        errors.sellingPrice = 'Giá phải là số nguyên'
      }

      return errors
    },
    onSubmit: async values => {
      if (!product) return
      
      try {
        await dispatch(updateProduct({
          productId: product.id!,
          product: {
            title: values.title,
            description: values.description,
            msrpPrice: Number(values.msrpPrice),
            sellingPrice: Number(values.sellingPrice),
            quantity: Number(values.quantity),
            color: values.color,
            images: values.images,
            category: values.category,
            category2: values.category2,
            category3: values.category3
          },
          jwt: localStorage.getItem('jwt')
        })).unwrap()
        
        setSnackbar({ open: true, message: 'Cập nhật sản phẩm thành công!', severity: 'success' })
        setTimeout(() => onClose(), 1000)
      } catch (error: any) {
        setSnackbar({ open: true, message: error || 'Cập nhật thất bại', severity: 'error' })
      }
    }
  })

  // Helper function to get parent category IDs from the category hierarchy
  const getCategoryHierarchy = (category: any) => {
    let cat1 = '', cat2 = '', cat3 = ''
    
    if (category) {
      if (category.level === 3) {
        cat3 = category.categoryId || ''
        if (category.parentCategory) {
          cat2 = category.parentCategory.categoryId || ''
          if (category.parentCategory.parentCategory) {
            cat1 = category.parentCategory.parentCategory.categoryId || ''
          }
        }
      } else if (category.level === 2) {
        cat2 = category.categoryId || ''
        if (category.parentCategory) {
          cat1 = category.parentCategory.categoryId || ''
        }
      } else if (category.level === 1) {
        cat1 = category.categoryId || ''
      }
    }
    
    return { cat1, cat2, cat3 }
  }

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      const { cat1, cat2, cat3 } = getCategoryHierarchy(product.category)
      
      formik.setValues({
        title: product.title || '',
        description: product.description || '',
        msrpPrice: product.msrpPrice?.toString() || '',
        sellingPrice: product.sellingPrice?.toString() || '',
        quantity: product.quantity?.toString() || '',
        color: product.color || '',
        images: product.images || [],
        category: cat1,
        category2: cat2,
        category3: cat3
      })
    }
  }, [product])

  const childCategory = (category: any, parentCategoryId: any) => {
    return category?.filter((child: any) => child.parentCategoryId === parentCategoryId) || []
  }

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0]
    setUploadingImage(true)
    const image = await uploadToCloudinary(file)
    formik.setFieldValue('images', [...formik.values.images, image])
    setUploadingImage(false)
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.images]
    updatedImages.splice(index, 1)
    formik.setFieldValue('images', updatedImages)
  }

  const handleMarkOutOfStock = async () => {
    if (!product) return
    
    if (window.confirm('Bạn có chắc muốn đánh dấu sản phẩm này hết hàng?')) {
      try {
        await dispatch(markOutOfStock({
          productId: product.id!,
          jwt: localStorage.getItem('jwt')
        })).unwrap()
        
        setSnackbar({ open: true, message: 'Đã đánh dấu hết hàng!', severity: 'success' })
        setTimeout(() => onClose(), 1000)
      } catch (error: any) {
        setSnackbar({ open: true, message: error || 'Thao tác thất bại', severity: 'error' })
      }
    }
  }

  const handleDeleteProduct = async () => {
    if (!product) return
    
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này? Sản phẩm sẽ không hiển thị cho khách hàng nữa.')) {
      try {
        await dispatch(softDeleteProduct({
          productId: product.id!,
          jwt: localStorage.getItem('jwt')
        })).unwrap()
        
        setSnackbar({ open: true, message: 'Đã xóa sản phẩm!', severity: 'success' })
        setTimeout(() => onClose(), 1000)
      } catch (error: any) {
        setSnackbar({ open: true, message: error || 'Xóa thất bại', severity: 'error' })
      }
    }
  }

  const handleReactivate = async () => {
    if (!product) return
    
    if (window.confirm('Bạn có muốn đăng bán lại sản phẩm này không?')) {
      try {
        await dispatch(reactivateProduct({
          productId: product.id!,
          jwt: localStorage.getItem('jwt')
        })).unwrap()
        
        setSnackbar({ open: true, message: 'Đã đăng bán lại sản phẩm!', severity: 'success' })
        setTimeout(() => onClose(), 1000)
      } catch (error: any) {
        setSnackbar({ open: true, message: error || 'Thao tác thất bại', severity: 'error' })
      }
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Chỉnh sửa sản phẩm
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Images */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="edit-file-input"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="edit-file-input">
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        position: 'relative'
                      }}
                    >
                      <AddPhotoAlternateIcon color="action" />
                      {uploadImage && (
                        <CircularProgress size={24} sx={{ position: 'absolute' }} />
                      )}
                    </Box>
                  </label>
                  
                  {formik.values.images.map((image, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' }
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Title */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="title"
                  label="Tên sản phẩm"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Mô tả sản phẩm"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Prices and Quantity */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="msrpPrice"
                  label="Giá gốc"
                  value={formik.values.msrpPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.msrpPrice && Boolean(formik.errors.msrpPrice)}
                  helperText={formik.touched.msrpPrice && formik.errors.msrpPrice}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="sellingPrice"
                  label="Giá bán"
                  value={formik.values.sellingPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                  helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Số lượng"
                  type="number"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Color */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Màu sắc</InputLabel>
                  <Select
                    name="color"
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    label="Màu sắc"
                  >
                    <MenuItem value=""><em>Không chọn</em></MenuItem>
                    {colors.map((color) => (
                      <MenuItem key={color.name} value={color.name}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: color.hex,
                              border: color.name === 'White' ? '1px solid #ccc' : 'none'
                            }}
                          />
                          {color.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category Level 1 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục cấp 1</InputLabel>
                  <Select
                    name="category"
                    value={formik.values.category}
                    onChange={(e) => {
                      formik.handleChange(e)
                      formik.setFieldValue('category2', '')
                      formik.setFieldValue('category3', '')
                    }}
                    label="Danh mục cấp 1"
                  >
                    <MenuItem value=""><em>Không chọn</em></MenuItem>
                    {mainCategory.map((item) => (
                      <MenuItem key={item.categoryId} value={item.categoryId}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category Level 2 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục cấp 2</InputLabel>
                  <Select
                    name="category2"
                    value={formik.values.category2}
                    onChange={(e) => {
                      formik.handleChange(e)
                      formik.setFieldValue('category3', '')
                    }}
                    label="Danh mục cấp 2"
                    disabled={!formik.values.category}
                  >
                    <MenuItem value="">Không có</MenuItem>
                    {formik.values.category &&
                      categoryTwo[formik.values.category]?.map((item: any) => (
                        <MenuItem key={item.categoryId} value={item.categoryId}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category Level 3 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục cấp 3</InputLabel>
                  <Select
                    name="category3"
                    value={formik.values.category3}
                    onChange={formik.handleChange}
                    label="Danh mục cấp 3"
                    disabled={!formik.values.category2}
                  >
                    <MenuItem value="">Không có</MenuItem>
                    {formik.values.category2 &&
                      childCategory(
                        categoryThree[formik.values.category],
                        formik.values.category2
                      )?.map((item: any) => (
                        <MenuItem key={item.categoryId} value={item.categoryId}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Action Buttons */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RemoveShoppingCartIcon />}
                    onClick={handleMarkOutOfStock}
                    disabled={loading}
                  >
                    Đánh dấu hết hàng
                  </Button>
                  {isInactive ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleReactivate}
                      disabled={loading}
                    >
                      Đăng bán lại
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteProduct}
                      disabled={loading}
                    >
                      Xóa sản phẩm
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} color="inherit">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditProductDialog
