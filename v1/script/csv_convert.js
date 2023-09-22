
let csvData = [];
let csvData1 = [];

function convertToCSV(data, data1, name) {
    // const header = `Typ;Antal;Titel;%`;
    // const rows = data.map(row => Object.values(row).join(';')).join('\n');
    // return `${name}\n${header}\n${rows}`; //;${fixImage}

    const title = data.map(title => Object.values(title.title)).join(';');
    const titleR = title.replace(/,/g, '');
    const values = data.map(values => Object.values(values.count)).join(';');
    const valuesR = values.replace(/,/g, '');

    const title1 = data1.map(title => Object.values(title.title)).join(';');
    const titleR1 = title1.replace(/,/g, '');
    const values1 = data1.map(values => Object.values(values.count)).join(';');
    const valuesR1 = values1.replace(/,/g, '');

    const titleLength = data.length - 1;
    const titleSpace = ';'.repeat(Math.max(0, titleLength ));

    values.replace(',', '');
    return `Name;Ämne${titleSpace};Närvaro;\n;${titleR}${titleR1};\n${name};${valuesR};${valuesR1}`;
  }
  
function downloadCSV(name) {
    const csvContent = convertToCSV(csvData, csvData1, name);
    const blob = new Blob(["\uFEFF"+csvContent], { type: 'text/csv;charset=utf-8,' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ledarmöte ${name}.csv`; // Specify the filename
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }


  function convertAllToCSV(data) {
    const csvStrings = [];

    const titlesAmne = data[0].tType.map(titleData => titleData.title);
    const titlesAmneLength = data[0].tType.length;
    const titleAmneSpace = ';'.repeat(Math.max(0, titlesAmneLength - 2));
    const titlesNärvaro = data[0].aType.map(titleData => titleData.title);
    const titlesNärvaroLength = data[0].aType.length;

    const headerRow = `Name;;Ämne${titleAmneSpace};;Närvaro\n`;
    csvStrings.push(headerRow);

    const dataRow = `;;${titlesAmne.join(';')};${titlesNärvaro.join(';')}\n`;
    csvStrings.push(dataRow);

    data.forEach(person => {
      const amneValuesA = []; // List for aType
      const amneValuesT = []; // List for tType
      const name = person.name;
      
      // Create a map of attendance types for faster lookup
      const attendanceMap = new Map(person.attendance.map(item => [item.type, item.count]));
  
      // Create a map of themeSpeaches types for faster lookup
      const themeSpeachesMap = new Map(person.themeSpeaches.map(item => [item.theme, item.count]));
  
      person.aType.forEach(type => {
          const attendanceCount = attendanceMap.get(type.id);
          amneValuesA.push(attendanceCount !== undefined ? attendanceCount : null);
          //amneValuesT.push(null); // Add null for tType
      });
  
      person.tType.forEach(type => {
          const themeSpeachesCount = themeSpeachesMap.get(type.id);
          amneValuesT.push(themeSpeachesCount !== undefined ? themeSpeachesCount : null);
          //amneValuesA.push(null); // Add null for aType
      });
  
      const amneRow = `${name};;${amneValuesT.join(';')}${amneValuesA.join(';')}\n`;
      csvStrings.push(amneRow);
  });
  
    return csvStrings.join('');
}


  async function downloadAllCSV(){
    const data = await allData();
    const csvContent = convertAllToCSV(data);
    const blob = new Blob(["\uFEFF"+csvContent], { type: 'text/csv;charset=utf-8,' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ledarmöte.csv`; // Specify the filename
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }