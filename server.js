const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle custom routes to remove .html extension
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  console.log(req.params);

  if (page.endsWith('.html')) {
    const pageWithoutExtension = page.slice(0, -5); // Remove the .html extension
    res.redirect(`/${pageWithoutExtension}`);
  } else {
    const filePath = path.join(__dirname, 'dist', page + '.html');
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        next(); // File doesn't exist, move to the next middleware (404 handler)
      } else {
        res.sendFile(filePath);
        console.log(page);
      }
    });
  }
});

// 404 handler - This should be the last route
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'dist', '404.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});