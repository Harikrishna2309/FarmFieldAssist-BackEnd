const express = require('express');
const app = express();
const port = 8000;

const sequelize = require('./config/db');
require('dotenv').config();

// Install and require the CORS and Body-Parser packages
const cors = require('cors');
const bodyParser = require('body-parser');

// Use the middleware for CORS and Body-Parser
app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
// Models
require('./models/user');
require('./models/work');
require('./models/interest');
require('./models/message');

//message
const http = require("http");
const initializeSocket = require("./socket");
const messageRoutes = require("./routes/messageRoutes");
const server = http.createServer(app);
const io = initializeSocket(server);
app.use("/formfield/api/messages", messageRoutes);

// Sync sequelize models
sequelize.sync()
// sequelize.sync({ force: true });

// Dynamically associate models after requiring them
const User = require('./models/user');
const Work = require('./models/work');
const Interest = require('./models/interest');

// Establish associations dynamically
User.hasMany(Work, { as: 'works', foreignKey: 'farmerId' });
User.hasMany(Interest, { as: 'interests', foreignKey: 'labourId' });
Interest.belongsTo(User, { as: 'labour', foreignKey: 'labourId' });
Interest.belongsTo(Work,{as:'work', foreignKey:'workId'});
Work.belongsTo(User, { as: 'farmer', foreignKey: 'farmerId' });
Work.hasMany(Interest,{ as: 'interests', foreignKey:'workId'});

// Routes
const userRoutes = require('./routes/userRoutes');
const workRoutes = require('./routes/workRoutes');
const interestRoutes = require('./routes/interestRoutes');

// Use routes
app.use('/formfield', userRoutes);
app.use('/formfield', workRoutes);
app.use('/formfield', interestRoutes);

app.get('/', (req, res) => {
    res.status(400).send(`Application started successfully on port ${port}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});
