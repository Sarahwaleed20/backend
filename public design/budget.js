async function loadUser() {
  try {
    const res = await fetch("http://localhost:3000/api/users/me", {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "login.html";
      return;
    }

    loadBudget();

  } catch (err) {
    window.location.href = "login.html";
  }
}

// load budget
async function loadBudget() {
  const res = await fetch("http://localhost:3000/api/budget", {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();

  document.getElementById("totalBudget").innerText = data.data.budget || 0;
  document.getElementById("spentAmount").innerText = data.data.spent || 0;

  const remaining = (data.data.budget || 0) - (data.data.spent || 0);
  document.getElementById("remaining").innerText = remaining;
}

// save budget
document.getElementById("setBudgetForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("budgetAmount").value);
  if (!amount) return;

  await fetch("http://localhost:3000/api/budget", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ amount })
  });

  document.getElementById("budgetAmount").value = "";
  loadBudget();
});

// logout
document.getElementById("logoutBtn").onclick = async function() {
  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "login.html";
};

loadUser();
