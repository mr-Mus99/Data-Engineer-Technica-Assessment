import fs from "fs";
console.log("node js version", process.version);

export default function Parser(filePath) {
  // 1. Read the raw file
  const rawData = fs.readFileSync(filePath, "utf8");


  // 2. Split file into lines and strip out  hidden '\r' characters
  const lines = rawData.split(/\r?\n/);
  // 3. gets column name
  const columnsNames = lines[0].split(",").map(col => col.trim()); //using .trim() to remove any leading and trailing spaces

  // 4. Loop through the remaining data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); //Split by comma ONLY if the comma is outside of quotation marks

    const rowValues = values.map(val => {
      if (!val) return null;
      // Trim spaces and remove quotes from the start/end of the text
      let cleanVal = val.trim().replace(/^["']|["']$/g, "");
      // Clean up any escaped internal quotes if they exist
      cleanVal = cleanVal.replace(/\\"/g, "");
      return cleanVal || null;
    });
    rows.push(rowValues);
  }
  return { rows, columnsNames };
}

// (Parser("../accounts.csv"));