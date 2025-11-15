import React from 'react'
import { Avatar, Box, Grid, IconButton, Rating} from '@mui/material';
import { Delete } from '@mui/icons-material';

const ReviewCard = () => {
  return (
    <div className='justify-between flex'>
        <Grid container spacing={9}>
            <Grid size={{xs:1}}>
                <Box>
                    <Avatar className='text-white'
                    sx={{width:56, height:56, bgcolor: "#9155FD"}}>
                        T
                    </Avatar>
                    
                </Box>

            </Grid>
            <Grid size={{xs:9}}>
                <div className='space-y-2'>
                    <div>
                        <p className='font-semibold text-lg'>
                            Ngo Huu Thanh
                        </p>
                        <p className="opacity-70">2025-10-19</p>

                    </div>
                    <Rating
                    readOnly
                    value={4.5}
                    precision={.5}/>
                    <p className="">Hop tui tien, san pham rat tot</p>
                    <div>
                        <img className="w-24 h-24 object-cover" src='https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storklinta-6-drawer-dresser-white-anchor-3_bjxo2y.avif' 
                        alt="" />
                    </div>


                </div>

            </Grid>
        </Grid>
        <div>
            <IconButton>
                <Delete sx={{color:"error.main"}}/>
            </IconButton>
        </div>
    </div>
  )
}

export default ReviewCard