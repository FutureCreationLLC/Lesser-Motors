const loginPage = location.pathname.includes("login.html");
const dashboardPage = location.pathname.includes("dashboard.html");

if (dashboardPage && localStorage.getItem("adminLogged") !== "yes") {
    location.href = "login.html";
}

function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;
    if (u === "LesseMotors" && p === "Ra160824$") {
        localStorage.setItem("adminLogged","yes");
        location.href = "dashboard.html";
    } else {
        alert("Wrong login details");
    }
}

function logout() {
    localStorage.removeItem("adminLogged");
    location.href = "login.html";
}

function uploadBackground() {
    const file = document.getElementById("backgroundFile").files[0];
    if(!file){alert("Select a file");return;}
    alert("Background uploaded successfully");
}

function uploadCarImages() {
    const type = document.getElementById("carType").value;
    const files = document.getElementById("carFile").files;
    if(files.length===0){alert("Select images");return;}
    alert(files.length + " images uploaded to " + type);
}
