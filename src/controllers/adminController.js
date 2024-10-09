const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login
exports.newAdmin = async (req, res) => {

  const {firstname, lastname, telegramId, phone_number, userType} = req.body;
  let userId = telegramId + firstname + lastname;
  console.log(userId);
  try {
    let admin = await Admin.findOne({ userId });
    if (admin) {
      // console.log(admin);
      return res.status(400).json({message: 'Admin already exists'});
    }else{
 
    let admin = new Admin({userId, firstname, lastname, telegramId, phone_number, userType});
    await admin.save();
    res.json({message: 'Admin created'});
    }
  } catch (error) {
    res.status(500).json({message: 'Server errorJ'});
}
};




//Login
exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const admin = await Admin.findOne({ id });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Admin.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
