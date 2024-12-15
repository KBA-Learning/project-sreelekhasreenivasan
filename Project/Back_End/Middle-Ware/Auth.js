import jwt from "jsonwebtoken";



const secretKey='your-secret-key';
const authenticate=(req,res,next)=>{ 
    const cookies= req.headers.cookie;
    // req.cookies
    // console.log(cookies);
    
    const cookieArray = cookies.split(';');

    console.log(cookieArray);
    
    for (let cookie of cookieArray) {
        const [name, token] = cookie.trim().split('=');

        // If 'AuthToken' cookie is found, verify the JWT
        if (name === 'bookToken') {
            try {
                const verified = jwt.verify(token, secretKey);
                req.userId = verified.userId;
                req.userType = verified.userType;
            } catch (err) {
                return res.status(403).json({ error: "Forbidden: Invalid token" });
            }
            break;
        }
    }
    // console.log(verified);
    
    next();
}
export {authenticate};