async function persons() {

  const headers = new Headers();
  headers.append(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  );

  let personsData = [];

    try {
      const personsLink = "https://api.lagtinget.ax/api/persons.json?state=1";
      const response = await fetch(personsLink, { headers });
      personsData = await response.json(); // Reassign, using let instead of const
  

      // Attendance of ledarmöte
      const attendanceList = [];
      const aTypeData = []; // Create an array for aTypeData
      const tTypeData = []; // Create an array for tTypeData
      
      for (let i = 0; i < personsData.length; i++) {
        const id = personsData[i].id;
        const link = `https://api.lagtinget.ax/api/persons/${id}/attendance.json`;
        const linkThemeSpeach = `https://api.lagtinget.ax/api/persons/${id}/theme_speeches.json`;
        const linkAType = "https://api.lagtinget.ax/api/presence_states.json";
        const linkTType = "https://api.lagtinget.ax/api/themes.json";
      
        try {
          const response = await fetch(link, { headers });
          const attendanceData = await response.json();
      
          const responseAType = await fetch(linkAType, { headers });
          const aTypeDataItem = await responseAType.json(); // Use a different variable name
      
          const response2 = await fetch(linkThemeSpeach, { headers });
          const themeSpeechData = await response2.json();
      
          const responseTType = await fetch(linkTType, { headers });
          const tTypeDataItem = await responseTType.json(); // Use a different variable name
      
          const combinedData = {
            id: id,
            name: personsData[i].name,
            attendance: attendanceData.length > 0 ? attendanceData : "None",
            aType: aTypeDataItem.length > 0 ? aTypeDataItem : "None",
            themeSpeaches: themeSpeechData.length > 0 ? themeSpeechData : "None",
            tType: tTypeDataItem.length > 0 ? tTypeDataItem : "None",
          };

          attendanceList.push(combinedData);
          aTypeData.push(aTypeDataItem); // Push the fetched data into the array
          tTypeData.push(tTypeDataItem); // Push the fetched data into the array
        } catch (error) {
          console.error('Error:', error);
          throw error; // Propagate the error to the caller
        }
      }
      
        
    console.log('Attendance List:', attendanceList); // Log the attendance list

  // Get the container element where person sections will be added
  var container = document.getElementById("personContainer");

  // Clear existing content if any
  container.innerHTML = "";

  // Loop over the attendanceList and generate a section for each person
  attendanceList.forEach(function (item) {
    // Create a new row for the person
    var personRow = document.createElement("div");
    personRow.classList.add("row", "mb-4");

    // Left Column (Buttons)
    var leftColumn = document.createElement("div");
    leftColumn.classList.add("col-md-4"); // Adjust the column width as needed

    // Create and append Name button
    var nameButton = document.createElement("button");
    nameButton.textContent = item.name;
    nameButton.classList.add("btn", "btn-warning", "btn-sm", "btn-block");
    leftColumn.appendChild(nameButton);
    

    // Right Column (Information)
    var rightColumn = document.createElement("div");
    rightColumn.classList.add("col-md-8"); // Adjust the column width as needed

    // Create a div for person details and initially hide it
    var detailsDiv = document.createElement("div");
    detailsDiv.style.display = "none";

    // Create and append Attendance paragraph
    var attendanceParagraph = document.createElement("p");
    var attendanceContent = '';

    // ... Code for populating attendanceContent based on the item's data

    attendanceParagraph.innerHTML = attendanceContent;
    detailsDiv.appendChild(attendanceParagraph);

    // Create and append Theme Speeches paragraph
    var themeSpeechesParagraph = document.createElement("p");
    var themeSpeechParagraph = '';

    // ... Code for populating themeSpeechParagraph based on the item's data

    themeSpeechesParagraph.innerHTML = themeSpeechParagraph;
    detailsDiv.appendChild(themeSpeechesParagraph);

    // Append the details div to the right column
    rightColumn.appendChild(detailsDiv);

    // Add an event listener to toggle visibility of details when the button is clicked
    nameButton.addEventListener("click", function () {
      if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block";
        // Fetch and populate data here when the button is clicked
        // You can make additional fetch requests and update detailsDiv content
      } else {
        detailsDiv.style.display = "none";
      }
    });

    // Append left and right columns to the row
    personRow.appendChild(leftColumn);
    personRow.appendChild(rightColumn);

    // Append the person row to the container
    container.appendChild(personRow);
  });

  // After data is fetched, hide loading animation
  document.getElementById("loading").style.display = "none";
  document.getElementById("personContainer").style.display = "block";


    } catch (error) {
      // Handle any errors that occurred during the fetch request
      console.error('Error:', error);
    }
  
}


export default persons;