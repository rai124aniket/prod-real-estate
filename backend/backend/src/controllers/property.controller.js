import prisma from "../prismaClient.js";

export const createProperty=async (req,res)=>{
    try {
        const {title,description,price,location,imageUrl}=req.body
        const property=await prisma.property.create({
           data:{
            title,
            description,
            price,
            location,
            imageUrl,
            ownerId:req.user.id
           }
        })
        res.json(property)
    } catch (error) {
        res.json({
            msg:"something went wrong in property controller"
        })
    }
}


export const getProperty=async(req,res)=>{
    try {
        const property=await prisma.property.findMany({
            include: { 
                owner: {
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            },
        })
    
        res.json(property);
        
    } catch (error) {
        res.json({
            msg:error
        })
    }
}
export const getMyProperty=async(req,res)=>{
    try {
        const myProperty=await prisma.property.findMany({
            where:{ownerId:req.user.id},
            include:{
                owner: {
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            }

        })
        res.json(myProperty)
    } catch (error) {
        res.json({
            msg:error
        })
    }
}
export const getOneProperty=async (req,res)=>{
    
    try {
        const property=await prisma.property.findUnique({
            where:{
                id:parseInt(req.params.propertyId)
            },
            include:{
                owner:true
            },
        })
        res.json(property)
        
    } catch (error) {
        
        res.json({
            msg:error.message
        })
        
    }
}


export const updateProperty=async (req,res)=>{
    try {
        const property=await prisma.property.findUnique({
            where:{
                id:parseInt(req.params.propertyId)
            }
        })
        if(property.ownerId!=req.user.id){
            return res.json({
                msg:"user not authorized"
            })
        }
        const { title, description, price, location,imageUrl }=req.body

        const updated = await prisma.property.update({
            where: { id: property.id },
            data: {
              title: title ?? property.title,
              description: description ?? property.description,
              location: location ?? property.location,
              imageUrl: imageUrl ?? property.imageUrl,
              price: price ? Number(price) : property.price
            }
          });
                   
        res.json(updated)
        
    } catch (error) {  
        res.json({
            msg:error
        })
    }
}

export const deleteProperty=async(req,res)=>{
    console.log("req.user:", req.user); 
    console.log("req.params:", req.params.propertyId);
    try {
        const property=await prisma.property.findUnique({
            where:{
                id:parseInt(req.params.propertyId)
            }
        })
        console.log(property.id)
        console.log("hello1")
        if (!property) {
            return res.status(404).json({ msg: "Property not found" });
        }
        console.log("hello2")
        if(property.ownerId!=req.user.id){
            return res.json({
                msg:"not authorized"
            })
        }
        console.log("hello3")
        console.log(property.id)
        await prisma.property.delete({
            where:{
                id:parseInt(property.id)
            }
        })
        console.log("hello4")
        res.json({
            msg:"property deleted"
        })
        console.log("hello5")
        
    } catch (error) {
        console.log("hello6")
        res.json({
            msg:error
        })
    }
}

export const filtersProperty=async (req,res)=>{
    // All that code with filters, gte, lte, contains, etc. is written in the way Prisma understands queries.

    // Prisma doesn’t directly take raw SQL

    //Instead, Prisma expects a JavaScript object (query filter) that it can translate into SQL behind the scenes.
    try {
        const { location,minPrice,maxPrice }=req.query;
        const filters={};
        if(location){
            filters.location={
                contains:location,
                mode:"insensitive"
            }
        }
        if(minPrice || maxPrice){
            filters.price={};
            if(minPrice) filters.price.gte=parseInt(minPrice)
            if(maxPrice) filters.price.lte=parseInt(maxPrice)
        }
    
        const properties=await prisma.property.findMany({
            where:filters,
            include:{
                owner:true
            }
        })
        res.json(properties);
        
    } catch (error) {
        res.json({
            msg:`something went wrong in filter controller: ${error}`
        })
    }
}