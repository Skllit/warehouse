require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4001;
connectDB();

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});