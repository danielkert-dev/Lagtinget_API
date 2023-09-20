// your-module-file.js
const link = "https://api.lagtinget.ax/api/persons.json?state=1"; // Tar alla med istället

const headers = new Headers();
headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

let persons = [];

async function fetchPersons() {
  try {
    const response = await fetch(link, { headers });
    const data = await response.json();
    persons = data;
    return persons;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Propagate the error to the caller
  }
}



export default fetchPersons;