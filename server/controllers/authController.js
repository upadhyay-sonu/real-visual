import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// Regex validators
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Backend Validation
    if (!username || !email || !password) {
      return sendError(res, 400, 'Please provide all required fields');
    }
    if (username.length < 3) {
      return sendError(res, 400, 'Username must be at least 3 characters');
    }
    if (!emailRegex.test(email)) {
      return sendError(res, 400, 'Please provide a valid email address');
    }
    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters');
    }

    // Duplicate Checks
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return sendError(res, 400, 'This account already exists. Please login instead.');
    }
    
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return sendError(res, 400, 'This username is already taken. Please choose another.');
    }

    const user = await User.create({
      username,
      email,
      passwordHash: password // Hashed via pre-save hook
    });

    if (user) {
      return sendSuccess(res, 201, {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      }, 'Account created successfully');
    } else {
      return sendError(res, 400, 'Invalid user data provided');
    }
  } catch (error) {
    console.error("Register Error:", error);
    return sendError(res, 500, 'Server error during registration');
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, 404, 'No account found with this email');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Incorrect password');
    }

    return sendSuccess(res, 200, {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    }, 'Logged in successfully');

  } catch (error) {
    console.error("Login Error:", error);
    return sendError(res, 500, 'Server error during login');
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  try {
    return sendSuccess(res, 200, {}, 'Logged out successfully');
  } catch (error) {
    console.error("Logout Error:", error);
    return sendError(res, 500, 'Server error during logout');
  }
};
