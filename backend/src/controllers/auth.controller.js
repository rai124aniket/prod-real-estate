import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../prismaClient.js";
export const register=async (req,res)=>{
    try {
        const {name,email,password}=req.body;
        const isUserPresent=await prisma.user.findFirst({
            where:{
                email:email
            }
        })
        if(isUserPresent){
            return res.json({
                msg:"user already exist",
                success:false
            })
        }
        const hashed=await bcrypt.hash(password,10)

        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashed
            }
        })
        return res.json({
            msg:"user created successfully",
            success:true,
            user
        })
    } catch (error) {
        return res.json({
            error:error,
            success:false
        })
    }
}


export const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            return res.json({
                msg:"user not found",
                success:false
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({
                msg:"incorrect password",
                success:false
            })
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET)

        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"strict",
            maxAge:24*60*60*1000,
        })
        return res.json({
            msg:"login successfully",
            success:true
        })
    } catch (error) {
        return res.json({
            msg:error
        })
    }
}


