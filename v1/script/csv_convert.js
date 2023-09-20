
let csvData = [];

function convertToCSV(data, name, image) {
    //const fixImage = `=IMAGE("${image}")`;
    const header = `Typ;Antal;Titel`;
    const rows = data.map(row => Object.values(row).join(';')).join('\n');
    return `${name}\n${header}\n${rows}`; //;${fixImage}
  }
  
function downloadCSV(name, image) {
    const csvContent = convertToCSV(csvData, name, image);
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