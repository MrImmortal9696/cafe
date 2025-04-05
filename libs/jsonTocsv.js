export const convertJsonToCsv = (jsonData, fileName = "data.csv") => {
  if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
      console.error("Invalid JSON data provided.");
      return;
  }

  // Extract keys from the first object as CSV headers
  const headers = Object.keys(jsonData[0]);

  // Create CSV rows
  const rows = jsonData.map((item) =>
      headers.map((header) => {
          // Check if the data is an object and stringify it
          const cellData = item[header];
          if (cellData && typeof cellData === "object") {
              return `"${JSON.stringify(cellData)}"`; // Serialize JSON data as a string
          }
          return `"${cellData || ""}"`; // Use empty string for undefined or null data
      }).join(",")
  );

  // Combine headers and rows into a single CSV string
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Create a Blob object from the CSV string
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link to download the CSV file
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;

  // Trigger the download
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
};
