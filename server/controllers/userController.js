const db = require('../models');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  console.log('Register request received:', req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Checking existing user...');
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating user...');
    const newUser = await db.User.create({
      username,
      email,
      password: hashedPassword
    });

    console.log('User created:', newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    // User ID sudah tersedia dari auth middleware
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'createdAt'], // Jangan sertakan password
      include: [
        {
          association: 'accounts',
          attributes: ['id', 'name', 'balance', 'type']
        },
        {
          association: 'categories',
          attributes: ['id', 'name', 'type', 'color']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Jika ingin update password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update fields lainnya
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile
};