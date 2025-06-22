const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// ✅ 1. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
// ✅ 2. Create Schema + Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// ✅ 3. Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ 4. POST route to save form data
app.post('/contact', async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    const newContact = new Contact({ name, email, mobile, message });
    await newContact.save(); // 🔥 This actually saves to MongoDB

    console.log("✅ Message saved:", newContact);
    res.send('✅ Message received and saved to MongoDB!');
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).send('❌ Server Error');
  }
});

// ✅ 5. Start the server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});