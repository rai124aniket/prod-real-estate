import cloudinary from "../utils/cloudiary.js";

export const uploadImage=async (req,res)=>{
    try {
        const { image }=req.body;
        if(!image){
            return res.json({ msg: "No image provided" });
        }
        const result = await cloudinary.uploader.upload(image, {
            folder: "realestate", 
        });
      
        res.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        res.json({ msg: "Cloudinary upload failed", error });
    }
}
