require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//Тестовый администратор
const adminUser = {
    username: 'admin',
    password: 'password'
};

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Mongoose Schema and Model
const itemSchema = new mongoose.Schema({
    img: String,
    altimg: String,
    title: String,
    descr: String,
    price: Number
});

const ItemElement = mongoose.model('ItemElement', itemSchema, 'items');

const requestSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const componentSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number
});

const Component = mongoose.model('Component', componentSchema, 'components');

// Function to seed the database
const seedDatabase = async () => {
    try {
        const data = fs.readFileSync('db_computer_service.json', 'utf-8');
        const json = JSON.parse(data);

        // items
        const count = await ItemElement.countDocuments();
        if (count === 0) {
            console.log('No data found in items collection. Seeding database...');
            await ItemElement.insertMany(json.items);
            console.log('Database seede successfully.');
        } else {
            console.log('Items collection already contains data. Skipping seed.');
        }

        // components
        const componentsCount = await Component.countDocuments();
        if (componentsCount === 0 && json.components) {
            console.log('No data found in components collection. Seeding database...');
            await Component.insertMany(json.components);
            console.log('Database seeded successfully.');
        } else {
            console.log('Components collection already contains data. Skipping seed.');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

const Request = mongoose.model('Request', requestSchema);

// Middleware для проверки аутентификации
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Маршрут для входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminUser.username && password === adminUser.password) {
        req.session.user = adminUser;
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Маршрут для выхода
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('Logout seccessful');
});

// Маршрут для проверки статуса сеанса
app.get('/session-status', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});

// Маршрут для админ-панели
app.get('/admin', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/admin.html'));
});

//API Routes
app.post('/requests', async (req, res) => {
    try{
        const newRequest = new Request(req.body);
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/menu', async (req, res) => {
    try {
        const menuItems = await ItemElement.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/menu', isAuthenticated, async (req, res) => {
    try {
        const newItem = new ItemElement(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/menu/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        await ItemElement.findByIdAndDelete(id);
        res.status(200).send('Menu item deleted');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/menu/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await ItemElement.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Маршрут для получения списка компонентов
app.get('/components', async (req, res) => {
    try {
        const components = await Component.find();
        res.json(components);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/components', isAuthenticated, async (req, res) => {
    try {
        const newComp = new Component(req.body);
        await newComp.save();
        res.status(201).json(newComp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/components/:id', isAuthenticated, async (req, res) => {
    try {
        await Component.findByIdAndDelete(req.params.id);
        res.status(200).send('Component deleted');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/components/:id', isAuthenticated, async (req, res) => {
    try {
        const updatedComp = await Component.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedComp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start the server and seed database
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    seedDatabase();
});