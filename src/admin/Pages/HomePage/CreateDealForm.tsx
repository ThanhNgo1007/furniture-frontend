import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'

const CreateDealForm = () => {
    const formik = useFormik({
        initialValues: {
            discount: 0,
            category: ""
        },
        onSubmit: (values) => {
            console.log("Submit", values)
        }
    })
    return (
        <Box component={"form"} onSubmit={formik.handleSubmit}>
            <Typography variant='h4' className='text-center' sx={{ mb: 3 }}>
                Create Deal
            </Typography>

            <TextField
                fullWidth
                sx={{ mb: 3 }}
                name="discount"
                label="Discount"
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.category}
                    label="Category"
                    onChange={formik.handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>

            <Button 
                fullWidth 
                sx={{ py:".9rem", mt: 2 }}
                type="submit" 
                variant="contained"
            >
                Create Deal
            </Button>
        </Box>
    )
}

export default CreateDealForm
