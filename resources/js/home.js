let taskCards;
document.addEventListener('DOMContentLoaded', () => {
    taskCards = document.querySelectorAll('.card');

    taskCards.forEach(card => {
        const doneButton = card.querySelector('#doneButton');
        // console.log(card);
        if (doneButton) {
            doneButton.addEventListener('click', async() => {
                const taskId = card.querySelector('#taskId').value;
                console.log("Task ID:", taskId);
                const currentDoneStatus = doneButton.textContent.includes('Check if NotDone');

                const newDoneStatus = !currentDoneStatus;

                console.log(doneButton.textContent);
                console.log(newDoneStatus);

                if (!newDoneStatus) {
                    doneButton.textContent = 'Check if Done';
                    document.getElementById('taskDoneness').value = 'false';
                } else {
                    doneButton.textContent = 'Check if NotDone';
                    document.getElementById('taskDoneness').value = 'true';
                }
                
                const currentFilter = document.getElementById('currentFilter').value;
                if (currentFilter !== 'All') {
                    card.style.display = 'none';
                }
                
        
                console.log("new Done", newDoneStatus);

                const response = await fetch(`/api/task/done/${taskId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ doneness: !newDoneStatus }),
                });
        
                if (response.ok) {
                    
                    const data = await response.json();
                    console.log(data.message);
                } else {
                    console.error('Failed to update task status:', response.statusText);
                    console.error('Response status:', response.status);
                }

            });
        }

        const deleteButton = card.querySelector('#deleteButton');
        if (deleteButton) {
            deleteButton.addEventListener('click', async(e) => {
                e.preventDefault();
                const taskId = document.getElementById('taskId').value;
                console.log("Task ID:", taskId);
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
                    card.remove();
                } else {
                    console.error('Could not delete task:', response.statusText);
                }
            });
        }
    });

    const filterAllButton = document.getElementById('filterAllButton');
    const filterDoneButton = document.getElementById('filterDoneButton');
    const filterNotDoneButton = document.getElementById('filterNotDoneButton');

    filterAllButton.addEventListener('click', () => {
        const cards = document.querySelectorAll('.card');
        taskCards.forEach(card => {
            card.style.display = 'block';
        });
        document.getElementById('currentFilter').value = 'All';
    });

    filterDoneButton.addEventListener('click', () => {
        const cards = document.querySelectorAll('.card');
        taskCards.forEach(card => {
            const doneButton = card.querySelector('#doneButton');
            const doneStatus = doneButton.textContent.includes('Check if NotDone');
            console.log('doneStatus:', doneStatus);
            if (doneStatus) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        document.getElementById('currentFilter').value = 'Done';
    });

    filterNotDoneButton.addEventListener('click', () => {
        const cards = document.querySelectorAll('.card');
        taskCards.forEach(card => {
            const doneButton = card.querySelector('#doneButton');
            const doneStatus = doneButton.textContent.includes('Check if NotDone');
            if (!doneStatus) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        document.getElementById('currentFilter').value = 'NotDone';
    });
});

