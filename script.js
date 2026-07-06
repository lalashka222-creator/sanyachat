let myNumber = "";
let currentContact = "";
let generatedCode = "";
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

document.getElementById("register-btn").addEventListener("click", function() {
    const number = document.getElementById("my-number").value.trim();
    if (number === "") return;

    myNumber = number;
    generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

    document.getElementById("code-display").textContent = generatedCode;
    document.getElementById("code-section").style.display = "block";
});

document.getElementById("verify-btn").addEventListener("click", function() {
    const entered = document.getElementById("code-input").value.trim();
    if (entered === generatedCode) {
        localStorage.setItem("myNumber", myNumber);
        document.getElementById("register-screen").style.display = "none";
        document.getElementById("main-screen").style.display = "flex";
        renderContacts();
    } else {
        alert("Неверный код.");
    }
});

document.getElementById("search-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        const number = this.value.trim();
        if (number === "") return;
        if (!contacts.includes(number)) {
            contacts.push(number);
            localStorage.setItem("contacts", JSON.stringify(contacts));
        }
        openChat(number);
        this.value = "";
    }
});

function renderContacts() {
    const container = document.getElementById("contacts-container");
    container.innerHTML = "";

    contacts.forEach(number => {
        const div = document.createElement("div");
        div.className = "contact-item";
        div.textContent = number;
        div.onclick = () => openChat(number);
        container.appendChild(div);
    });
}

function openChat(number) {
    currentContact = number;
    document.getElementById("chat-header").textContent = `Чат с ${number}`;
    const container = document.getElementById("chat-messages");
    container.innerHTML = "";

    const msgs = JSON.parse(localStorage.getItem(`chat_${number}`)) || [];
    msgs.forEach(text => {
        const p = document.createElement("p");
        p.textContent = text;
        container.appendChild(p);
    });
    container.scrollTop = container.scrollHeight;
}

document.getElementById("chat-send").addEventListener("click", sendMessage);
document.getElementById("chat-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (text === "" || currentContact === "") return;

    const container = document.getElementById("chat-messages");
    const p = document.createElement("p");
    p.textContent = text;
    container.appendChild(p);

    let msgs = JSON.parse(localStorage.getItem(`chat_${currentContact}`)) || [];
    msgs.push(text);
    localStorage.setItem(`chat_${currentContact}`, JSON.stringify(msgs));

    input.value = "";
    container.scrollTop = container.scrollHeight;
}

window.onload = function() {
    const saved = localStorage.getItem("myNumber");
    if (saved) {
        myNumber = saved;
        document.getElementById("register-screen").style.display = "none";
        document.getElementById("main-screen").style.display = "flex";
        renderContacts();
    }
};