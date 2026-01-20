const jwt = require('jsonwebtoken');

// Mock secret key (in production, use environment variable)
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

module.exports = (req, res, next) => {
  // Add delay to simulate real API
  setTimeout(() => {
    // Handle authentication
    if (req.url === '/api/auth/login' && req.method === 'POST') {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const { email, password } = JSON.parse(body);
          
          // Mock user validation
          if (email === 'demo@example.com' && password === 'password123') {
            const user = {
              id: '1',
              name: 'Demo User',
              email: 'demo@example.com',
              role: 'admin'
            };
            
            const token = jwt.sign(
              { userId: user.id, email: user.email },
              JWT_SECRET,
              { expiresIn: '24h' }
            );
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              user,
              token,
              message: 'Login successful'
            }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: 'Invalid credentials'
            }));
          }
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid request'
          }));
        }
      });
      
      return;
    }
    
    // Handle registration
    if (req.url === '/api/auth/register' && req.method === 'POST') {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const { name, email, password } = JSON.parse(body);
          
          // Check if user already exists
          if (email === 'demo@example.com') {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: 'User already exists'
            }));
            return;
          }
          
          // Create new user
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            user: newUser,
            token,
            message: 'Registration successful'
          }));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid request'
          }));
        }
      });
      
      return;
    }
    
    // Handle token verification
    if (req.url === '/api/auth/verify' && req.method === 'GET') {
      const authHeader = req.headers['authorization'];
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'No token provided'
        }));
        return;
      }
      
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user: {
            id: decoded.userId,
            email: decoded.email
          }
        }));
      } catch (error) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid token'
        }));
      }
      
      return;
    }
    
    // Handle logout
    if (req.url === '/api/auth/logout' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Logout successful'
      }));
      return;
    }
    
    // Handle protected routes - check token
    const protectedRoutes = ['/api/posts', '/api/profile'];
    const isProtectedRoute = protectedRoutes.some(route => req.url.startsWith(route));
    
    if (isProtectedRoute && req.method !== 'GET') {
      const authHeader = req.headers['authorization'];
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Unauthorized'
        }));
        return;
      }
    }
    
    // Continue to JSON Server
    next();
  }, 500); // 500ms delay to simulate network
};