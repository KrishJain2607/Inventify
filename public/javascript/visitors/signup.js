toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "100",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "show",
    "hideMethod": "hide"
};

document.querySelector("#button").onclick = (e) => {
    const fname = document.querySelector("#name").value
    const phoneno = document.querySelector("#phoneno").value
    const email = document.querySelector("#email").value
    const fpasswd = document.querySelector("#fpasswd").value
    const spasswd = document.querySelector("#spasswd").value

    e.preventDefault();
    
    if(!fname || !phoneno || !email || !fpasswd || !spasswd) toastr.warning("All fields are required!")
    console.log(fname, phoneno, email, fpasswd, spasswd)
    // Display an info toast with no title
    if(fpasswd !== spasswd) {
        toastr.error("Password doesn't match")
    }
    else {
        // API CALL
        

        
    }
}

function handleCredentialResponse(gobj) {
    console.log("Google object => ",gobj.credential)
    signUpWithGoogle(gobj.credential)
}

async function signUpWithGoogle(credential) {
    try {
        const options = {
            method: "POST",
            body: JSON.stringify({
              credential: credential
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        }
        const response = await fetch('http://localhost:3000/api/signup-with-google', options)
        console.log(typeof(response))
        // console.log(data)
    } catch (error) {
        console.log("Error => ",error)
    }
}

