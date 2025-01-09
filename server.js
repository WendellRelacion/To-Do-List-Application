const express = require('express')
const app = express()
const port = 4131
const bcrypt = require('bcrypt')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "templates");
app.set("view engine", "pug");
app.use("/images", express.static("resources/images/"));
app.use("/css", express.static("resources/css/"));
app.use("/js", express.static("resources/js/"));
const cookieParser = require('cookie-parser');
const data = require("./data");
app.use(cookieParser())

app.get('/', async(req, res) => {
    const userID = req.cookies.userID;
    console.log(userID);
    let userName;
    let loggedIn=false;
    if (!userID){
        userName = "New User";
        res.render('login', { userName, loggedIn });
        return
    }
    else{
        userName = userID;
        loggedIn=true;
    }
    const user = await data.getCredentials(userName, "x");
    const creds = user.credential[0];
    
    //or makes it so you don't break my code
    const deadlineSort = req.query.deadlineSort || 'ASC';
    const category = req.query.category || '';

    const tasks = await data.getAllTasks(creds.id, deadlineSort, category);

    res.render('home', { userName, loggedIn, tasks });
});

app.get('/home', async(req, res) => {
    const userID = req.cookies.userID;
    console.log(userID);
    let userName;
    let loggedIn=false;
    if (!userID){
        userName = "New User";
        res.render('login', { userName, loggedIn });
        return
    }
    else{
        userName = userID;
        loggedIn=true;
    }
    const user = await data.getCredentials(userName, "x");
    const creds = user.credential[0];
    
    //or makes it so you don't break my code
    const deadlineSort = req.query.deadlineSort || 'ASC';
    const category = req.query.category || '';

    const tasks = await data.getAllTasks(creds.id, deadlineSort, category);

    res.render('home', { userName, loggedIn, tasks });
});

app.get('/task/:taskID', async(req, res) => {
    const userID = req.cookies.userID;
    console.log(userID);
    let userName;
    let loggedIn=false;
    if (!userID){
        userName = "New User";
        res.render('login', { userName, loggedIn });
    }
    else{
        userName = userID;
        loggedIn=true;
    }
    const user = await data.getCredentials(userName, "x");
    const creds = user.credential[0];

    console.log(creds.id);
    taskID = req.params.taskID;
    const tasks = await data.getTask(taskID)

    tasksInfo = tasks.tasks;
    console.log(tasksInfo);
    res.render('task', { userName, loggedIn, tasksInfo});
});

app.post('/api/task/done/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const { doneness } = req.body;

    let taskDoneness;
    if (doneness) {
        taskDoneness = 0;
    } else {
        taskDoneness = 1;
    }
    
    const result = await data.updateTask(taskId, taskDoneness);

    if (result) {
        res.status(200).json({ message: "Task updated" });
    } else {
        res.status(404).json({ message: "Task not found?" });
    }
});

app.get('/createTask', (req, res) => {
    const userID = req.cookies.userID;
    let userName = "New User";
    let loggedIn = false;
    
    if (userID) {
        userName = userID;
        loggedIn = true;
    }

    res.render('createTask', { userName, loggedIn });
});

app.delete('/api/task/delete/:taskId', async (req, res) => {
    const taskId = req.body.deleteID;
    console.log("delete: ", taskId); 

    const result = await data.deleteTask(taskId);
    
    if (result.success) {
        res.status(200).json({ message: "Task deleted" });
    } else {
        res.status(400).json({ message: "Task delete error" });
    }
});

app.post('/api/create', async(req, res) => {
    const userID = req.cookies.userID;
    let userName = "New User";
    let loggedIn = false;
    
    if (userID) {
        userName = userID;
        loggedIn = true;
    }

    const user = await data.getCredentials(userName, "x");
    const creds = user.credential[0];

    console.log(creds.id)
    const taskData = req.body;
    if (req.body.doneness){
        req.body.doneness = true;
    }
    else{
        req.body.doneness = false;
    }

    //for category, check today's datetime, and compare it to the deadline, if deadline
    // has passed, then always make the category overdue

    const currentDate = new Date();
    const taskDeadline = new Date(req.body.deadline);
    let category = req.body.category;
    console.log("HERE IS CATREGORY", category);
    if (taskDeadline < currentDate) {
        category = 'overdue'; 
    }

    const taskInfo = {
        task_name: req.body.task_name,
        category: category,
        doneness: req.body.doneness,
        deadline: req.body.deadline,
        description: req.body.description,
        user_id: creds.id
    };

    console.log(taskInfo)

    const result = await data.addTasks(taskInfo);
    console.log(result);
    if (result) {
        res.status(200).json({message: "Creation successful!", taskID: result});
    } else {
        res.status(401).json({message: "Creation unsuccesful" });
    }
});

app.put('/api/task/updateDescription/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const { description } = req.body;

    const result = await data.updateTaskDescription(taskId, description);

    if (result) {
        res.status(200).json({ message: "Task description updated" });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

app.get('/login', (req, res) => {
    const userID = req.cookies.userID;
    let userName = "New User";
    let loggedIn = false;
    
    if (userID) {
        userName = userID;
        loggedIn = true;
    }
    
    res.render('login', { userName, loggedIn });
});

app.post('/api/login', async(req, res) => {
    
    const { username, password } = req.body;
    const hPass = await bcrypt.hash(password, 10);
    const result = await data.getCredentials(username, hPass);
    const creds = result.credential[0];

    console.log(result.success);
    
    if (!creds){
        res.status(401).json({message: "Invalid credentials" });
        return;
    }

    console.log(creds.id, creds.username, creds.password );
    const valid = await bcrypt.compare(password, creds.password);

    console.log(valid);


    if (valid) {
        res.clearCookie('userID', { path: '/' });
        console.log("replaced cookie")
        res.cookie('userID', username, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });
        res.status(200).json({message: "Login successful!" });
    } else {
        res.status(401).json({message: "Invalid credentials" });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('userID', { path: '/' });
    res.status(200).send();
});

app.get('/register', (req, res) => {
    const userID = req.cookies.userID;

    let userName = "New User";
    let loggedIn = false;
    
    if (userID) {
        userName = userID;
        loggedIn = true;
    }

    res.render('register', { userName, loggedIn });
});

app.post('/api/register', async(req, res) => {
    const { username, password, confirmPassword } = req.body;
    
    console.log('Received form data:', username, password, confirmPassword);

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    const usernameSQL = await data.getCredentials(username, password);
    const creds = usernameSQL;
    console.log(creds.credential.length);

    //makes it so that the server doesn't crash if there is a duplicate login
    if (creds.credential.length){
        return res.status(400).json({ message: "User already exists",});
    }

    const hPass = await bcrypt.hash(password, 10);
    const info = {username,  hPass};
    const result = await data.registerUser(info);


    if (result.success) {
        res.clearCookie('userID', { path: '/' });
        console.log("replaced cookie")
        res.cookie('userID', username, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });
        console.log(`${username} has been registered!`);
        res.status(201).json(result);
        
    } else {
        res.status(409).json(result);
    }
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});
