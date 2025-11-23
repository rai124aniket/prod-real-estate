import jwt from "jsonwebtoken"

export const authMiddleware=(req,res,next)=>{
    try {
        const token=req.cookies?.token

        if(!token) return res.json({msg:"user is not authorized"})

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        return next(); 
    } catch (error) {
        res.json({
            msg:error
        })
    }   
}