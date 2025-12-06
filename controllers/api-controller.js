// controllers/api-controller.js
const jwt = require('jsonwebtoken');
const Course = require('../models/course-model');

const JWT_SECRET = process.env.JWT_SECRET || 'superSecretSigningKey';

//GET courses 
async function getCourses(req, res) {
  try {
    let courses = await Course.find().select('-registrants').lean();

    const hostUrl = `${req.protocol}://${req.get('host')}`;

    courses = courses.map(course => {
      const { image, ...rest } = course;

      let imageUrl = null;
      if (image) {
        const filename = image.replace(/^img\//, '');
        imageUrl = `${hostUrl}/img/${filename}`;
      }

      return {
        ...rest,
        imageUrl,
      };
    });

    res.json(courses);
  } catch (err) {
    console.error('Error getting courses:', err);
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
}

//get token 
function getToken(req, res) {
  try {
    const expiresInSeconds = 24 * 60 * 60;
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const payload = { exp };

    const token = jwt.sign(payload, JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error('Error generating token:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}

//verify Token 
function verifyToken(req, res, next) {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Token query parameter is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.jwtPayload = decoded;
    next();
  });
}

module.exports = {
  getCourses,
  getToken,
  verifyToken,
};
