document.addEventListener("DOMContentLoaded", ()=>{
    const loginBttn = document.getElementById('loginBttn');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    loginBttn.addEventListener('click', async(event) =>{
        event.preventDefault();
        console.log(username.value);
        const data = {
            username: username.value,
            password: password.value
        };

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include', 
        });

        if (response.ok) {
            // alert("you're logged in!");
            window.location.href = '/home';
        } else {
            alert("Incorrect username or password.");
        }
    });
});