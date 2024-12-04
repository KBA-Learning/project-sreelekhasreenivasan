import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookie from "cookie"; // Library for parsing cookies

dotenv.config();

const authenticate = (req, res, next) => {
  const cookiesHeader = req.headers.cookie;

  // Check if cookies are present
  if (!cookiesHeader) {
    return res.status(401).json({ message: "Unauthorized: No cookies found" });
  }

  try {
    // Parse cookies using the 'cookie' library
    const cookies = cookie.parse(cookiesHeader);

    // Check if the specific cookie exists
    if (!cookies.bookToken) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    // Verify the token
    const verified = jwt.verify(cookies.bookToken, process.env.SECRET_KEY);

    // Attach user data to the request object
    req.userId = verified.userId;
    req.userType = verified.userType;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export { authenticate };
