import fs from "fs";

export default function Parser(filePath) {
  //  Read the raw file
  const rawData = fs.readFileSync(filePath, "utf8");


  //  Split file into lines and strip out  hidden '\r' characters
  const lines = rawData.split(/\r?\n/);

  //  get column name
  const columnsNames = lines[0].split(",").map(col => col.trim()); //using .trim() to remove any leading and trailing spaces

  //Loop through data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); //Split by comma ONLY if the comma is outside of quotation marks

    const rowValues = values.map(val => {
      if (!val) return null;
      // Trim spaces and remove quotes from start orend of the text
      let cleanVal = val.trim().replace(/^["']|["']$/g, "");
      // Clean any escaped  quotes if they exist
      cleanVal = cleanVal.replace(/\\"/g, "");
      return cleanVal || null;
    });
    rows.push(rowValues);
  }
  return { rows, columnsNames };
}

