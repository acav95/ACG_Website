const express = require('express');
const app = express();
const path = require('path');

// Serve static files from 'public' directory (if you have one)
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    // Or if using a view engine:
    // res.render('index');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 