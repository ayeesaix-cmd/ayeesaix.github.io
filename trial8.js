const DB_KEY = "student_portal_users";
const THEME_KEY = "student_portal_theme";

function getDB() {
  return JSON.parse(localStorage.getItem(DB_KEY) || "{}");
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark-mode";
  document.body.className = savedTheme;
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains("dark-mode")
    ? "dark-mode"
    : "light-mode";
  const newTheme = currentTheme === "dark-mode" ? "light-mode" : "dark-mode";

  document.body.className = newTheme;
  localStorage.setItem(THEME_KEY, newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (theme === "dark-mode") {
    icon.className = "fas fa-moon";
  } else {
    icon.className = "fas fa-sun";
  }
}

function showToast(msg, type = "info") {
  const toast = document.getElementById("toast");
  toast.className = `toast show ${type}`;
  toast.innerText = msg;
  setTimeout(() => {
    toast.className = "toast";
  }, 3500);
}

const authContainer = document.getElementById("authContainer");
const gotoSignUpBtn = document.getElementById("gotoSignUp");
const gotoSignInBtn = document.getElementById("gotoSignIn");

gotoSignUpBtn.addEventListener("click", () => {
  authContainer.classList.add("right-panel-active");
});

gotoSignInBtn.addEventListener("click", () => {
  authContainer.classList.remove("right-panel-active");
});

function handleSignUp(e) {
  e.preventDefault();
  const studentNum = document.getElementById("regStudentNum").value.trim();
  const password = document.getElementById("regPassword").value;
  const firstName = document.getElementById("regFirstName").value.trim();
  const surname = document.getElementById("regSurname").value.trim();
  const age = document.getElementById("regAge").value.trim();
  const year = document.getElementById("regYear").value.trim();
  const section = document.getElementById("regSection").value.trim();
  const rawBirthday = document.getElementById("regBirthday").value;
  const contact = document.getElementById("regContact").value.trim();
  const address = document.getElementById("regAddress").value.trim();

  const motherName = document.getElementById("regMotherName").value.trim();
  const motherContact = document
    .getElementById("regMotherContact")
    .value.trim();
  const motherAddress = document
    .getElementById("regMotherAddress")
    .value.trim();
  const fatherName = document.getElementById("regFatherName").value.trim();
  const fatherContact = document
    .getElementById("regFatherContact")
    .value.trim();
  const fatherAddress = document
    .getElementById("regFatherAddress")
    .value.trim();
  const guardianName = document.getElementById("regGuardianName").value.trim();
  const guardianContact = document
    .getElementById("regGuardianContact")
    .value.trim();
  const guardianAddress = document
    .getElementById("regGuardianAddress")
    .value.trim();

  const db = getDB();

  if (db[studentNum]) {
    showToast("Student Number already registered! Please sign in.", "error");
    return;
  }

  let formattedDate = "--";
  if (rawBirthday) {
    const dateObj = new Date(rawBirthday);
    formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const newUser = {
    studentNum,
    password,
    firstName,
    surname,
    age,
    year,
    section,
    birthday: formattedDate,
    contact,
    address,
    motherName: motherName || "--",
    motherContact: motherContact || "--",
    motherAddress: motherAddress || "--",
    fatherName: fatherName || "--",
    fatherContact: fatherContact || "--",
    fatherAddress: fatherAddress || "--",
    guardianName: guardianName || "--",
    guardianContact: guardianContact || "--",
    guardianAddress: guardianAddress || "--",
  };

  db[studentNum] = newUser;
  saveDB(db);

  showToast("Registration successful! Switching to sign in...", "success");
  document.getElementById("signUpForm").reset();

  document.getElementById("loginStudentNum").value = studentNum;
  setTimeout(() => {
    authContainer.classList.remove("right-panel-active");
  }, 1200);
}

function handleSignIn(e) {
  e.preventDefault();
  const studentNum = document.getElementById("loginStudentNum").value.trim();
  const password = document.getElementById("loginPassword").value;

  const db = getDB();
  const user = db[studentNum];

  if (!user) {
    showToast("Student record not found. Please register.", "error");
    return;
  }

  if (user.password !== password) {
    showToast("Incorrect password. Please try again.", "error");
    return;
  }

  showToast(`Welcome back, ${user.firstName}!`, "success");
  showDashboard(user);
}

function showDashboard(user) {
  authContainer.style.display = "none";
  const dash = document.getElementById("dashboardContainer");
  dash.style.display = "flex";

  const initials =
    ((user.firstName[0] || "") + (user.surname[0] || "")).toUpperCase() || "--";
  document.getElementById("dashAvatar").innerText = initials;
  document.getElementById("dashFullName").innerText =
    `${user.firstName} ${user.surname}`;
  document.getElementById("dashMetaSub").innerText =
    `${user.studentNum} · ${user.year} · Section ${user.section}`;
  document.getElementById("dashAge").innerText = user.age;
  document.getElementById("dashBirthday").innerText = user.birthday;
  document.getElementById("dashContact").innerText = user.contact;
  document.getElementById("dashAddress").innerText = user.address;

  document.getElementById("dashMotherName").innerText = user.motherName;
  document.getElementById("dashMotherContact").innerText = user.motherContact;
  document.getElementById("dashMotherAddress").innerText = user.motherAddress;
  document.getElementById("dashFatherName").innerText = user.fatherName;
  document.getElementById("dashFatherContact").innerText = user.fatherContact;
  document.getElementById("dashFatherAddress").innerText = user.fatherAddress;
  document.getElementById("dashGuardianName").innerText = user.guardianName;
  document.getElementById("dashGuardianContact").innerText =
    user.guardianContact;
  document.getElementById("dashGuardianAddress").innerText =
    user.guardianAddress;
}

function logout() {
  document.getElementById("dashboardContainer").style.display = "none";
  authContainer.style.display = "flex";
  document.getElementById("signInForm").reset();
  showToast("Signed out successfully.", "info");
}

document.addEventListener("DOMContentLoaded", initTheme);
