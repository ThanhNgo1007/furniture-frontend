import AddIcon from "@mui/icons-material/Add";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  addUserAddress,
  deleteUserAddress,
  fetchUserProfile,
  setDefaultAddress,
  updateUserAddress,
} from "../../../State/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import AddressForm from "./AddressForm";
import UserAddressCard from "./UserAddressCard";

const Address = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.auth);
  const jwt = localStorage.getItem("jwt");

  const [openModal, setOpenModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  useEffect(() => {
    if (jwt) {
      dispatch(fetchUserProfile({ jwt }));
    }
  }, [dispatch, jwt]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (address: any) => {
    setEditingAddress(address);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditingAddress(null);
  };

  const handleSubmit = (formData: any) => {
    if (!jwt) return;

    if (editingAddress) {
      dispatch(
        updateUserAddress({
          jwt,
          addressId: editingAddress.id,
          address: formData,
        })
      );
    } else {
      dispatch(addUserAddress({ jwt, address: formData }));
    }
  };

  const handleDelete = (addressId: number) => {
    if (jwt && window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteUserAddress({ jwt, addressId }));
    }
  };

  const handleSetDefault = (addressId: number) => {
    if (jwt) {
      dispatch(setDefaultAddress({ jwt, addressId }));
    }
  };

  return (
    <div className="space-y-5 py-5">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="font-bold text-gray-700">
          My Addresses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: "#E27E6A" }}
        >
          Add New Address
        </Button>
      </div>

      <div className="space-y-3">
        {user?.addresses && user.addresses.length > 0 ? (
          user.addresses.map((address: any) => (
            <UserAddressCard
              key={address.id}
              address={address}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))
        ) : (
          <Typography className="text-gray-500 text-center py-10">
            No addresses found. Add one now!
          </Typography>
        )}
      </div>

      <AddressForm
        open={openModal}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        initialValues={editingAddress}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      />
    </div>
  );
};

export default Address;