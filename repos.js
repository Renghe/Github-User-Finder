const themeToggleBtn = document.getElementById("themeToggle");

function applyTheme() {
  const dark = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", dark);
  themeToggleBtn.textContent = dark ? "☀️" : "🌙";
}
applyTheme();

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
});

function qs(id) {
  return document.getElementById(id);
}

const username = new URLSearchParams(window.location.search).get("user");
const loader = qs("loader");
const errorMsg = qs("errorMsg");
const repoGrid = qs("repoGrid");
const title = qs("title");
const backLink = qs("backLink");

if (!username) {
  loader.classList.add("hidden");
  errorMsg.textContent = "❌ No username in URL";
  errorMsg.classList.remove("hidden");
} else {
  title.textContent = `🗂️ ${username}'s Recent Repositories`;
  backLink.href = `index.html?user=${username}`;

  fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
    .then(res => {
      if (!res.ok) throw new Error("Couldn't fetch repositories.");
      return res.json();
    })
    .then(repos => {
      loader.classList.add("hidden");

      if (repos.length === 0) {
        errorMsg.textContent = "ℹ️ No repositories found.";
        errorMsg.classList.remove("hidden");
        return;
      }

      repoGrid.classList.remove("hidden");
      repos.forEach(repo => {
        const card = document.createElement("div");
        card.className = "repo-card";
        card.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || "No description"}</p>
          <p>⭐ ${repo.stargazers_count}
             ${repo.language ? `• 🖥️ ${repo.language}` : ""}
          </p>
          <p>🕒 Updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
        `;
        repoGrid.appendChild(card);
      });
    })
    .catch(err => {
      loader.classList.add("hidden");
      errorMsg.textContent = `❌ ${err.message}`;
      errorMsg.classList.remove("hidden");
    });
}
