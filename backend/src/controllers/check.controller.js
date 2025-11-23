export const check=(req,res)=>{
    res.json({loggedIn:true,user:req.user})
}
