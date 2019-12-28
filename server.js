const express = require('express');
const path = require('path');
const app = express();

const distPath = '/dist/my-locations';
// Serve static files....
app.use(express.static(__dirname + distPath));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + distPath + '/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);