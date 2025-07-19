module.exports = (fns)=>{
    return (req,res,next)=>{
        fns(req,res,next).catch(err=>next(err));
    }
}