import { Button, Radio } from '@mui/material';
import React from 'react';

interface UserAddressCardProps {
    address: any;
    onEdit: (address: any) => void;
    onDelete: (addressId: number) => void;
    onSetDefault: (addressId: number) => void;
}

const UserAddressCard: React.FC<UserAddressCardProps> = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className='p-3 border-b border-gray-200 flex items-start gap-3 bg-white'>
        {/* Radio Button for Default Selection */}
        <div className='pt-1'>
             <Radio 
                checked={address.isDefault}
                onChange={() => !address.isDefault && onSetDefault(address.id)}
                value={address.id}
                name="address-radio"
                sx={{ p: 0, color: address.isDefault ? '#E27E6A' : 'gray', '&.Mui-checked': { color: '#E27E6A' } }}
             />
        </div>

        <div className='flex-1 space-y-1'>
            {/* Name and Phone */}
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <span className='font-semibold text-base'>{address.name}</span>
                    <span className='text-gray-500 text-sm'>|</span>
                    <span className='text-gray-500 text-sm'>{address.mobile}</span>
                </div>
                
                {/* Edit Button */}
                <Button 
                    size='small' 
                    sx={{ color: '#1976d2', textTransform: 'none', minWidth: 'auto', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                    onClick={() => onEdit(address)}
                >
                    Edit
                </Button>
            </div>

            {/* Address Details */}
            <p className='text-gray-600 text-sm'>
                {address.address}
            </p>
            <p className='text-gray-600 text-sm'>
                {address.ward}, {address.locality}, {address.city}
            </p>

            {/* Default Tag */}
            {address.isDefault && (
                <div className='mt-2'>
                    <span className='border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded-sm'>
                        Default
                    </span>
                </div>
            )}
            
            {/* Delete Option (Optional, maybe hidden in Edit or separate) - Keeping it simple as per mockup */}
            {/* If user wants delete, maybe add a small delete icon or put it in the edit modal? 
                The mockup shows "Sửa" (Edit). Usually Delete is inside Edit or a separate icon.
                For now, I'll add a small "Delete" next to Edit for functionality.
            */}
             <div className='flex justify-end mt-1'>
                 {!address.isDefault && (
                    <Button 
                        size='small' 
                        color='error'
                        sx={{ textTransform: 'none', minWidth: 'auto', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                        onClick={() => onDelete(address.id)}
                    >
                        Delete
                    </Button>
                 )}
            </div>
        </div>
    </div>
  )
}

export default UserAddressCard