
async function signup(e) {
    try {
        e.preventDefault();
        // console.log(e.target.email.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            number: e.target.number.value,
            password: e.target.password.value

        }

        // console.log(signupDetails);
        const response = await axios.post('http://localhost:3000/user/signup', signupDetails)
        // console.log(response)
       if (response.status === 201 ) {
            alert(response.data.message)
            window.location.href = "./login.html"
            console.log("Sucessfull")
        }
        else if (response.status === 203 ) {
            alert(response.data.message)
            console.log("User already exists")
        }

        else {
            throw new Error("Failed to Sign Up")
        }
    }
    catch ( err) {
        
        console.log(JSON.stringify(err));
       
        document.body.innerHTML += `<div style="color: red;">${err}</div>`;

    }
}

