const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const  User  = require('./public/user');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/examDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Mongoose schemas and models
const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    phone: { type: String, required: true },
    examScores: [{
        subject: String,
        score: Number
    }],
});
const QuestionSchema = new mongoose.Schema({
    questionText: String,
    options: [String],
    correctAnswer: String,
    examId: mongoose.Schema.Types.ObjectId,
});
const admin = mongoose.model('Admin', adminSchema);
const seedadmin = async () => {
    await admin.create({
        email: "vism1996@gmail.com",
        password: "admin123"
    });
    console.log("Admin user created");
    if (seedadmin.ok) {
        window.location.href = 'admin-page.html';
    } 
    mongoose.connection.close();
};

seedadmin();

const user = mongoose.model('User', UserSchema);

const Question = mongoose.model('Question', QuestionSchema);

// API routes


// Admin login
app.post('/login/admin', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    if (admin) {
        res.status(200).send('Admin login successful.');
    } else {
        res.status(401).send('Admin login failed.');
    }
});

app.post('/register/user', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Registration failed');
    }
});

// User login
app.post('/login/user', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).send('User login successful');
        } else {
            res.status(401).send('Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Login failed');
    }
});

// Fetch questions for an exam
app.get('/exam/:examId/questions', async (req, res) => {
    const questions = await Question.find({ examId: req.params.examId });
    res.json(questions);
});


app.get('/api/mcqs', async (req, res) => {
    try {
        const mcqs = await MCQ.find(); // Assuming you have an MCQ model
        res.json(mcqs);
    } catch (error) {
        console.error('Error fetching MCQs:', error);
        res.status(500).send('Error fetching MCQs');
    }
});

// Handle exam submission
app.post('/submit-exam', async (req, res) => {
    try {
        const { answers } = req.body;
        const userEmail = req.session.userEmail; // Assuming you are using sessions for authentication

        const user = await User.findOne({ email: userEmail });
        if (user) {
            const score = calculateScore(answers); // Implement your own score calculation logic
            user.examScores.push({ subject: 'MCQ Exam', score });
            await user.save();
            res.status(200).send('Exam submitted successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error submitting exam:', error);
    }


// Submit exam answers
app.post('/exam/:examId/submit', async (req, res) => {
    const { answers } = req.body;
    // Process and save answers
    res.status(200).send('Exam submitted successfully.');
});
})

// Start server
app.listen(3000, () => console.log('Server running on port 3000')); 
