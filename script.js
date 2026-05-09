let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// FORMAT NUMBERS
function format(num) {
  return Number(num).toLocaleString();
}

// SAVE
function save() {
  localStorage.setItem("incomes", JSON.stringify(incomes));
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// PAGE NAVIGATION
function showPage(page) {
  ["main", "setup", "expenses"].forEach(p => {
    document.getElementById(p + "Page")
      .classList.toggle("hidden", p !== page);
  });
}

// TOTAL INCOME
function totalIncome() {
  return incomes.reduce((a, b) => a + b, 0);
}

// ALLOCATION VALUE
function getAllocated(category) {
  if (category.type === "percent") {
    return totalIncome() * category.value / 100;
  }
  return category.value;
}

// ADD INCOME
function addIncome() {

  const value = Number(document.getElementById("incomeInput").value);

  if (!value) return;

  incomes.push(value);

  document.getElementById("incomeInput").value = "";

  save();
  render();
}

// EDIT INCOME
function editIncome(index) {

  const container = document.getElementById(`income-${index}`);

  container.innerHTML = `
    <input type="number" id="editIncomeValue-${index}" value="${incomes[index]}">

    <button onclick="saveIncomeEdit(${index})">Save</button>
  `;
}

function saveIncomeEdit(index) {

  const value = Number(
    document.getElementById(`editIncomeValue-${index}`).value
  );

  if (!value) return;

  incomes[index] = value;

  save();
  render();
}

// DELETE INCOME
function deleteIncome(index) {

  if (!confirm("Delete income entry?")) return;

  incomes.splice(index, 1);

  save();
  render();
}

// ADD CATEGORY
function addCategory() {

  const name = document.getElementById("categoryName").value;

  const type = document.getElementById("allocType").value;

  const value = Number(document.getElementById("categoryValue").value);

  if (!name || !value) return;

  categories.push({
    name,
    type,
    value
  });

  document.getElementById("categoryName").value = "";
  document.getElementById("categoryValue").value = "";

  save();
  render();
}

// EDIT CATEGORY
function editCategory(index) {

  const category = categories[index];

  const container = document.getElementById(`category-${index}`);

  container.innerHTML = `
    <input type="text" id="editCategoryName-${index}" value="${category.name}">

    <select id="editCategoryType-${index}">
      <option value="fixed" ${category.type === "fixed" ? "selected" : ""}>₩ Fixed</option>
      <option value="percent" ${category.type === "percent" ? "selected" : ""}>%</option>
    </select>

    <input type="number" id="editCategoryValue-${index}" value="${category.value}">

    <button onclick="saveCategoryEdit(${index})">Save</button>
  `;
}

function saveCategoryEdit(index) {

  categories[index].name =
    document.getElementById(`editCategoryName-${index}`).value;

  categories[index].type =
    document.getElementById(`editCategoryType-${index}`).value;

  categories[index].value = Number(
    document.getElementById(`editCategoryValue-${index}`).value
  );

  save();
  render();
}

// DELETE CATEGORY
function deleteCategory(index) {

  if (!confirm("Delete category?")) return;

  categories.splice(index, 1);

  save();
  render();
}

// ADD EXPENSE
function addExpense() {

  const category = document.getElementById("categorySelect").value;

  const amount = Number(document.getElementById("expenseAmount").value);

  const note = document.getElementById("expenseNote").value;

  if (!amount) return;

  const now = new Date();

  expenses.push({
    month: now.toLocaleString('default', { month: 'long' }),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    category,
    amount,
    note
  });

  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseNote").value = "";

  save();
  render();
}

// EDIT EXPENSE
function editExpense(index) {

  const expense = expenses[index];

  const row = document.getElementById(`expense-row-${index}`);

  row.innerHTML = `
    <td>${index + 1}</td>

    <td>${expense.date}</td>

    <td>${expense.time}</td>

    <td>
      <input type="text" id="editExpenseCategory-${index}" value="${expense.category}">
    </td>

    <td>
      <input type="number" id="editExpenseAmount-${index}" value="${expense.amount}">
    </td>

    <td>
      <input type="text" id="editExpenseNote-${index}" value="${expense.note}">
    </td>

    <td>
      <button onclick="saveExpenseEdit(${index})">Save</button>
    </td>
  `;
}

function saveExpenseEdit(index) {

  expenses[index].category =
    document.getElementById(`editExpenseCategory-${index}`).value;

  expenses[index].amount = Number(
    document.getElementById(`editExpenseAmount-${index}`).value
  );

  expenses[index].note =
    document.getElementById(`editExpenseNote-${index}`).value;

  save();
  render();
}

// DELETE EXPENSE
function deleteExpense(index) {

  if (!confirm("Delete expense?")) return;

  expenses.splice(index, 1);

  save();
  render();
}

// PRINT REPORT
function printReport() {

  let report = `
    <h1>Monthly Financial Report</h1>

    <h2>Income</h2>
    <ul>
      ${incomes.map(i => `<li>₩${format(i)}</li>`).join("")}
    </ul>

    <h2>Category Summary</h2>
    <table border="1" cellspacing="0" cellpadding="5">
      <tr>
        <th>Category</th>
        <th>Allocated</th>
        <th>Spent</th>
      </tr>

      ${categories.map(c => {

        let spent = expenses
          .filter(e => e.category === c.name)
          .reduce((a,b) => a + b.amount, 0);

        return `
          <tr>
            <td>${c.name}</td>
            <td>₩${format(getAllocated(c))}</td>
            <td>₩${format(spent)}</td>
          </tr>
        `;
      }).join("")}

    </table>

    <h2>Expenses</h2>

    <table border="1" cellspacing="0" cellpadding="5">
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Category</th>
        <th>Amount</th>
        <th>Notes</th>
      </tr>

      ${expenses.map(e => `
        <tr>
          <td>${e.date}</td>
          <td>${e.time}</td>
          <td>${e.category}</td>
          <td>₩${format(e.amount)}</td>
          <td>${e.note}</td>
        </tr>
      `).join("")}

    </table>
  `;

  let printWindow = window.open("", "", "width=900,height=700");

  printWindow.document.write(report);

  printWindow.document.close();

  printWindow.print();
}

// RENDER UI
function render() {

  // CATEGORY DROPDOWN
  const select = document.getElementById("categorySelect");

  select.innerHTML = "";

  categories.forEach(c => {

    let option = document.createElement("option");

    option.value = c.name;
    option.text = c.name;

    select.appendChild(option);

  });

  let other = document.createElement("option");

  other.value = "Other";
  other.text = "Other";

  select.appendChild(other);

  // REMAINING LIST
  const remaining = document.getElementById("remainingList");

  remaining.innerHTML = "";

  categories.forEach(c => {

    let allocated = getAllocated(c);

    let spent = expenses
      .filter(e => e.category === c.name)
      .reduce((a,b) => a + b.amount, 0);

    let left = allocated - spent;

    let div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `
      <strong>
  ${c.name}
  (${c.type === "percent"
    ? c.value + "%"
    : "₩" + format(c.value)})
</strong><br>
      <span class="${left >= 0 ? 'green' : 'red'}">
      ₩${format(left)}
      </span>
    `;

    remaining.appendChild(div);

  });

  // INCOME LIST
  const incomeList = document.getElementById("incomeList");

  incomeList.innerHTML = `
    <h3>Total Income: ₩${format(totalIncome())}</h3>
  `;

  incomes.forEach((income, index) => {

    let div = document.createElement("div");

    div.className = "card small";

    div.innerHTML = `
      ₩${format(income)}

      <div class="inline-actions">
        <button onclick="editIncome(${index})">Edit</button>
        <button onclick="deleteIncome(${index})">Delete</button>
      </div>
    `;

    incomeList.appendChild(div);

  });

  // CATEGORY LIST
  const allocationList = document.getElementById("allocationList");

  allocationList.innerHTML = "";

  let totalAllocated = 0;

  categories.forEach((category, index) => {

    let allocated = getAllocated(category);

    totalAllocated += allocated;

    let div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `
      <strong>${category.name}</strong><br>
      ₩${format(allocated)}

      <div class="inline-actions">
        <button onclick="editCategory(${index})">Edit</button>
        <button onclick="deleteCategory(${index})">Delete</button>
      </div>
    `;

    allocationList.appendChild(div);

  });

  // UNALLOCATED
  let unallocated = totalIncome() - totalAllocated;

  let div = document.createElement("div");

  div.className = "card";

  div.innerHTML = `
    <strong>Unallocated</strong><br>
    ₩${format(unallocated)}
  `;

  allocationList.appendChild(div);

  // EXPENSE TABLE
  const tbody = document.getElementById("expenseTableBody");

  tbody.innerHTML = "";

  expenses.forEach((expense, index) => {

    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${expense.date}</td>
      <td>${expense.time}</td>
      <td>${expense.category}</td>
      <td>₩${format(expense.amount)}</td>
      <td>${expense.note || ""}</td>

      <td>
        <div class="inline-actions">
          <button onclick="editExpense(${index})">Edit</button>
          <button onclick="deleteExpense(${index})">Delete</button>
        </div>
      </td>
    `;

    tbody.appendChild(row);

  });

}

function resetMonth() {

  if (!confirm("Reset all monthly expenses?")) return;

  expenses = [];

  save();
  render();
}

const now = new Date();

document.getElementById("currentMonthYear").innerText =
  now.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });
  
render();

