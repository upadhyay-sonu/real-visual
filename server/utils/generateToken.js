import jwt from 'jsonwebtoken';

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

export default generateToken;
