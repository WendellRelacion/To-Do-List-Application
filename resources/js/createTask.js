document.addEventListener("DOMContentLoaded", () => {
    const createBttn = document.getElementById('createBttn');

    createBttn.addEventListener('click', async(event) =>{
        event.preventDefault();
        console.log("we here");

        const taskNameInput = document.getElementById('task_name');
        const deadlineInput = document.getElementById('deadline');

      
        let isValid = true;
        if (!taskNameInput.value) {
            taskNameInput.style.borderColor = 'red';
            isValid = false;
        } else {
            taskNameInput.style.borderColor = '';
        }

        if (!deadlineInput.value) {
            deadlineInput.style.borderColor = 'red';
            isValid = false;
        } else {
            deadlineInput.style.borderColor = '';
        }

        const categoryInput = document.getElementById('nCategory');

        console.log(":here", categoryInput)
        // categoryInput.style.borderColor = 'red';

        if (!categoryInput.value) {
            categoryInput.style.borderColor = 'red';
            console.log(":here", categoryInput)
            isValid = false;
        } else {
            categoryInput.style.borderColor = '';
        }

        if (!isValid) {
            return; 
        }

        console.log("create task category", document.getElementById('nCategory').value,);

        const data = {
            task_name: taskNameInput.value,
            category: document.getElementById('nCategory').value,
            doneness: document.getElementById('doneness').checked,
            deadline: deadlineInput.value,
            description: document.getElementById('description').value
        };

        const response = await fetch('/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include', 
        });

        const responseData = await response.json();
        const taskID = responseData.taskID;
        if (response.ok) {
            // alert("succesfully created task");
            window.location.href = `/task/${taskID}`;
        } else {
            alert("Incorrect username or password.");
            // username.classList.add('error');
            // password.classList.add('error');
        }
    });
});