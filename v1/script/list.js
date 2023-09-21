function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
async function listPersons() {
    const headers = new Headers();
    headers.append(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    );
  
    let data; // Declare data variable in the outer scope
  
    const link = `https://api.lagtinget.ax/api/organizations/11/persons/${getFormattedDate()}.json`;
  
    try {
      const response = await fetch(link, { headers });
      data = await response.json(); // Assign the fetched data to the data variable
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  
    const personsList = [];
    for (let i = 0; i < data.length; i++) {
      const id = data[i].id;
      const person = data[i].name;
      const firstName = data[i].first_name;
      const lastName = data[i].last_name;
      if (person) {
        personsList.push({ id: id, name: person, image: data[i].image, first: firstName, last: lastName});
      } else {
        personsList.push({ id: id, name: 'Namn saknas' });
      }
    }
    // console.log('Persons List:', personsList);
  
    var container = document.getElementById('personContainer');
  
    for (let i = 0; i < personsList.length; i++) {
        const id = personsList[i].id;
        const person = personsList[i].name;
        const image = personsList[i].image;
        const first = personsList[i].first;
        const last = personsList[i].last;

        // Create a button element
        var nameButton = document.createElement('button');
        nameButton.textContent = person;
        nameButton.classList.add("nameButton", "btn", "btn-primary", "btn-sm", "btn-block");

        // Set a custom data-id attribute on the button
        nameButton.setAttribute('data-id', id);
        nameButton.setAttribute('data-name', person);
        nameButton.setAttribute('data-image', image);
        nameButton.setAttribute('data-dash', first + '-' + last)

        // Attach a click event listener to the button
        nameButton.addEventListener("click", displayMoreData);

        // Append the button to the container
        container.appendChild(nameButton);
    }

    document.getElementById("loading").style.display = "none";


    // Load first person
    setTimeout(() => {
      const firstNameButton = document.querySelector('.nameButton');
      console.log(firstNameButton);
      if (firstNameButton) {
          const id = firstNameButton.getAttribute("data-id");
          const name = firstNameButton.getAttribute("data-name");
          const image = firstNameButton.getAttribute("data-image");
          const dash = firstNameButton.getAttribute("data-dash");
    
          // Call the displayMoreData function with the data from the first button
          displayMoreData(id, name, image, dash);
  
      }
    
    },100)

  }


  listPersons();


  
async function allData() {
  const headers = new Headers();
  headers.append(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  );

  let personsData = [];
  let allData = [];

    try {
      const personsLink =`https://api.lagtinget.ax/api/organizations/11/persons/${getFormattedDate()}.json`;
      const response = await fetch(personsLink, { headers });
      personsData = await response.json(); // Reassign, using let instead of const
  

      for (let i = 0; i < personsData.length; i++) {
        const id = personsData[i].id;
        const link = `https://api.lagtinget.ax/api/persons/${id}/attendance.json`;
        const linkThemeSpeach = `https://api.lagtinget.ax/api/persons/${id}/theme_speeches.json`;
        const linkAType = "https://api.lagtinget.ax/api/presence_states.json";
        const linkTType = "https://api.lagtinget.ax/api/themes.json";
      
        const combinedAttendanceList = [];

        try {
          const response = await fetch(link, { headers });
          const attendanceData = await response.json();
      
          const responseAType = await fetch(linkAType, { headers });
          const aTypeDataItem = await responseAType.json(); // Use a different variable name
      
          const response2 = await fetch(linkThemeSpeach, { headers });
          const themeSpeechData = await response2.json();
      
          const responseTType = await fetch(linkTType, { headers });
          const tTypeDataItem = await responseTType.json(); // Use a different variable name
      

          for (let j = 0; j < aTypeDataItem.length; j++) {
            console.log(attendanceData[0].attendance[1].count);
          }
          
          const combinedData = {
            id: id,
            name: personsData[i].name,
            attendance: attendanceData[0].attendance,
            combinedAttendanceList: combinedAttendanceList,
            aType: aTypeDataItem, // You may want to filter this for the specific person
            themeSpeaches: themeSpeechData[0].themes,
            tType: tTypeDataItem, // You may want to filter this for the specific person
          };

          allData.push(combinedData);

        } catch (error) {
          console.error('Error:', error);
        }
      }


      console.log(allData);
      return allData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

allData();