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
  }
  
  export default listPersons;
  