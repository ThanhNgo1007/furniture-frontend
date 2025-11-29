/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-condition */
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
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
import { createProduct } from '../../../State/seller/sellerProductSlice'
import { useAppDispatch } from '../../../State/Store'
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
  // Note: decor only has level 2 categories, no level 3
}

const AddProduct = () => {
  const [uploadImage, setUploadingImage] = useState(false)

  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      msrpPrice: '',
      sellingPrice: '',
      quantity: '',
      color: '',
      images: [],
      category: '',
      category2: '',
      category3: ''
    },

    validate: values => {
      const errors: any = {}

      const isInteger = (v: any) => /^[0-9]+$/.test(v.toString()) // chỉ nhận số nguyên

      // MSRP Price must be a whole number
      if (!values.msrpPrice) {
        errors.msrpPrice = 'MSRP price is required'
      } else if (!isInteger(values.msrpPrice)) {
        errors.msrpPrice = 'Price must be a whole number (no decimals)'
      }

      // Selling Price must be a whole number
      if (!values.sellingPrice) {
        errors.sellingPrice = 'Selling price is required'
      } else if (!isInteger(values.sellingPrice)) {
        errors.sellingPrice = 'Price must be a whole number (no decimals)'
      }

      return errors
    },

    onSubmit: values => {
      console.log(values)
      dispatch(createProduct({ request: values, jwt: localStorage.getItem('jwt') }))
    }
  })

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

  const childCategory = (category: any, parentCategoryId: any) => {
    return category.filter((child: any) => {
      return child.parentCategoryId == parentCategoryId
    })
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>
          <Grid className="flex flex-wrap gap-5" size={{ xs: 12 }}>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />

            <label className="relative" htmlFor="fileInput">
              <span
                className="w-24 h-24 cursor-pointer flex items-center justify-center
                        p-3 border rounded-md border-gray-400"
              >
                <AddPhotoAlternateIcon className="text-gray-700" />
              </span>
              {uploadImage && (
                <div
                  className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex 
                            justify-center items-center"
                >
                  <CircularProgress />
                </div>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image, index) => (
                <div className="relative">
                  <img
                    className="w-24 h-24 object-cover"
                    key={index}
                    src={image}
                    alt={`ProductImage ${index + 1}`}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className=""
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      outline: 'none'
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              multiline
              rows={4}
              fullWidth
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : `${formik.values.description.length}/2000 characters`
              }
              inputProps={{
                maxLength: 2000
              }}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <TextField
              fullWidth
              id="msrp_price"
              name="msrpPrice"
              label="MSRP Price"
              value={formik.values.msrpPrice}
              onChange={formik.handleChange}
              error={formik.touched.msrpPrice && Boolean(formik.errors.msrpPrice)}
              helperText={formik.touched.msrpPrice && formik.errors.msrpPrice}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <TextField
              fullWidth
              id="sellingPrice"
              name="sellingPrice"
              label="Selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
              helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <FormControl
              fullWidth
              error={formik.touched.color && Boolean(formik.errors.color)}
              required
            >
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color-label"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="color"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {colors.map((color) => (
                  <MenuItem value={color.name}>
                    <div className="flex gap-3">
                      <span
                        style={{ backgroundColor: color.hex }}
                        className={`h-5 w-5
                                    rounded-full ${
                                      color.name === 'White' ? 'border' : ''
                                    }`}
                      ></span>
                      <p>{color.name}</p>
                    </div>
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.color && formik.errors.color && (
                <FormHelperText>{formik.errors.color}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <FormControl
              fullWidth
              error={formik.touched.category && Boolean(formik.errors.category)}
              required
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                label="Category"
              >
                {mainCategory.map(item => (
                  <MenuItem value={item.categoryId}>{item.name}</MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <FormControl
              fullWidth
              error={formik.touched.category && Boolean(formik.errors.category)}
              required
            >
              <InputLabel id="category2-label">Second Category</InputLabel>
              <Select
                labelId="category2-label"
                id="category2"
                name="category2"
                value={formik.values.category2}
                onChange={formik.handleChange}
                label="Second Category"
              >
                <MenuItem value="none">none</MenuItem>
                {formik.values.category &&
                  categoryTwo[formik.values.category]?.map((item, index) => (
                    <MenuItem key={index} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <FormControl
              fullWidth
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <InputLabel id="category-label">Third Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category3"
                value={formik.values.category3}
                onChange={formik.handleChange}
                label="Third Category"
              >
                <MenuItem value="none">
                  <em>None</em>
                </MenuItem>
                {formik.values.category2 &&
                  childCategory(
                    categoryThree[formik.values.category],
                    formik.values.category2
                  )?.map((item: any, index: any) => (
                    <MenuItem key={index} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              sx={{ p: '14px' }}
              color="success"
              variant="contained"
              type="submit"
            >
              {false ? (
                <CircularProgress size="small" sx={{ width: '27px', height: '27px' }} />
              ) : (
                'Add Product'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default AddProduct
