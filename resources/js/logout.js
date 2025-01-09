document.addEventListener('DOMContentLoaded', () =>{
    const logoutBttn = document.getElementById('logoutBttn');

    if (logoutBttn) {
        logoutBttn.addEventListener('click', async(e)=>{
            // e.preventDefault();

            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
            });
            if (response.ok) {
                window.location.href = '/home';
                // alert("you're logged out!");
            } else {
                alert("somehow was not able to log out");

            }
        })
    }
})