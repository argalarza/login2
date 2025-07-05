const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { loginUser } = require('./controllers/logincontroller');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.post('/auth/login', loginUser);

app.listen(PORT, () => {
  console.log(`Login service corriendo en el puerto ${PORT}`);
});
