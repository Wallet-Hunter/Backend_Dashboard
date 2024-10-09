const User = require('../models/userModel');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// User create
exports.newUser = async (req, res) => {

  const {firstname, lastname, telegramId, phone_number, userType} = req.body;
  let userId = telegramId + firstname + lastname;
  console.log(userId);
  try {
    let user = await User.findOne({ userId });
    if (user) {
      return res.status(400).json({message: 'User already exists'});
    }else{
    let user = new User({userId, firstname, lastname, telegramId, phone_number, userType});
    await user.save();
    res.json({message: 'User created'});
    }
  } catch (error) {
    res.status(500).json({message: 'Server errorJ'});
}
};




//Login
exports.login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await User.findOne({ id });
    if (!user) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, user.password);
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
    const users = await User.find();
    res.json(users).status(200);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({telegramId:id});
    if(user){
      res.json(user);
    }else{
        res.send("User not found");
    }} catch (error) {
    res.status(500).json({ message: 'Server error' });
    }
}