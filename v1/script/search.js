     // Add an event listener to the search input
     const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function () {
      const searchText = searchInput.value.toLowerCase();
      const nameButtons = document.querySelectorAll(".nameButton");
      
      nameButtons.forEach(button => {
        const buttonName = button.textContent.toLowerCase();
        if (buttonName.includes(searchText)) {
          button.style.display = "block"; // Show the button if it matches the search text
        } else {
          button.style.display = "none"; // Hide the button if it doesn't match the search text
        }
      });
    });
