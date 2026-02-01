import jwt from "jsonwebtoken"

export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: "No token provided" })

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Admin only." })
  }
}
