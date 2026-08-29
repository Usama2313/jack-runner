const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'subway_surfers_secret_key_2024';
const MASTER_ADMIN_KEYS = ['admin2026', 'jack-runner-admin-2026', 'super_secret_admin_key_2026'];

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware that ensures the user is authenticated and is an admin (supports JWT or Admin Master Key)
const requireAdmin = (req, res, next) => {
  const adminKeyHeader = req.headers['x-admin-key'];
  if (adminKeyHeader && MASTER_ADMIN_KEYS.includes(adminKeyHeader.trim())) {
    req.user = { id: 1, email: 'admin@jackrunner.com', username: 'JackAdmin', isAdmin: true };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (MASTER_ADMIN_KEYS.includes(token)) {
      req.user = { id: 1, email: 'admin@jackrunner.com', username: 'JackAdmin', isAdmin: true };
      return next();
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.isAdmin || decoded.is_admin) {
        req.user = decoded;
        return next();
      }
      return res.status(403).json({ error: 'Admin privileges required' });
    } catch {
      return res.status(401).json({ error: 'Invalid or expired admin token' });
    }
  }

  return res.status(401).json({ error: 'Admin authentication required. Please login with admin credentials.' });
};

module.exports = { authMiddleware, requireAdmin, JWT_SECRET, MASTER_ADMIN_KEYS };
