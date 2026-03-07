function setRole(role) {

    const farmerBtn = document.getElementById("roleFarmer");
    const buyerBtn = document.getElementById("roleBuyer");
    const roleInput = document.getElementById("userRole");
    const roleText = document.getElementById("btnRoleText");

    if (role === "farmer") {

        farmerBtn.className =
            "flex-1 py-2 rounded-md bg-white text-green-600 shadow-sm font-medium";

        buyerBtn.className =
            "flex-1 py-2 rounded-md text-gray-500 font-medium";

        roleInput.value = "farmer";
        roleText.innerText = "Farmer";

    } else {

        buyerBtn.className =
            "flex-1 py-2 rounded-md bg-white text-green-600 shadow-sm font-medium";

        farmerBtn.className =
            "flex-1 py-2 rounded-md text-gray-500 font-medium";

        roleInput.value = "buyer";
        roleText.innerText = "Buyer";
    }
}


document.getElementById("registerForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("cropBoomUsers")) || [];

    const newUser = {

        name: document.getElementById("regName").value,
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPass").value,
        role: document.getElementById("userRole").value
    };

    users.push(newUser);

    localStorage.setItem("cropBoomUsers", JSON.stringify(users));

    alert("Registration successful. Please login.");

    window.location.href = "login.html";
});