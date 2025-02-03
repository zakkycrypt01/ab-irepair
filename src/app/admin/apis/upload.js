import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

  console.log(cloudinary.config)

const upload = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
    };
    try{
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log(result);
        return result.public_id;
    }catch(error){
        console.log(error);
    }
};

//   const getUpload = async (publicId) => {
//     const options = {
//         colors : true,
//     };
//     try{
//         const result = await cloudinary.api.resource(publicId, options);
//         console.log(result);
//         return result.colors;
//     } catch(error){
//         console.log(error);
//     }
//   }

  export default upload;