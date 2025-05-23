import RNFS from "react-native-fs";
import xml2js from "react-native-xml2js";
import { unzip } from "react-native-zip-archive";

export default async function docxToString(docxPath) {
  console.log("converter", docxPath);
  const unzipPath = docxPath.replace(".docx", "_unzipped");
  await unzip(docxPath, unzipPath);

  const documentXml = await RNFS.readFile(
    `${unzipPath}/word/document.xml`,
    "utf8"
  );

  const parser = new xml2js.Parser();
  const xml = await parser.parseStringPromise(documentXml);

  const paragraphs = xml["w:document"]["w:body"][0]["w:p"];

  const text = paragraphs
    .map((p) => {
      const runs = p["w:r"] || [];
      return runs.map((r) => (r["w:t"] ? r["w:t"][0] : "")).join("");
    })
    .join("\n");
  console.log(paragraphs);
  return text;
}
