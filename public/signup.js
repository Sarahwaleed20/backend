document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  let valid = true;

  if (name.length < 2) {
    document.getElementById("nameErr").innerText = "Name is too short";
    valid = false;
  } else {
    document.getElementById("nameErr").innerText = "";
  }

  if (!email.includes("@")) {
    document.getElementById("signupEmailErr").innerText = "Invalid email format";
    valid = false;
  } else {
    document.getElementById("signupEmailErr").innerText = "";
  }

  if (password.length < 6) {
    document.getElementById("signupPassErr").innerText = "Min 6 characters";
    valid = false;
  } else {
    document.getElementById("signupPassErr").innerText = "";
  }

  if (!valid) return;

  try {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }) 
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.href = "login.html";
    } else {
      alert(data.message || "Signup failed");
    }

  } catch (err) {
    console.error(err);
    alert("Could not connect to server. Try again later.");
  }
});
