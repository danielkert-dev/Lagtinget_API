// Function to fetch and display more data when a button is clicked
function populateTable(tableId, data) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
  
    data.forEach(item => {
      const row = tableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
  
      cell1.textContent = item.count;
      cell2.textContent = item.title;
      cell3.textContent = `${item.percentage}%`;
    });
  }
  
  // Function to clear the table
  function clearTable(tableId) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
  }
  