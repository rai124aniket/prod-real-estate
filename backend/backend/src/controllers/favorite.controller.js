import prisma from "../prismaClient.js";


export const addFavorite=async(req,res)=>{
    try {
        const favorite=await prisma.favorite.create({
            data:{
                userId:req.user.id,
                propertyId:parseInt(req.params.propertyId)
            },
        })
        res.json(favorite);
    } catch (error) {
        res.json({
            msg:error
        })
    }
}


export const removeFavorite=async(req,res)=>{
    try {
        await prisma.favorite.deleteMany({
            where:{
                userId:req.user.id,
                propertyId:parseInt(req.params.propertyId),
            }
        
        })
        
        res.json({
            
            msg:"removed from favorite"
        })
        
    } catch (error) {
        res.json({
            msg:error
        })
    }
}

export const getFavorite=async(req,res)=>{
    try {
        const favorite=await prisma.favorite.findMany({
            where:{userId:req.user.id},
            include:{
                property:true,
            }
        })
        res.json(favorite) 

    } catch (error) {
        res.json({
            msg:error
        })
    }
}