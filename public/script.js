// ======================================
// API Configuration
// ======================================

let API_URL = "";


// Load API address from config.json

async function loadConfig(){

    try{

        const response = await fetch("/config.json");

        const config = await response.json();

        API_URL = config.api;


        initializeAuth();


    }
    catch(error){

        console.error(
            "Failed to load config:",
            error
        );

    }

}



// ======================================
// Start Authentication
// ======================================

function initializeAuth(){


// ======================================
// Elements
// ======================================

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("signin");

const loginForm = document.getElementById("loginform");
const createForm = document.getElementById("accountcreationform");

const createName = document.getElementById("fullname");
const createEmail = document.getElementById("createemail");
const createPassword = document.getElementById("createpassword");

const createButton = document.getElementById("createaccount");

const showCreate = document.getElementById("accountcreation");
const showLogin = document.getElementById("showloginform");

const authMessage = document.getElementById("authmessage");



// ======================================
// Initial State
// ======================================

passwordInput.style.display = "none";

createForm.style.display = "none";



// ======================================
// Messages
// ======================================

function showError(message){


    authMessage.innerHTML = `

    <svg width="22" height="22" viewBox="0 0 24 24">

        <path
        fill="#f4b400"
        d="M12 2L1 21h22L12 2z"/>

        <text
        x="12"
        y="18"
        text-anchor="middle"
        font-size="14"
        font-weight="bold"
        fill="black">
        !
        </text>

    </svg>


    <span>${message}</span>

    `;


    authMessage.style.display="flex";


}



function clearMessage(){

    authMessage.style.display="none";

}




// ======================================
// Email Check With Delay
// ======================================

let emailTimer;


emailInput.addEventListener(
"input",
()=>{


    const email =
    emailInput.value.trim();


    passwordInput.value="";

    passwordInput.style.display="none";


    clearTimeout(emailTimer);



    if(!email){

        return;

    }



    emailTimer=setTimeout(
    async ()=>{


        clearMessage();



        try{


            const response =
            await fetch(
                `${API_URL}/check-email`,
                {

                    method:"POST",

                    credentials:"include",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },

                    body:JSON.stringify({

                        email

                    })

                }
            );



            const data =
            await response.json();



            if(data.exists){


                passwordInput.style.display=
                "block";


                passwordInput.focus();


            }
            else{


                loginForm.style.display=
                "none";


                createForm.style.display=
                "flex";


                createEmail.value=
                email;


                createName.focus();


            }



        }
        catch(error){


            showError(
                "Unable to connect to server."
            );


        }



    },600);


});




// ======================================
// Login
// ======================================

loginButton.addEventListener(
"click",
async ()=>{


    const email =
    emailInput.value.trim();


    const password =
    passwordInput.value;



    if(!password){

        showError(
            "Enter your password."
        );

        return;

    }



    try{


        const response =
        await fetch(
            `${API_URL}/login`,
            {

                method:"POST",

                credentials:"include",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:JSON.stringify({

                    email,

                    password

                })

            }
        );



        const data =
        await response.json();



        if(data.success){


            window.location.href="/";


        }
        else{


            showError(
                "Wrong password."
            );


        }



    }
    catch(error){


        showError(
            "Unable to login."
        );


    }



});




// ======================================
// Create Account
// ======================================

createButton.addEventListener(
"click",
async ()=>{


    const fullName =
    createName.value.trim();


    const email =
    createEmail.value.trim();


    const password =
    createPassword.value;



    if(
        !fullName ||
        !email ||
        !password
    ){

        showError(
            "Fill all required fields."
        );

        return;

    }



    try{


        const response =
        await fetch(
            `${API_URL}/create-account`,
            {

                method:"POST",

                credentials:"include",

                headers:{

                    "Content-Type":
                    "application/json"

                },


                body:JSON.stringify({

                    fullName,

                    username:
                    email.split("@")[0],

                    email,

                    password

                })

            }
        );



        const data =
        await response.json();



        if(data.success){


            window.location.href="/";


        }
        else{


            showError(
                data.message
            );


        }



    }
    catch(error){


        showError(
            "Unable to create account."
        );


    }



});




// ======================================
// Switch Forms
// ======================================

showCreate.addEventListener(
"click",
()=>{


    loginForm.style.display="none";

    createForm.style.display="flex";


});



