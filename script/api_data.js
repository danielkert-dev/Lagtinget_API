let attendanceChartInstance = null;
let themeSpeechChartInstance = null;

async function displayMoreData(id, name, image, dash) {
  const dataContainer = document.getElementById("dataContainer");
  dataContainer.classList.add("blur-container");
  const headers = new Headers();
  headers.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );

  // Fetch additional data based on the provided ID
  const link = `https://api.lagtinget.ax/api/persons/${id}/attendance.json`;
  const linkThemeSpeach = `https://api.lagtinget.ax/api/persons/${id}/theme_speeches.json`;
  const linkAType = "https://api.lagtinget.ax/api/presence_states.json";
  const linkTType = "https://api.lagtinget.ax/api/themes.json";

  try {
    const [
      attendanceResponse,
      themeSpeechResponse,
      aTypeResponse,
      tTypeResponse,
    ] = await Promise.all([
      fetch(link, { headers }),
      fetch(linkThemeSpeach, { headers }),
      fetch(linkAType, { headers }),
      fetch(linkTType, { headers }),
    ]);

    const aTypeData = await aTypeResponse.json();
    const tTypeData = await tTypeResponse.json();
    const attendanceData = await attendanceResponse.json();
    const themeSpeechData = await themeSpeechResponse.json();

    // Check if the data is available and has the expected structure
    if (attendanceData[0] && attendanceData[0].attendance) {
      // Combine attendance and A-Type data
      const combinedAttendanceA = attendanceData[0].attendance.map((item) => ({
        group: "Närvaro",
        count: item.count,
        title:
          aTypeData.find((aType) => aType.id === item.type)?.title || "Unknown",
      }));

      // Combine theme speech data with T-Type data
      const combinedThemeSpeechT = themeSpeechData[0].themes.map((item) => ({
        group: "Ämne",
        count: item.count,
        title:
          tTypeData.find((tType) => tType.id === item.theme)?.title ||
          "Unknown",
      }));

      csvData = [];
      csvData1 = [];
      // Concatenate the attendance and theme speech data
      csvData = combinedThemeSpeechT;
      csvData1 = combinedAttendanceA;

      // Calculate totalAttendance and totalThemeSpeech based on the data
      const totalAttendance = combinedAttendanceA.reduce(
        (acc, item) => acc + parseFloat(item.count),
        0
      );
      const totalThemeSpeech = combinedThemeSpeechT.reduce(
        (acc, item) => acc + parseFloat(item.count),
        0
      );

      // Calculate the percentage for each item
      combinedAttendanceA.forEach((item) => {
        item.percentage = ((item.count / totalAttendance) * 100).toFixed(1);
      });

      combinedThemeSpeechT.forEach((item) => {
        item.percentage = ((item.count / totalThemeSpeech) * 100).toFixed(1);
      });

      populateTable("themeTable", combinedThemeSpeechT);
      populateTable("attendanceTable", combinedAttendanceA);

      // With this line
      renderGoogleChart("attendanceChart", combinedAttendanceA, "Närvaro", "s");
      renderGoogleChart("themeChart", combinedThemeSpeechT, "Ämne", "s");

      title.innerHTML = `
        <h1>LEDARMÖTE LISTA</h1>
        <button class="btn btn-sm btn-success mx-3 my-1" id="allexcel">Ledarmöte .csv fil</button>
`;

      dataContainer.innerHTML = `
          <div class="row d-flex justify-content-center">
            <div class="col-sm-3">
            <h3 class="p-3">${name}</h3>
            <div class="row">
            <div class="col-md-12">
            <a href="https://www.lagtinget.ax/ledamoter/${dash}-${id}" class="mx-3 my-1 btn btn-primary btn-sm">Länk till person</a><br>
            </div>
            <div class="col-md-12">
            <button class="btn btn-sm btn-success mx-3 my-1" id="excel">Individ .csv fil</button>
            </div>
            </div>
            </div>
            <img src="${image}" width="200" alt="${name}"  unselectable="on" class="m-3 img-fluid rounded shadow">
          <div>
        `;
      setTimeout(() => {
        dataContainer.classList.remove("blur-container");
      }, 0);

      const downloadButton = document.getElementById("excel");
      downloadButton.className = "btn btn-sm btn-success mx-3 my-1";
      downloadButton.addEventListener("click", () => downloadCSV(name)); // Wrap the function call in an arrow function
      document.querySelector(".col-sm-3").appendChild(downloadButton);

      const allexcelButton = document.getElementById("allexcel");
      allexcelButton.addEventListener("click", () => downloadAllCSV(name)); // Wrap the function call in an arrow function
    } else {
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("nameButton")) {
    const id = event.target.getAttribute("data-id");
    const name = event.target.getAttribute("data-name");
    const image = event.target.getAttribute("data-image");
    const dash = event.target.getAttribute("data-dash");

    displayMoreData(id, name, image, dash);
  }
});
