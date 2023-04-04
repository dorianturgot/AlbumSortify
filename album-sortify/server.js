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

app.post('/albums', (req, res) => {
  const { userID, name } = req.body;
  const query = 'INSERT INTO albumlist (userID, name) VALUES (?, ?)';
  connection.query(query, [userID, name], (err, result) => {
    if (err) {
      console.error('Error adding new album:', err);
      res.status(500).json({ error: 'Error adding album.' });
    } else {
      res.status(200).json({ userID, name });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
