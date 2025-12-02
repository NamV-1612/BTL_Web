const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 


app.use('/api/auth', authRoutes);


// Test API
app.get('/', (req, res) => {
    res.send('Đang chạy!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});