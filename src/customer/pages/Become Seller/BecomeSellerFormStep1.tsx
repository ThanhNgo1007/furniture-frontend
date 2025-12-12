import { Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

const BecomSellerFormStep1 = ({formik}:any) => {
  const { t } = useTranslation();
  
  return (
    <Box>
        <p className='text-xl font-bold text-center pb-9'>
            {t('becomeSeller.step1.title')}
        </p>
      <div className='space-y-9 '>

        <TextField
                    fullWidth
                    name="mobile"
                    label={t('becomeSeller.step1.mobile')}
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                    sx={{mb:4}}

        />
        <TextField
                    fullWidth
                    name="MST"
                    label={t('becomeSeller.step1.mst')}
                    value={formik.values.MST}
                    onChange={formik.handleChange}
                    error={formik.touched.MST && Boolean(formik.errors.MST)}
                    helperText={formik.touched.MST && formik.errors.MST}

        />
        </div>
    </Box>
  )
}

export default BecomSellerFormStep1