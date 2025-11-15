/* eslint-disable @typescript-eslint/no-explicit-any */
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