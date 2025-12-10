async function loadUser() {
  try {
    const res = await fetch("http://localhost:3000/api/users/me", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok && data.data) {
      document.getElementById("welcomeText").innerText =
        "Welcome " + data.data.email;
    } else {
      window.location.href = "login.html";
    }

  } catch (err) {
    document.getElementById("welcomeText").innerText = "Error loading user";
  }
}

document.getElementById("categoriesBtn").onclick = function() {
  window.location.href = "categories.html";
};

document.getElementById("expensesBtn").onclick = function() {
  window.location.href = "expenses.html";
};

document.getElementById("analyticsBtn").onclick = function() {
  window.location.href = "analytics.html";
};

document.getElementById("budgetBtn").onclick = function() {
  window.location.href = "budget.html";
};

document.getElementById("logoutBtn").onclick = async function() {
  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "login.html";
};

loadUser();
