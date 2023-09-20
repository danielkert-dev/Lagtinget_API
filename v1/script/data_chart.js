google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(renderGoogleChart);

// Function to render Google Pie Chart
function renderGoogleChart(chartId, data, chartTitle, legendTitle) {


    // Convert data to Google DataTable format
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Title');
    dataTable.addColumn('number', 'Count');
    data.forEach(item => {
      dataTable.addRow([item.title, parseFloat(item.count)]);
    });
  
    // Define chart options
    var options = {
      'title': chartTitle,
      'legend': 'bottom', // Adjust legend position as needed
      'pieSliceText': 'percentage',
      'width':400,
      'height':300
    };
  
    // Create and draw the chart
    var chart = new google.visualization.PieChart(document.getElementById(chartId));
    console.log(chart)
    chart.draw(dataTable, options);
  }
  
 
 // // Function to generate random background colors
    // function generateRandomColors(count) {
    //     const colors = [];
    //     for (let i = 0; i < count; i++) {
    //       const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
    //       colors.push(randomColor);
    //     }
    //     return colors;
    //   }
      
      
      
      
    //   function renderChart(chartId, data, backgroundColors, chartTitle, legendTitle) {
    //     const ctx = document.getElementById(chartId).getContext('2d');
      
    //     const numericData = data.map(item => parseFloat(item.count));
      
    //     return new Chart(ctx, {
    //       type: 'pie',
    //       data: {
    //         labels: data.map(item => item.title),
    //         datasets: [{
    //           data: numericData,
    //           backgroundColor: backgroundColors,
    //         }],
    //       },
    //       options: {
    //         responsive: false,
    //         maintainAspectRatio: true,
    //         tooltips: {
    //           enabled: true,
    //         },
    //         plugins: {
    //           title: {
    //           display: true,
    //           text: chartTitle,
    //         },
    //           legend: {
    //             display: false,
    //             position: 'bottom',
    //             title: {
    //               display: true,
    //               text: legendTitle, // Add the legend title here
    //               padding: {
    //                       top: 0,
    //                       bottom: 0
    //                   }
    //             },
    //             labels: {
    //               generateLabels: function(chart) {
    //                 const dataset = chart.data.datasets[0];
    //                 const total = dataset.data.reduce((acc, count) => acc + count, 0);
      
    //                 return dataset.data.map((count, index) => {
    //                   const percentage = ((count / total) * 100).toFixed(1);
    //                   return {
    //                     text: `${data[index].title}: ${count} (${percentage}%)`,
    //                     fillStyle: dataset.backgroundColor[index],
    //                   };
    //                 });
    //               },
    //             },
    //           },
    //         },
    //         scales: {
    //           x: {
    //             display: false,
    //           },
    //           y: {
    //             display: false,
    //           },
    //         },
    //       },
    //     });
    //   }
      
      
      
      
    //       // Function to destroy a chart instance
    //       function destroyChart(chartInstance) {
    //         if (chartInstance) {
    //           chartInstance.destroy();
    //         }
    //       }