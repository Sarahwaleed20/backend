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

  } catch (err) {
    window.location.href = "login.html";
  }
}

// load categories
async function loadCategories() {
  const res = await fetch("http://localhost:3000/api/categories", {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  const list = document.getElementById("categoryList");
  list.innerHTML = "";

  data.data.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat.name + " ";

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = async () => {
      await fetch("http://localhost:3000/api/categories/" + cat.id, {
        method: "DELETE",
        credentials: "include"
      });
      loadCategories();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// add category
document.getElementById("addCategoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("categoryName").value.trim();
  if (!name) return;

  await fetch("http://localhost:3000/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name })
  });

  document.getElementById("categoryName").value = "";
  loadCategories();
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
