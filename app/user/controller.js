const User = require('./model');
const path = require('path');
const fs = require('fs');

const getUserByToken = async (req, res) => {
    const userId = req.user._id; 
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna.' });
    }
  };
const updateUser = async (req, res) => {
    const userId = req.user._id;
    const { full_name, phoneNumber,address,birthDate,campusName,city} = req.body;
    const image = req.file;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User article not found.' });
      }
  
      user.full_name = full_name?? user.full_name;
      user.address = address ?? user.address;
      user.phoneNumber = phoneNumber?? user.phoneNumber;
      user.birthDate = birthDate?? user.birthDate;
      user.campus_name = campusName ?? user.campus_name;
      user.city = city ?? user.city;
      
  
      if (image) {
          const imageTitle = full_name.replace(/\s+/g, '-').toLowerCase();
          const imageExtension = path.extname(image.originalname);
          imageName = `${imageTitle}${imageExtension}`;
          const target = path.join(__dirname, '../../public/images/user/', imageName);
          fs.renameSync(image.path, target);
  
         user.image_url = image ? `http://192.168.20.249:3000/public/images/user/${imageName}` : '';
        }
  
  
      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
        console.error('Error update user article:', error);
    
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ error: 'Validation error', details: validationErrors });
        }
      res.status(500).json({ error: 'Error updating user article.' });
    }
  };
  const updatePhotoUser = async (req, res) => {
    const userId = req.user._id;
    const image = req.file;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User article not found.' });
      }
      if (image) {
          const imageTitle = user.full_name.replace(/\s+/g, '-').toLowerCase();
          const imageExtension = path.extname(image.originalname);
          imageName = `${imageTitle}${imageExtension}`;
          const target = path.join(__dirname, '../../public/images/user/', imageName);
          fs.renameSync(image.path, target);
  
         user.image_url = image ? `http://192.168.20.249:3000/public/images/user/${imageName}` : '';
        }
      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
        console.error('Error update user article:', error);
    
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ error: 'Validation error', details: validationErrors });
        }
      res.status(500).json({ error: 'Error updating user article.' });
    }
  };
  const getAllUsersWithRoleUser = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; 
      const limit = 10;
      const searchQuery = req.query.search || '';

      const totalUser = await User.countDocuments({
        full_name: { $regex: searchQuery, $options: 'i' },
      });
      const totalPages = Math.ceil(totalUser / limit);
      const users = await User.find({
        full_name: { $regex: searchQuery, $options: 'i' },
        role: 'user'
      }).select('-password -createdAt -updatedAt -token -role -_id')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
     
  
      if (users.length === 0) {
        return res.status(404).json({ error: 'Tidak ada pengguna dengan peran "user".' });
      }
  
      res.status(200).json({ data:users, totalPages });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna.' });
    }
  };
  
  module.exports = {
    updateUser,
    getUserByToken,
    updatePhotoUser,
    getAllUsersWithRoleUser
  };
  