const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

app.use(express.static('public'));

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the SQLite database.');
      db.run(`CREATE TABLE IF NOT EXISTS gelato (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Freezer INTEGER,
        Flavor TEXT,
        Quantity REAL
      )`, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Table created or already exists.');
        }
      });
    }
  });
  

app.use(express.json()); // For parsing application/json

// Get inventory from database
app.get('/inventory', (req, res) => {
    db.all('SELECT * FROM gelato', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching inventory');
            return;
        }
        res.json(rows);
    });
});

// Add to inventory in database
app.post('/add-gelato', (req, res) => {
    const { freezer, flavor, quantity } = req.body;
    db.run('INSERT INTO gelato (Freezer, Flavor, Quantity) VALUES (?, ?, ?)', [freezer, flavor, quantity], (err) => {
        if (err) {
            res.status(500).send('Error adding to inventory');
            return;
        }
        res.send('Added to inventory');
    });
});

// Endpoint to delete gelato from inventory in database
app.delete('/delete-gelato', (req, res) => {
    const { freezer, flavor } = req.body;
    const sqlDelete = 'DELETE FROM gelato WHERE Freezer = ? AND Flavor = ?';
    
    db.run(sqlDelete, [freezer, flavor], function(err) {
        if (err) {
            res.status(500).send('Error deleting gelato');
        } else {
            if (this.changes === 0) {
                res.status(404).send('Item not found');
            } else {
                res.send('Gelato deleted successfully');
            }
        }
    });
});


// Use gelato from inventory in database
app.post('/use-gelato', (req, res) => {
    const { freezer, flavor, quantity } = req.body;
    const sqlUpdate = 'UPDATE gelato SET Quantity = Quantity - ? WHERE Freezer = ? AND Flavor = ? AND Quantity >= ?';
    
    db.run(sqlUpdate, [quantity, freezer, flavor, quantity], function(err) {
        if (err) {
            res.status(500).send('Error using gelato');
        } else {
            if (this.changes === 0) {
                res.status(400).send('Insufficient quantity or item not found');
            } else {
                res.send('Gelato used successfully');
            }
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
