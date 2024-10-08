import { v2 as cloudinary } from 'cloudinary';
import fs  from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SEcRET
});


const uploadOnCloudinary=async(localFilePath)=>{

  
  try {
    if(!localFilePath) return null
    //upload the file on cloudinary 
    const response =await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })
    //file has been successfully uploaded
    console.log("file os uploaded on cloudinary",response.url);
     return response;
} catch (error) {
    fs.unlinkSync(localFilePath)//remove the locally saved temporarily file as the upload operation got failed
    return null;
  }

}


export {uploadOnCloudinary}





