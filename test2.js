/* ACCOUNT SYSTEM */

function showRegister() {
  document.getElementById("loginForm").classList.add("hidden");

  document.getElementById("registerForm").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("registerForm").classList.add("hidden");

  document.getElementById("loginForm").classList.remove("hidden");
}

function register() {
  let email = document.getElementById("regEmail").value;

  let password = document.getElementById("regPassword").value;

  if (!email || !password) {
    alert("Please fill all fields.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    alert("Email already registered.");
    return;
  }

  users.push({
    email,
    password,
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");

  showLogin();
}

function login() {
  let email = document.getElementById("loginEmail").value;

  let password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let validUser = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (validUser) {
    localStorage.setItem("loggedInUser", email);

    loadDashboard();
  } else {
    alert("Invalid email or password.");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");

  location.reload();
}

function loadDashboard() {
  document.getElementById("authPage").classList.add("hidden");

  document.getElementById("dashboardPage").classList.remove("hidden");

  document.getElementById("welcomeUser").innerHTML =
    "Welcome, " + localStorage.getItem("loggedInUser");

  displayStudents();
  updateDashboard();
}

if (localStorage.getItem("loggedInUser")) {
  loadDashboard();
}

/* STUDENT SYSTEM */

let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function addStudent() {
  let student = {
    id: studentId.value,
    name: fullName.value,
    age: age.value,
    gender: gender.value,
    course: course.value,
    year: yearLevel.value,
  };

  if (
    !student.id ||
    !student.name ||
    !student.age ||
    !student.gender ||
    !student.course ||
    !student.year
  ) {
    alert("Complete all fields.");
    return;
  }

  students.push(student);

  saveStudents();

  displayStudents();

  updateDashboard();

  clearForm();
}

function displayStudents() {
  studentTable.innerHTML = "";

  students.forEach((student, index) => {
    studentTable.innerHTML += `
        <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.gender}</td>
        <td>${student.course}</td>
        <td>${student.year}</td>
        <td>
        <button
        class="delete-btn"
        onclick="deleteStudent(${index})">
        Delete
        </button>
        </td>
        </tr>
        `;
  });
}

function deleteStudent(index) {
  if (confirm("Delete this student?")) {
    students.splice(index, 1);

    saveStudents();

    displayStudents();

    updateDashboard();
  }
}

function searchStudent() {
  let search = document.getElementById("searchInput").value.toLowerCase();

  let rows = document.querySelectorAll("#studentTable tr");

  rows.forEach((row) => {
    let name = row.cells[1].textContent.toLowerCase();

    row.style.display = name.includes(search) ? "" : "none";
  });
}

function updateDashboard() {
  let total = students.length;

  let males = students.filter((s) => s.gender === "Male").length;

  let females = students.filter((s) => s.gender === "Female").length;

  let uniqueCourses = [...new Set(students.map((s) => s.course))];

  totalStudents.textContent = total;
  maleStudents.textContent = males;
  femaleStudents.textContent = females;
  courseCount.textContent = uniqueCourses.length;

  let malePercent = total ? (males / total) * 100 : 0;

  let femalePercent = total ? (females / total) * 100 : 0;

  maleBar.style.width = malePercent + "%";

  femaleBar.style.width = femalePercent + "%";
}

function clearForm() {
  studentId.value = "";
  fullName.value = "";
  age.value = "";
  gender.value = "";
  course.value = "";
  yearLevel.value = "";
}
