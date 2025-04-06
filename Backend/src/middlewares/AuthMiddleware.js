const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) => {

    const token = req.cookies.token;

    try{

        // console.log(token);
        if(!token) return res.status(400).json({success:false , message:"Access Denied. need to login"});

        const decoded = jwt.verify(token , process.env.SECERET_KEY);
        req.user = decoded;  // Attach decoded user data to request
        next();

    }catch(error){
        console.log("error in auth  middleware" , error);
        res.status(401).json({ success: false, message: "Invalid token or token is expired" });
    }
}

module.exports = authMiddleware;



