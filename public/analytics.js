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

    loadAnalytics();

  } catch (err) {
    window.location.href = "login.html";
  }
}

async function loadAnalytics() {
  const res = await fetch("http://localhost:3000/api/analytics/categories", {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();

  const labels = data.data.map(item => item.categoryName);
  const values = data.data.map(item => item.totalAmount);

  new Chart(document.getElementById("categoryChart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: values
      }]
    }
  });
}

// logout
document.getElementById("logoutBtn").onclick = async function() {
  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "login.html";
};

loadUser();
