const themeToggleBtn = document.getElementById("themeToggle");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");
const profileCard = document.getElementById("profileCard");
const input = document.getElementById("usernameInput");

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

function getUser() {
  const username = input.value.trim();
  if (!username) {
    input.classList.add("error-border");
    errorMsg.textContent = "❌ Please enter a username";
    errorMsg.classList.remove("hidden");
    return;
  }

  input.classList.remove("error-border");
  errorMsg.classList.add("hidden");
  loader.classList.remove("hidden");
  profileCard.classList.add("hidden");

  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then(data => {
      document.getElementById("avatar").src = data.avatar_url;
      document.getElementById("name").textContent = data.name || "No Name Provided";
      document.getElementById("bio").textContent = data.bio || "No bio available";
      document.getElementById("repos").textContent = `Public Repos: ${data.public_repos}`;
      document.getElementById("profileLink").href = data.html_url;

      // Links to other pages
      const starredPageLink = document.getElementById("starredPageLink");
      starredPageLink.href = `starred.html?user=${data.login}`;
      starredPageLink.classList.remove("hidden");

      const reposPageLink = document.getElementById("reposPageLink");
      reposPageLink.href = `repos.html?user=${data.login}`;
      reposPageLink.classList.remove("hidden");

      // Export to PDF
      document.getElementById("exportBtn").addEventListener("click", () => {
        const opt = {
          margin: 0.5,
          filename: `${data.login}_profile.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(profileCard).save();
      });

      loader.classList.add("hidden");
      profileCard.classList.remove("hidden");
    })
    .catch(err => {
      loader.classList.add("hidden");
      errorMsg.textContent = `❌ ${err.message}`;
      errorMsg.classList.remove("hidden");
    });
}

document.getElementById("clearBtn").addEventListener("click", () => {
  input.value = "";
  input.classList.remove("error-border");
  errorMsg.classList.add("hidden");
  profileCard.classList.add("hidden");
});

// ✅ Auto-load profile if username is passed in URL
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const userFromURL = params.get("user");

  if (userFromURL) {
    input.value = userFromURL;
    getUser(); // triggers the fetch and display
  }
});
