google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(renderGoogleChart);

// Function to render Google Pie Chart
function renderGoogleChart(chartId, data, chartTitle, legendTitle) {
  if (!data || !Array.isArray(data)) {
    return; // Exit the function if data is undefined or not an array
  }

  // Convert data to Google DataTable format
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Title");
  dataTable.addColumn("number", "Count");
  data.forEach((item) => {
    dataTable.addRow([item.title, parseFloat(item.count)]);
  });

  // Define chart options with a colorblind-friendly palette
  var options = {
    title: chartTitle,
    legend: "bottom", // Adjust legend position as needed
    pieSliceText: "percentage",
    width: 400,
    height: 300,
    colors: [
      "#dddddd",
      "#2e2585",
      "#337538",
      "#5da899",
      "#94cbec",
      "#dccd7d",
      "#c26a77",
      "#9f4a96",
      "#7e2954",
      "#000000",
      "#f0e442",
    ],
  };

  // Create and draw the chart
  var chart = new google.visualization.PieChart(
    document.getElementById(chartId)
  );
  chart.draw(dataTable, options);
}
