let slides = document.querySelectorAll(".slide");
let index = 0;
function showSlides() {
    slides.forEach(s => s.classList.remove("active"));
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}
setInterval(showSlides, 4000);

async function loadModels() {
    let response = await fetch("backend/list_images.php?type=models");
    let data = await response.json();
    let container = document.getElementById("modelsContainer");
    container.innerHTML = "";
    data.forEach(item => {
        let div = document.createElement("div");
        div.className = "model-card";
        let img = document.createElement("img");
        img.src = item;
        let t = document.createElement("div");
        t.className = "model-title";
        t.innerText = item.includes("pragya") ? "Pragya" : item.includes("sedan") ? "Sedan" : "Bus";
        div.appendChild(img);
        div.appendChild(t);
        container.appendChild(div);
    });
}

async function loadGallery() {
    let response = await fetch("backend/list_images.php?type=gallery");
    let data = await response.json();
    let container = document.getElementById("galleryContainer");
    container.innerHTML = "";
    data.forEach(item => {
        let img = document.createElement("img");
        img.src = item;
        container.appendChild(img);
    });
}
