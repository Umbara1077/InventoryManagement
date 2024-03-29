// Import the database connection function
const { connect } = require('../database');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { freezer, flavor, quantity } = req.body;

        try {
            const conn = await connect();

            // Replace 'inventory_table' with your actual MySQL table name
            await conn.execute(
                `UPDATE inventory_table SET quantity = quantity - ? WHERE freezer = ? AND flavor = ?`,
                [quantity, freezer, flavor]
            );

            await conn.end();
            res.status(200).json({ message: 'Gelato quantity updated' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
};
