/* eslint-disable @typescript-eslint/no-explicit-any */
import { Radio } from '@mui/material'
import React from 'react'

const AddressCard = () => {
    const handleChange = (event:any) => {
        console.log(event.target.checked)
    }
  return (
    <div className='p-5 border border-gray-200 rounded-md flex'>
        <div>
            <Radio
                checked={true}
                onChange={handleChange}
                value=""
                name="radio-button"
                color='success'
            />
        </div>
        <div className='space-y-3 pt-2'>
            <h1>Ngo Huu Thanh</h1>
            <p className='w-[320px]'>
                Dong Van Cong, Binh Thuy, Can Tho
            </p>
            <p>
                <strong>Mobile phone: </strong> +848888888888
            </p>
        </div>
    </div>
  )
}

export default AddressCard