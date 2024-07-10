const signForm = document.getElementById("signUpForm");
const logForm = document.getElementById("logInForm");
function openSignForm1() {
    const toSignUp = document.getElementById("signButton");
    openForms(signForm, toSignUp);
}

function openLogForm() {
    openForms(logForm, signForm);
}

function openSignForm2() {
    openForms(signForm, logForm);
}

function openForms(block, none) {
    block.style.display = "block";
    none.style.display = "none";
}

function addUser(event) {
    event.preventDefault();
    const userName = document.getElementById('name').value;
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;
    let userIsExist;
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
        localStorage.setItem("current user", JSON.stringify());
    }
    let users = JSON.parse(localStorage.getItem("users"));
    if (users.length == 0) {
        userIsExist = false
    } else {
        userIsExist = userExist(userName, userPassword, userEmail, users);
    }
    if (!userIsExist) {
        let newUser = new user(userName, userPassword, userEmail);
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("current user", JSON.stringify(newUser));
        window.location.href = "./game.html";
    }
    document.getElementById("signUpForm").reset();
}

function userExist(name, password, email, users) {
    for (let person of users) {
        if (person.name == name && person.password == password && person.Email == email) {
            alert("The User already exist, Please Log-In");
            return true;
        }
        else if (person.name == name && person.password == password) {
            alert("Your data is already saved in the system with a different email address. Please re-enter the data");
            return true;
        }
        else if (person.name == name && person.Email == email) {
            alert("Your data is already saved in the system with a different password. Please re-enter the data");
            return true;
        }
        else if (person.Email == email && person.password == password) {
            alert("Your data is already saved in the system with a different name. Please re-enter the data");
            return true;
        }
    }
    return false;
}

function logIn(event) {
    event.preventDefault();
    let isExist;
    let users = JSON.parse(localStorage.getItem("users"));
    const userName = document.getElementById('logName').value;
    const userPassword = document.getElementById('logPassword').value;
    if (!users) {
        isExist = false;
    }
    else {
        isExist = isLogIn(userName, userPassword, users);
    }
    if (isExist) {
        let currentUser = new user(userName, userPassword);
        localStorage.setItem("current user", JSON.stringify(currentUser));
        window.location.href = "./game.html";
    }
    else {
        alert("This user does not exist in the system, Please sign up");
    }
    document.getElementById("logInForm").reset();
}

function isLogIn(name, password, users) {
    for (let person of users) {
        if (person.name == name && person.password == password) {
            return true;
        }
    }
    return false;
}
