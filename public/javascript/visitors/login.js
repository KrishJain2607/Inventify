const lightblue = "#96B9FF"
const darkblue = "#071E41"

const roles = document.querySelectorAll('.role')
roles[0].style.backgroundColor = `${lightblue}`
roles[0].style.color = `${darkblue}`
roles[0].style.opacity = "1"
roles[0].style.fontWeight = "900"

var roleType = "Admin"

roles.forEach((role) => {
    role.addEventListener('click', () => {
        for(var i = 0; i < roles.length; i++) {
            roles[i].style.backgroundColor = `${darkblue}`
            roles[i].style.color = `#fff`
            roles[i].style.opacity = "0.6"
            roles[i].style.fontWeight = "400"
        }
        role.style.backgroundColor = `${lightblue}`
        role.style.color = `${darkblue}`
        role.style.opacity = "1"
        role.style.fontWeight = "900"
        roleType = role.textContent
    })
})

// ------------------------------------------------------------------------------------------------

const token = localStorage.getItem('token')
if(token) {
    // Assuming you have the manager's username in a variable
    const managerUsername = localStorage.getItem('username');
    // Redirect to the dashboard page with the username parameter
    window.location.href = `/manager-dashboard/${managerUsername}`;

}
else console.log("You have to login !. Token is missing :(")


submit.addEventListener('click', (e) => {
    const username = document.querySelector("#username")
    const password = document.querySelector("#password")
    
    e.preventDefault()
    // console.log(username.value)
    // console.log(password.value)
    // console.log(roleType)

    // validation on frontend 
    if(!username.value || !password.value || !roleType) {
        console.log("All fields are required")
    }
    else {
        // API call
        login(username.value, password.value, roleType)
    }
})

async function login(email, password, roleType) {
    try {
        const response = await fetch('http://localhost:5500/login/', {
            method: "POST",
            body: JSON.stringify(
                {
                    email: email,
                    password: password,
                    role: roleType
                }
            ),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })  
        // console.log(response)
        
        const data = await response.json()
        console.log(data)
        if(data.success) {
            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)
            localStorage.setItem("username", data.username)
        }
        const token = localStorage.getItem('token')
        if(token) {
            // Assuming you have the manager's username in a variable
            const managerUsername = localStorage.getItem('username');
            // Redirect to the dashboard page with the username parameter
            window.location.href = `/manager-dashboard/${managerUsername}`;
        
        }
    
    } catch (error) {
        console.log("Error during login on client side")
        console.log(error)
    }
}

// login("harsh.jain1@gmail.com", "123", "retailer")

// login("manager1@gmail.com", "123", "manager")