showLogin.addEventListener(
"click",
()=>{


    createForm.style.display="none";

    loginForm.style.display="flex";


});



}

// ======================================
// Account Settings System
// ======================================


// Only run on settings page
if (
    document.getElementById("accountsettings")
) {


let settingsAPI;


// Load config
async function loadSettingsConfig(){

    const response =
    await fetch("../config.json");

    const config =
    await response.json();

    settingsAPI =
    config.api;

}



// Show message

function showAuthMessage(message){


    const box =
    document.getElementById(
        "authmessage"
    );


    if(!box) return;


    box.style.display="flex";


    box.innerHTML = `

    <svg viewBox="0 0 24 24">

        <path
        fill="#ffd43b"
        d="M12 2L1 21h22L12 2z"
        />

        <text
        x="12"
        y="18"
        text-anchor="middle"
        font-size="14"
        fill="black"
        >
        !
        </text>

    </svg>

    <span>
    ${message}
    </span>

    `;


}



// Check if user is logged in

async function loadAccount(){


    const response =
    await fetch(
        `${settingsAPI}/session`,
        {
            credentials:"include"
        }
    );


    const data =
    await response.json();



    if(!data.loggedIn){


        window.location.href =
        "../login/";


        return;


    }



    document
    .getElementById("username")
    .textContent =
    data.user.username;



    document
    .getElementById("email")
    .textContent =
    data.user.email;


}



// Change password

const changePasswordButton =
document.getElementById(
    "changepassword"
);


if(changePasswordButton){


changePasswordButton.onclick =
async()=>{


const response =
await fetch(
`${settingsAPI}/account/change-password`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

credentials:"include",

body:JSON.stringify({

currentPassword:
document.getElementById(
"currentpassword"
).value,


newPassword:
document.getElementById(
"newpassword"
).value


})

});


const data =
await response.json();


showAuthMessage(
data.message ||
(data.success
?
"Password changed"
:
"Error")
);


};


}



// Logout

const logoutButton =
document.getElementById(
"logout"
);


if(logoutButton){


logoutButton.onclick =
async()=>{


await fetch(
`${settingsAPI}/logout`,
{

method:"POST",

credentials:"include"

});


window.location.href =
"../login/";

};


}



// Delete account

const deleteButton =
document.getElementById(
"deleteaccount"
);


if(deleteButton){


deleteButton.onclick =
async()=>{


if(
!confirm(
"Delete account permanently?"
)
)
return;



const response =
await fetch(
`${settingsAPI}/account/delete-account`,
{

method:"POST",

credentials:"include"

}

);



const data =
await response.json();



if(data.success){


window.location.href =
"../login/";


}
else{


showAuthMessage(
data.message
);


}



};


}



// Theme

const darkButton =
document.getElementById(
"darkmode"
);


const lightButton =
document.getElementById(
"lightmode"
);



if(darkButton){


darkButton.onclick=()=>{


document.body.classList.add(
"dark"
);


localStorage.setItem(
"theme",
"dark"
);


};


}



if(lightButton){


lightButton.onclick=()=>{


document.body.classList.remove(
"dark"
);


localStorage.setItem(
"theme",
"light"
);


};


}



// Load saved theme

if(
localStorage.getItem("theme")
==="dark"
){

document.body.classList.add(
"dark"
);

}



// Start settings

loadSettingsConfig()
.then(loadAccount);


}
// ==============================
// Schedule Account Deletion
// ==============================

router.post("/delete-account", auth, (req, res) => {

    const accounts = getAccounts();

    const user = accounts.find(account =>
        account.email === req.user.email
    );

    if (!user) {

        return res.status(404).json({
            success: false,
            message: "Account not found."
        });

    }

    // Already scheduled?
    if (user.deletionScheduled) {

        return res.status(400).json({
            success: false,
            message: "Account is already scheduled for deletion."
        });

    }

    // 14 days from now
    const deletionDate = new Date();

    deletionDate.setDate(
        deletionDate.getDate() + 14
    );

    user.deletionScheduled = true;

    user.deletionDate = deletionDate.toISOString();

    saveAccounts(accounts);

    res.json({

        success: true,

        message: "Your account has been scheduled for deletion.",

        deletionDate: user.deletionDate

    });

});
// Start

loadConfig();