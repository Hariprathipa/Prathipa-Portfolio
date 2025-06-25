const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load .env file

console.log("🔍 Loaded URI:", process.env.MONGODB_URI); // Debug check

const app = express();

// ✅ 1. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB Connected");
}).catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
});

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
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public

// ✅ 4. Serve index.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ 5. POST route to save contact form data
app.post('/contact', async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    const newContact = new Contact({ name, email, mobile, message });
    await newContact.save();

    console.log("✅ Message saved:", newContact);
    res.send('✅ Message received and saved to MongoDB!');
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).send('❌ Server Error');
  }
});

// ✅ 6. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});