import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'https://albumsortify.fr',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
}));
app.use(express.json());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
};

app.use(allowCrossDomain);


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'albumSortify'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// GET - get all albums from a list for a user
app.get('/list/:listID', (req, res) => {
  const listID = req.params.listID;
  const sort = req.query.sort;
  const sql = `SELECT * FROM album WHERE listID = \'${listID}\' ORDER BY ` + sort;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json'); // set content type to JSON
    res.send(result);
  });
});

// GET - get all lists for a user
app.get('/albumlist/:userID', (req, res) => {
  const userID = req.params.userID;
  const sort = req.query.sort;
  const sql = `SELECT * FROM albumlist WHERE userID = \'${userID}\' ORDER BY date_created ` + sort;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json'); // set content type to JSON
    res.send(result);
  });
});

// POST - create a new list
app.post('/albumlist', (req, res) => {
  const { userID, name, color } = req.body;
  const query = 'INSERT INTO albumlist (userID, name, color) VALUES (?, ?, ?)';
  connection.query(query, [userID, name, color], (err, result) => {
    if (err) {
      console.error('Error creating new list:', err);
      res.status(500).json({ error: 'Error creating list.' });
    } else {
      res.status(200).json({ userID, name, color });
    }
  });
});

// POST - add an album to a list
app.post('/albums', (req, res) => {
  const { userID, name, artist, picture_url, url, releaseDate, spotifyID, listID, total_tracks } = req.body;
  const query = 'INSERT INTO album (userID, name, artist, picture_url, url, releaseDate, spotifyID, listID, total_tracks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [userID, name, artist, picture_url, url, releaseDate, spotifyID, listID, total_tracks], (err, result) => {
    if (err) {
      console.error('Error adding new album to list :', err);
      res.status(500).json({ error: 'Error adding album to list.' });
    } else {
      res.status(200).json({ userID, name, artist, picture_url, url, releaseDate, spotifyID, listID, total_tracks});
    }
  });
});

// PUT - update an albumlist name or color
app.put('/albumlist/:listID', (req, res) => {
  const listID = req.params.listID;
  const { name, color } = req.body;
  const sql = `UPDATE albumlist SET name=?, color=? WHERE id=?`;

  connection.query(sql, [name, color, listID], (err, result) => {
    if (err) {
      console.error('Error updating albumlist:', err);
      res.status(500).json({ error: 'Error updating albumlist.' });
    } else {
      res.status(200).json({ listID, name, color });
    }
  });
});

// DELETE - delete an album from a list
app.delete('/albums/:albumID', (req, res) => {
  const albumID = req.params.albumID;
  const sql = `DELETE FROM album WHERE id = \'${albumID}\'`;

  connection.query(sql, albumID, (err, result) => {
    if (err) {
      console.error('Error deleting album from list:', err);
      res.status(500).json({ error: 'Error deleting album from list.' });
    } else {
      res.status(200).json({ albumID });
    }
  });
});


// DELETE - delete a list
app.delete('/albumlist/:listID', (req, res) => {
  const listID = req.params.listID;
  const sql = `DELETE FROM albumlist WHERE id = \'${listID}\';`;

  connection.query(sql, listID, (err, result) => {
    if (err) {
      console.error('Error deleting list:', err);
      res.status(500).json({ error: 'Error deleting list.' });
    } else {
      res.status(200).json({ listID });
    }
  });
});

// DELETE - delete all albums from a list
app.delete('/album/:listID', (req, res) => {
  const listID = req.params.listID;
  const sql = `DELETE FROM album WHERE listID = \'${listID}\';`;

  connection.query(sql, listID, (err, result) => {
    if (err) {
      console.error('Error deleting all album from list:', err);
      res.status(500).json({ error: 'Error deleting all albums from list.' });
    } else {
      res.status(200).json({ listID });
    }
  });
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
