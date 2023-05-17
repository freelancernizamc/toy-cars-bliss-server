const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Assignment-11-server is running')
})

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`)
})