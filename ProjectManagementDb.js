const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const config = {
    user: 'charles',
    password: 'charles',
    server: 'localhost',
    database: 'Project',
};

sql.connect(config).then(() => console.log("Connected to DB"));

// API Endpoints
app.post('/api/projects', async (req, res) => {
    const { ProjectName, Description } = req.body;

    try {
        const result = await sql.query(
            `INSERT INTO Projects (ProjectName, Description) VALUES ('${ProjectName}', '${Description}')`
        );
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/tasks', async (req, res) => {
    const { Title, Description, EstimatedHours, ProjectID } = req.body;

    try {
        const result = await sql.query(
            `INSERT INTO Tasks (Title, Description, EstimatedHours, ProjectID) VALUES ('${Title}', '${Description}', ${EstimatedHours}, ${ProjectID})`
        );
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
