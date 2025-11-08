const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API routes can be added here in the future
// For example:
// app.get('/api/data', (req, res) => {
//   res.json({ message: 'This is your API endpoint!' });
// });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// This is important for client-side routing to work correctly.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
