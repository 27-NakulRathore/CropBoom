const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    const users = JSON.parse(localStorage.getItem("cropBoomUsers")) || [];

    const user = users.find(function (u) {
        return u.email === email && u.password === password;
    });

    if (user) {

        localStorage.setItem("currentUser", JSON.stringify(user));

        if (user.role === "farmer") {
            window.location.href = "farmer-dashboard.html";
        } else {
            window.location.href = "buyer-dashboard.html";
        }

    } else {

        alert("Invalid credentials. Please try again.");

    }

});