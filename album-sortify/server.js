import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
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
  const userID = req.query.userID;
  const sql = `SELECT * FROM album WHERE listID = \'${listID}\' AND userID = \'${userID}\'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json'); // set content type to JSON
    res.send(result);
  });
});

// GET - get all lists for a user
app.get('/albumlist/:userID', (req, res) => {
  const userID = req.params.userID;
  const sql = `SELECT * FROM albumlist WHERE userID = \'${userID}\' ORDER BY date_created DESC`;

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
  const { userID, name, artist, picture_url, url, releaseDate, spotifyID, listID } = req.body;
  const query = 'INSERT INTO album (userID, name, artist, picture_url, url, releaseDate, spotifyID, listID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [userID, name, artist, picture_url, url, releaseDate, spotifyID, listID], (err, result) => {
    if (err) {
      console.error('Error adding new album to list :', err);
      res.status(500).json({ error: 'Error adding album to list.' });
    } else {
      res.status(200).json({ userID, name, artist, picture_url, url, releaseDate, spotifyID, listID});
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
      console.error('Error updating albumlist:', err);
      res.status(500).json({ error: 'Error deleting album from list.' });
    } else {
      res.status(200).json({ albumID });
    }
  });
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
