const form = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const emailErr = document.getElementById("loginEmailErr");
const passErr = document.getElementById("loginPassErr");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  emailErr.textContent = "";
  passErr.textContent = "";

  if (!emailInput.value) {
    emailErr.textContent = "Email is required";
    return;
  }

  if (!passwordInput.value) {
    passErr.textContent = "Password is required";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value
      })
    });

    const data = await res.json();

    if (res.status === 200) {
      alert(data.message);
      window.location.href = "dashboard.html";
    } else {
      passErr.textContent = data.message || "Login failed";
    }

  } catch (err) {
    passErr.textContent = "Cannot reach server";
  }
});
