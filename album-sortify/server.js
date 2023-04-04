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

app.get('/list/:userID', (req, res) => {
  const userID = req.params.userID;
  const sql = `SELECT * FROM album WHERE userID = \'${userID}\'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json'); // set content type to JSON
    res.send(result);
  });
});

app.get('/albumlist/:userID', (req, res) => {
  const userID = req.params.userID;
  const sql = `SELECT * FROM albumlist WHERE userID = \'${userID}\' ORDER BY date_created DESC`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json'); // set content type to JSON
    res.send(result);
  });
});

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


app.post('/albums', (req, res) => {
  const { userID, name, artist, picture_url, url, releaseDate, spotifyID } = req.body;
  const query = 'INSERT INTO album (userID, name, artist, picture_url, url, releaseDate, spotifyID) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [userID, name, artist, picture_url, url, releaseDate, spotifyID], (err, result) => {
    if (err) {
      console.error('Error adding new album:', err);
      res.status(500).json({ error: 'Error adding album.' });
    } else {
      res.status(200).json({ userID, name, artist, picture_url, url, releaseDate, spotifyID});
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
