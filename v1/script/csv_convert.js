
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
    console.log(titleLength);
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

    const titlesAmne = data[0].tType.map(titleData => titleData.title).join(';');
    const titlesAmneLength = data[0].tType.length;
    const titleAmneSpace = ';'.repeat(Math.max(0, titlesAmneLength - 2 ));
    const titlesNärvaro = data[0].aType.map(titleData => titleData.title).join(';');

    const headerRow = `Name;Ämne;${titleAmneSpace};Närvaro\n`;
    csvStrings.push(headerRow);

    const dataRow = `;${titlesAmne};${titlesNärvaro}\n`;
    csvStrings.push(dataRow);

    data.forEach(person => {
        const name = person.name;

        const amneCounts = person.attendance.map(amne => amne.count).join(';');
        const themeCounts = person.themeSpeaches.map(theme => theme.count).join(';');

        const row = `${name};${amneCounts};${themeCounts}\n`;
        csvStrings.push(row);
    });

    return csvStrings;
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