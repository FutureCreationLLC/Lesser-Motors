// ========================
// LESSE Motors Admin JS
// ========================

// Get elements
const adminEmailInput = document.getElementById("adminEmail");
const adminPassInput = document.getElementById("adminPass");

// Login Function
function adminLogin() {
    const email = adminEmailInput.value.trim();
    const password = adminPassInput.value.trim();

    if(email === "" || password === "") {
        alert("Please enter email and password.");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "dashboard.html";
        })
        .catch(err => {
            alert("Login failed: " + err.message);
        });
}

// Logout Function
function logout() {
    auth.signOut().then(() => {
        window.location.href = "login.html";
    });
}

// ========================
// UPLOAD BACKGROUND
// ========================
function uploadBackground() {
    const file = document.getElementById("bgUpload").files[0];
    if(!file){ alert("Select a background image."); return; }

    const storageRef = storage.ref("website/background.jpg");
    const uploadTask = storageRef.put(file);

    uploadTask.on("state_changed", null,
        (error) => { alert("Upload failed."); },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                db.collection("website").doc("settings").set({background: url},{merge:true});
                alert("Background uploaded!");
            });
        }
    );
}

// ========================
// UPLOAD CAR MODEL
// ========================
function uploadCarModel() {
    const type = document.getElementById("carType").value;
    const file = document.getElementById("carImage").files[0];
    if(!file){ alert("Select an image."); return; }

    const storageRef = storage.ref(`cars/${type}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on("state_changed", null,
        (err) => { alert("Upload failed."); },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                db.collection("cars").add({type:type, image:url, timestamp:firebase.firestore.FieldValue.serverTimestamp()});
                alert("Car model uploaded!");
            });
        }
    );
}

// ========================
// LOAD PREORDERS
// ========================
function loadPreorders() {
    const container = document.getElementById("preorderList");
    db.collection("preorders").orderBy("timestamp","desc").onSnapshot(snapshot => {
        container.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.style.border="1px solid #444";
            div.style.padding="8px";
            div.style.margin="5px 0";
            div.innerHTML = `
                <strong>Name:</strong> ${data.name} <br>
                <strong>Email:</strong> ${data.email} <br>
                <strong>Phone:</strong> ${data.phone} <br>
                <strong>Car Type:</strong> ${data.carType} <br>
                <strong>Message:</strong> ${data.message || ""} <br>
            `;
            container.appendChild(div);
        });
    });
}

// ========================
// LOAD CONTACT MESSAGES
// ========================
function loadContacts() {
    const container = document.getElementById("contactList");
    db.collection("contacts").orderBy("timestamp","desc").onSnapshot(snapshot => {
        container.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.style.border="1px solid #444";
            div.style.padding="8px";
            div.style.margin="5px 0";
            div.innerHTML = `
                <strong>Name:</strong> ${data.name} <br>
                <strong>Email:</strong> ${data.email} <br>
                <strong>Phone:</strong> ${data.phone} <br>
                <strong>Message:</strong> ${data.message} <br>
            `;
            container.appendChild(div);
        });
    });
}

// ========================
// RUN FUNCTIONS ON DASHBOARD LOAD
// ========================
auth.onAuthStateChanged(user => {
    if(user){
        // Only show dashboard if logged in
        if(document.getElementById("preorderList")){
            loadPreorders();
            loadContacts();
        }
    } else {
        if(window.location.pathname.includes("dashboard.html")){
            window.location.href = "login.html";
        }
    }
});
