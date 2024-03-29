// Import the database connection function
const { connect } = require('../database');

module.exports = async (req, res) => {
    if (req.method === 'DELETE') {
        const { freezer, flavor } = req.body;

        try {
            const conn = await connect();

            // Replace 'inventory_table' with your actual MySQL table name
            const [result] = await conn.execute(
                `DELETE FROM inventory_table WHERE freezer = ? AND flavor = ?`,
                [freezer, flavor]
            );

            await conn.end();

            if (result.affectedRows) {
                res.status(200).json({ message: 'Gelato deleted successfully' });
            } else {
                res.status(404).json({ message: 'Gelato not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
};
