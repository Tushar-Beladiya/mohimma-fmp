import { NextFunction, Request, Response } from 'express';

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a specific type if you know the structure of 'decoded'
    }
  }
}

const jwt = require('jsonwebtoken');
// Replace with your actual secret key

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.APP_SECERET_KEY);
    req.user = decoded; // Store the decoded user information in the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default verifyToken;
