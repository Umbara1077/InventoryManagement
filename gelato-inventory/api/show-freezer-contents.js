// Import the database connection function
const { connect } = require('../database');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const conn = await connect();

            // Replace 'inventory_table' with your actual MySQL table name
            const [rows] = await conn.query(`SELECT * FROM inventory_table`);

            await conn.end();
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
};
