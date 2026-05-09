function showSection(id) {
  // Hide all sections
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  // Show the selected section
  document.getElementById(id).classList.add('active');
  // Clear search when switching
  document.getElementById("searchInput").value = "";
  filterTable(""); 
}

// Show JavaScript section by default
document.addEventListener("DOMContentLoaded", () => {
  showSection('javascript');
});

// Search filter function
function filterTable(query) {
  const activeSection = document.querySelector("section.active");
  if (!activeSection) return;

  const rows = activeSection.querySelectorAll("table tr");
  let visibleCount = 0;

  rows.forEach((row, index) => {
    if (index === 0) return; // skip header row
    const text = row.innerText.toLowerCase();
    if (text.includes(query.toLowerCase())) {
      row.style.display = "";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  });

  // Show "No results" if nothing matches
  let noResults = activeSection.querySelector(".no-results");
  if (!noResults) {
    noResults = document.createElement("p");
    noResults.className = "no-results";
    noResults.style.textAlign = "center";
    noResults.style.color = "#666";
    activeSection.appendChild(noResults);
  }
  noResults.textContent = visibleCount === 0 ? "No results found." : "";
}

// Attach event listener to search input
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("keyup", () => {
    filterTable(searchInput.value);
  });
});

// Make table columns sortable
function makeTablesSortable() {
  document.querySelectorAll("section table").forEach(table => {
    const headers = table.querySelectorAll("th");
    headers.forEach((header, index) => {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => {
        sortTable(table, index);
      });
    });
  });
}

function sortTable(table, columnIndex) {
  const rows = Array.from(table.querySelectorAll("tr:nth-child(n+2)")); // skip header
  const isAscending = table.getAttribute("data-sort-dir") !== "asc";
  
  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].innerText.toLowerCase();
    const bText = b.cells[columnIndex].innerText.toLowerCase();
    return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });

  rows.forEach(row => table.appendChild(row));
  table.setAttribute("data-sort-dir", isAscending ? "asc" : "desc");
}

// Initialize sortable tables after page loads
document.addEventListener("DOMContentLoaded", () => {
  makeTablesSortable();
});

// ===== Load Students from JSON =====
async function loadStudents() {
  const response = await fetch("students.json");
  const data = await response.json();

  Object.keys(data).forEach(category => {
    const section = document.getElementById(category);
    if (!section) return;

    const table = section.querySelector("table");
    data[category].forEach(student => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.class}</td>
        <td>${student.phone}</td>
        <td>${student.email}</td>
      `;
      table.appendChild(row);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadStudents();
});


// Call after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  loadStudents();
  makeTablesSortable();
});
