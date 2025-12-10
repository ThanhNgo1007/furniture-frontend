/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../config/Api';

export const uploadToCloudinary = async(pics: any) => {
    const cloud_name = "dtlxpw3eh"
    const upload_preset = "furniture_ecommerce"

    if(pics){
        const data = new FormData();
        data.append("file",pics);
        data.append("upload_preset", upload_preset);
        data.append("cloud_name", cloud_name);


        const res = await fetch("https://api.cloudinary.com/v1_1/dtlxpw3eh/image/upload", {
            method: "POST",
            body: data,
        })

        const fileDate=await res.json();
        return fileDate.url;
    }
    else {
        console.log("error: pics not found");
    }
}

/**
 * Delete an image from Cloudinary via backend API
 * @param imageUrl The full Cloudinary URL of the image to delete
 * @returns true if deletion was successful, false otherwise
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<boolean> => {
    if (!imageUrl || !imageUrl.includes('cloudinary')) {
        console.log("Not a Cloudinary URL, skipping delete:", imageUrl);
        return true; // Not a Cloudinary image, no need to delete
    }

    try {
        await api.delete('/api/cloudinary/delete', {
            params: { imageUrl }
        });
        console.log("Successfully deleted image from Cloudinary:", imageUrl);
        return true;
    } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        return false;
    }
}