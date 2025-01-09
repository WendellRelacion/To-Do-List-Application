document.addEventListener("DOMContentLoaded", () => {
    const bttn = document.getElementById('markDoneBttn');
    const isDone = document.getElementById('doneness');
    const taskId = document.getElementById('taskId').value;

    console.log("Task ID:", taskId);

    bttn.addEventListener('click', async(event) => {
        event.preventDefault();
        const currentDoneStatus = isDone.textContent.includes('Yes');

        const newDoneStatus = currentDoneStatus;

        if (newDoneStatus) {
            bttn.textContent = 'Check if NotDone';
            isDone.textContent = 'Done: Yes';
        } else {
            bttn.textContent = 'Check if Done';
            isDone.textContent = 'Done: No';
        }

        const response = await fetch(`/api/task/done/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ doneness: newDoneStatus }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
    
            if (!newDoneStatus) {
                bttn.textContent = 'Check if NotDone';
                isDone.textContent = 'Done: Yes';
            } else {
                bttn.textContent = 'Check if Done';
                isDone.textContent = 'Done: No';
            }
        } else {
            console.error('Failed to update task status:', response.statusText);
            console.error('Response status:', response.status);
        }
    });

    const deleteButton = document.querySelector('#deleteButton');

    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const taskId = document.getElementById('taskId').value;
        const taskData = {
            deleteID: taskId,
        };
        const response = await fetch(`/api/task/delete/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            window.location.href = '/home';
        } else {
            console.error('Could not delete task:', response.statusText);
        }
    });

    const updateDescriptionBttn = document.getElementById('updateDescriptionBttn');
    const newDescriptionInput = document.getElementById('newDescription');
    updateDescriptionBttn.addEventListener('click', async (e) => {
        e.preventDefault();
        const newDescription = newDescriptionInput.value;

        const response = await fetch(`/api/task/updateDescription/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: newDescription }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            document.querySelector('p.description').textContent = `Description: ${newDescription}`;
        } else {
            console.error('Failed to update task description:', response.statusText);
        }
    });
});