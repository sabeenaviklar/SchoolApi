const pool = require('../config/database');
const { calculateDistance } = require('../utils/distanceCalculator');

const addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;
        
        // Check if we're using PostgreSQL or MySQL
        if (process.env.DATABASE_URL) {
            // PostgreSQL syntax
            const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
            const result = await pool.query(query, [name, address, latitude, longitude]);
            
            res.status(201).json({
                success: true,
                message: 'School added successfully',
                data: result.rows[0]
            });
        } else {
            // MySQL syntax
            const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
            const [result] = await pool.execute(query, [name, address, latitude, longitude]);
            
            res.status(201).json({
                success: true,
                message: 'School added successfully',
                data: {
                    id: result.insertId,
                    name,
                    address,
                    latitude,
                    longitude
                }
            });
        }
    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const listSchools = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);
        
        const query = 'SELECT * FROM schools';
        
        if (process.env.DATABASE_URL) {
            // PostgreSQL
            const result = await pool.query(query);
            const schools = result.rows;
            
            const schoolsWithDistance = schools.map(school => ({
                ...school,
                distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
            }));
            
            schoolsWithDistance.sort((a, b) => a.distance - b.distance);
            
            res.status(200).json({
                success: true,
                message: 'Schools retrieved successfully',
                data: schoolsWithDistance
            });
        } else {
            // MySQL
            const [schools] = await pool.execute(query);
            
            const schoolsWithDistance = schools.map(school => ({
                ...school,
                distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
            }));
            
            schoolsWithDistance.sort((a, b) => a.distance - b.distance);
            
            res.status(200).json({
                success: true,
                message: 'Schools retrieved successfully',
                data: schoolsWithDistance
            });
        }
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    addSchool,
    listSchools
};
