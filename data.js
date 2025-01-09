// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1",// this will work
  user: "C4131F24U98",
  database: "C4131F24U98",
  password: "9654", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
  port: 3312,
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.

async function addTasks(data){
    const {task_name, category, doneness, deadline, description, user_id} = data;
    const query = `INSERT INTO tasks (task_name, category, doneness, deadline, description, user_id)VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [task_name,category,doneness,deadline,description,user_id]
    const result = await connPool.awaitQuery(query, values);

    return result.insertId;

}

async function getTask(id) {
    const Query = `SELECT * FROM tasks WHERE id = ?`;
    const Values = [id];
    const Result = await connPool.awaitQuery(Query, Values);
    if (Result) {
        return { success: true, tasks: Result};
    } else {
        return { success: false, message: "Listing not found." };
    }

}

async function getAllTasks(userId, deadlineSort, category) {
    let query = `SELECT * FROM tasks WHERE user_id = ?`;
    const values = [userId];

    if (category) {
        query += ` AND category = ?`;
        values.push(category);
    }

    query += ` ORDER BY deadline ${deadlineSort}`;
    values.push(deadlineSort);

    const result = await connPool.awaitQuery(query, values);
    return result; 
}


async function deleteTask(id) {
    const query = `DELETE FROM tasks WHERE id = ?`;
    const values = [id];
    
    const result = await connPool.awaitQuery(query, values);
    return { success: result.affectedRows > 0 }; 
}

async function getCredentials(userName, hPass) {
    const query = `SELECT id, username, password FROM userInfo WHERE username = ?`;
    const values = [userName, hPass];
    
    try {
        const result = await connPool.awaitQuery(query, values);
        return { success: true, credential: result };
    } catch (err) {
        console.error('Error credentials:', err);
        return { success: false, message: 'Error during registration' };
    }

}

async function registerUser(data){
    const {username, hPass} = data;
    const query = `INSERT INTO userInfo (username, password) VALUES (?, ?)`;
    const values = [username, hPass];
    
    try {
        const result = await connPool.awaitQuery(query, values);
        return { success: true, id: result.insertId };
    } catch (err) {
        console.error('Error during registration:', err);
        return { success: false, message: 'Error during registration' };
    }
}

async function updateTask(taskId, doneness) {
    console.log("Updating task status:", taskId, doneness);
    const query = `UPDATE tasks SET doneness = ? WHERE id = ?`;
    const values = [doneness, taskId];

    try {
        const result = await connPool.awaitQuery(query, values);
        return result; 
    } catch (err) {
        console.error('Error updating task status:', err);
        throw err;
    }
}

async function updateTaskDescription(taskId, description) {
    const query = `UPDATE tasks SET description = ? WHERE id = ?`;
    const values = [description, taskId];

    try {
        const result = await connPool.awaitQuery(query, values);
        return result.affectedRows > 0; // Return true if a row was updated
    } catch (err) {
        console.error('Error updating task description:', err);
        return false;
    }
}

module.exports = {
    addTasks,
    deleteTask,
    getCredentials,
    registerUser,
    getTask,
    updateTask,
    getAllTasks,
    updateTaskDescription
};