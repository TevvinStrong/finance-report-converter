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

  // Log the contents of the file
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  console.log("Uploaded File Contents:", jsonData);

  const headers = jsonData[0];
  const filteredHeaders = headers.filter(
    (header) => header && !columnsToRemove.includes(header.toLowerCase())
  );
  const filteredData = jsonData.map((row) =>
    row.filter(
      (_, index) =>
        headers[index] &&
        !columnsToRemove.includes(headers[index].toLowerCase())
    )
  );

  const newWorksheet = xlsx.utils.aoa_to_sheet([
    filteredHeaders,
    ...filteredData.slice(1),
  ]);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

  const outputPath = path.join(
    __dirname,
    "uploads",
    `filtered_${file.originalname}`
  );

  // Ensure the uploads directory exists
  if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
  }

  xlsx.writeFile(newWorkbook, outputPath);

  res.download(outputPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error downloading the file.");
    }

    fs.unlinkSync(file.path);
    fs.unlinkSync(outputPath);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
