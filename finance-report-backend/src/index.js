const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.post("/uploadExcel", upload.single("file"), (req, res) => {
  const file = req.file;
  const columnsToRemove = req.body.columnsToRemove
    .split(",")
    .map((col) => col.trim().toLowerCase())
    .filter((col) => col); // Remove empty strings

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const workbook = xlsx.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  console.log("Worksheet reference:", worksheet); // Debugging statement

  const range = xlsx.utils.decode_range(worksheet["!ref"]);
  console.log("range ", range);

  // Read headers
  const headers = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = xlsx.utils.encode_cell({ r: 0, c: C });
    const cell = worksheet[cellAddress];
    console.log(`Header cell at ${cellAddress}:`, cell); // Debugging statement
    if (cell && cell.t) headers.push(cell.v);
  }
  console.log("headers ", headers); // Debugging statement

  // Filter headers
  const filteredHeaders = headers.filter(
    (header) => header && !columnsToRemove.includes(header.toLowerCase())
  );
  console.log("filteredHeaders ", filteredHeaders);

  // Create a mapping of column indices to headers
  const headerIndexMap = headers.reduce((map, header, index) => {
    if (header && !columnsToRemove.includes(header.toLowerCase())) {
      map[index] = header;
    }
    return map;
  }, {});
  console.log("headerIndexMap ", headerIndexMap);

  // Filter data
  const filteredData = [];
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const row = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      if (headerIndexMap[C] !== undefined) {
        const cell = worksheet[xlsx.utils.encode_cell({ r: R, c: C })];
        row.push(cell ? cell.v : null);
      }
    }
    filteredData.push(row);
  }
  console.log("filteredData ", filteredData);

  // Create new worksheet with filtered data
  const newWorksheet = xlsx.utils.aoa_to_sheet([
    filteredHeaders,
    ...filteredData,
  ]);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

  const outputPath = path.join(
    __dirname,
    "uploads",
    `filtered_${file.originalname}`
  );

  // Ensure the directory exists
  if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
  }

  xlsx.writeFile(newWorkbook, outputPath);

  setTimeout(() => {
    res.download(outputPath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading the file.");
      }

      fs.unlinkSync(file.path);
      fs.unlinkSync(outputPath);
    });
  }, 2000); // 2 second delay
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
