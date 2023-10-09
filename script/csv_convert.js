// Get data for csv
async function allData() {
  const headers = new Headers();
  headers.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );

  let personsData = [];
  let allData = [];

  try {
    const personsLink = `https://api.lagtinget.ax/api/organizations/11/persons/${getFormattedDate()}.json`;
    const response = await fetch(personsLink, { headers });
    personsData = await response.json(); // Reassign, using let instead of const

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
          attendance: attendanceData[0].attendance,
          aType: aTypeDataItem, // You may want to filter this for the specific person
          themeSpeaches: themeSpeechData[0].themes,
          tType: tTypeDataItem, // You may want to filter this for the specific person
        };

        allData.push(combinedData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    return allData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

allData();

let csvData = [];
let csvData1 = [];

// Individual csv
function convertToCSV(data, individual) {

  const csvStrings = [];

  const titlesAmne = data[0].tType.map((titleData) => titleData.title);
  const titlesAmneLength = data[0].tType.length;
  const titleAmneSpace = ";".repeat(Math.max(0, titlesAmneLength - 2));
  const titlesNärvaro = data[0].aType.map((titleData) => titleData.title);
  const titlesNärvaroLength = data[0].aType.length;

  const headerRow = `Namn;;Ämne${titleAmneSpace};;Närvaro\n`;
  csvStrings.push(headerRow);

  const dataRow = `;;${titlesAmne.join(";")};${titlesNärvaro.join(";")}\n`;
  csvStrings.push(dataRow);

  data.forEach((person) => {
    const amneValuesA = []; // List for aType
    const amneValuesT = []; // List for tType
    const name = person.name;

    if (individual === name){


    // Create a map of attendance types for faster lookup
    const attendanceMap = new Map(
      person.attendance.map((item) => [item.type, item.count])
    );

    // Create a map of themeSpeaches types for faster lookup
    const themeSpeachesMap = new Map(
      person.themeSpeaches.map((item) => [item.theme, item.count])
    );

    person.aType.forEach((type) => {
      const attendanceCount = attendanceMap.get(type.id);
      amneValuesA.push(attendanceCount !== undefined ? attendanceCount : null);
      //amneValuesT.push(null); // Add null for tType
    });

    person.tType.forEach((type) => {
      const themeSpeachesCount = themeSpeachesMap.get(type.id);
      amneValuesT.push(
        themeSpeachesCount !== undefined ? themeSpeachesCount : null
      );
      //amneValuesA.push(null); // Add null for aType
    });

    const amneRow = `${name};;${amneValuesT.join(";")};${amneValuesA.join(
      ";"
    )}\n`;
    csvStrings.push(amneRow);
  }
  });

  return csvStrings.join("");
}

async function downloadCSV(name) {
  const data = await allData();

  const csvContent = convertToCSV(data, name);
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8,",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Ledarmöte ${name}.csv`; // Specify the filename
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

// All csv
function convertAllToCSV(data) {
  const csvStrings = [];

  const titlesAmne = data[0].tType.map((titleData) => titleData.title);
  const titlesAmneLength = data[0].tType.length;
  const titleAmneSpace = ";".repeat(Math.max(0, titlesAmneLength - 2));
  const titlesNärvaro = data[0].aType.map((titleData) => titleData.title);
  const titlesNärvaroLength = data[0].aType.length;

  const headerRow = `Namn;;Ämne${titleAmneSpace};;Närvaro\n`;
  csvStrings.push(headerRow);

  const dataRow = `;;${titlesAmne.join(";")};${titlesNärvaro.join(";")}\n`;
  csvStrings.push(dataRow);

  data.forEach((person) => {
    const amneValuesA = []; // List for aType
    const amneValuesT = []; // List for tType
    const name = person.name;

    // Create a map of attendance types for faster lookup
    const attendanceMap = new Map(
      person.attendance.map((item) => [item.type, item.count])
    );

    // Create a map of themeSpeaches types for faster lookup
    const themeSpeachesMap = new Map(
      person.themeSpeaches.map((item) => [item.theme, item.count])
    );

    person.aType.forEach((type) => {
      const attendanceCount = attendanceMap.get(type.id);
      amneValuesA.push(attendanceCount !== undefined ? attendanceCount : null);
      //amneValuesT.push(null); // Add null for tType
    });

    person.tType.forEach((type) => {
      const themeSpeachesCount = themeSpeachesMap.get(type.id);
      amneValuesT.push(
        themeSpeachesCount !== undefined ? themeSpeachesCount : null
      );
      //amneValuesA.push(null); // Add null for aType
    });

    const amneRow = `${name};;${amneValuesT.join(";")};${amneValuesA.join(
      ";"
    )}\n`;
    csvStrings.push(amneRow);
  });

  return csvStrings.join("");
}

async function downloadAllCSV() {
  const data = await allData();
  const csvContent = convertAllToCSV(data);
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8,",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Ledarmöte.csv`; // Specify the filename
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}
