// List of ledarmöte
// import idList from './script/ledamöte.js';
// console.log(idList);

// Name of ledarmöte
import fetchPersons from './script/persons.js';

// Hide the table initially and show loading animation
document.getElementById("attendanceTable").style.display = "none";
document.getElementById("loading").style.display = "block";


async function persons() {
    try {
      const personsData = await fetchPersons();
      const personsList = [];
      // console.log('Fetched Persons:', personsData);
      // Iterate over the idList and find matching persons

      // for (let i = 0; i < idList.length; i++) {
      //   const id = idList[i];
      //   const person = personsData.find(person => person.id === id.toString());
      //   if (person) {
      //     personsList.push({ id: person.id, name: person.name });
      //   } else {
      //     personsList.push({ id: id, name: 'Namn saknas' });
      //   }
      // }

      // console.log('Persons List:', personsList); // Log the final persons list
  
      for (let i = 0; i < personsData.length; i++) {
        const id = personsData[i].id;
        const person = personsData[i].name;
        if (person) {
          personsList.push({ id: id, name: person });
        } else {
          personsList.push({ id: id, name: 'Namn saknas' });
        }
      }

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
      
        const headers = new Headers();
        headers.append(
          'User-Agent',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        );
      
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

 // Get the table body element
 var tableBody = document.getElementById("attendanceTableBody");

 // Clear existing table rows if any
 tableBody.innerHTML = "";

 // Loop over the attendanceList and generate table rows
 attendanceList.forEach(function (item) {
   // Create a new table row
   var row = document.createElement("tr");

   // Create and append Name cell
   var nameCell = document.createElement("td");
   if (item.name === "Namn saknas") {
    nameCell.textContent = item.name;
    nameCell.style.color = "red"; // Set the text color to red
  } else {
    nameCell.textContent = item.name;
  }
  
  row.appendChild(nameCell);

// Create and append Attendance cell
var attendanceCell = document.createElement("td");
var attendanceContent = '';

if (item.attendance && item.attendance[0] && item.attendance[0].attendance) {
  item.attendance[0].attendance.forEach(function (attendanceItem, index) {
    attendanceContent += " Antal: " + attendanceItem.count;

    // Check if there is a corresponding aType item
    if (item.aType && item.aType[index]) {
      attendanceContent += ", Typ: " + item.aType[index].title;
    }

    attendanceContent += "<br>";
  });
} else {
  attendanceContent = "None";
}

attendanceCell.innerHTML = attendanceContent;
row.appendChild(attendanceCell);

// Create and append Theme Speeches cell
var themeSpeechesCell = document.createElement("td");
var themeSpeechParagraph = '';

if (item.themeSpeaches && item.themeSpeaches[0] && item.themeSpeaches[0].themes) {
  item.themeSpeaches[0].themes.forEach(function (themeItem, index) {
    themeSpeechParagraph += "Antal: " + themeItem.count;

    // Check if there is a corresponding tType item
    if (item.tType && item.tType[index]) {
      themeSpeechParagraph += ", Typ: " + item.tType[index].title;
    }

    themeSpeechParagraph += "<br>";
  });
} else {
  themeSpeechParagraph = "None";
}

themeSpeechesCell.innerHTML = themeSpeechParagraph;
row.appendChild(themeSpeechesCell);


// Append the row to the table body
tableBody.appendChild(row);

    // After data is fetched, hide loading animation and show the table
    document.getElementById("attendanceTable").style.display = "table";
    document.getElementById("loading").style.display = "none";


      });

    } catch (error) {
      // Handle any errors that occurred during the fetch request
      console.error('Error:', error);
    }
  
}




  persons();

export default persons;