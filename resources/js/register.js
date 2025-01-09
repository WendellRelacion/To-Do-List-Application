document.addEventListener("DOMContentLoaded", () => {
        const regBttn = document.getElementById('regBttn');
        const username = document.getElementById('username');
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirmPassword');
        
        

        regBttn.addEventListener('click', async(event) =>{
                event.preventDefault(); //keeps page from always refreshing leading to difficult debugging (wish I woulda known this 4 hrs ago)
                console.log(username.value);
                const data = {
                        username: username.value,
                        password: passwordField.value,
                        confirmPassword: confirmPasswordField.value
                };


                passwordField.classList.remove('error');
                confirmPasswordField.classList.remove('error');

                if (data.password !== data.confirmPassword) {
                        passwordField.classList.add('error');
                        confirmPasswordField.classList.add('error');
                }

                try{
                        const response = await fetch('api/register',{
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data),
                                credentials: 'include'
                        });

                        const result = await response.json();

                        console.log(result);

                        if(response.ok){
                                // alert("succesfully registered");
                                window.location.href = '/home';
                        }

                        else {
                                alert("Calculations were wrong", error);
                        }
                }
                catch (error) {
                        alert("Could not register you");
                }
        });
});