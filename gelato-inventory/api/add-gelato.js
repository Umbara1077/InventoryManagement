// api/add-gelato.js
// api/add-gelato.js
const { connect } = require('../database');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { freezer, flavor, quantity } = req.body;
            const conn = await connect();
            const [results] = await conn.execute(
                `INSERT INTO gelato_inventory (freezer, flavor, quantity) VALUES (?, ?, ?)`,
                [freezer, flavor, quantity]
            );
            await conn.end();
            res.status(200).json({ message: 'Gelato added successfully', results });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
