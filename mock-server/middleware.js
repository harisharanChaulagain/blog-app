const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = 'thisissecret';

module.exports = (req, res, next) => {
  setTimeout(() => {
    if (req.url === '/api/auth/login' && req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const { email, password } = JSON.parse(body);

          const usersPath = path.join(__dirname, 'users.json');
          const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
          const users = usersData.users;

          const user = users.find(u => u.email === email && u.password === password);

          if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: 'Invalid email or password'
            }));
            return;
          }

          const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
            },
            token,
            message: 'Login successful'
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

    if (req.url === '/api/auth/logout' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Logout successful'
      }));
      return;
    }

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

    next();
  }, 500);
};
