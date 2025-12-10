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

    loadCategories();
    loadExpenses();

  } catch (err) {
    window.location.href = "login.html";
  }
}

// load categories into select
async function loadCategories() {
  const res = await fetch("http://localhost:3000/api/categories", {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  const select = document.getElementById("expenseCategory");
  select.innerHTML = "";

  data.data.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

// load expenses
async function loadExpenses() {
  const res = await fetch("http://localhost:3000/api/expenses", {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  data.data.forEach(exp => {
    const li = document.createElement("li");
    li.textContent = exp.title + " - " + exp.amount + " (" + exp.categoryName + ") ";

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = async () => {
      await fetch("http://localhost:3000/api/expenses/" + exp.id, {
        method: "DELETE",
        credentials: "include"
      });
      loadExpenses();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// add expense
document.getElementById("addExpenseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("expenseTitle").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const categoryId = document.getElementById("expenseCategory").value;

  if (!title || !amount) return;

  await fetch("http://localhost:3000/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, amount, categoryId })
  });

  document.getElementById("expenseTitle").value = "";
  document.getElementById("expenseAmount").value = "";
  loadExpenses();
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
