import axios from "axios";
import { getPdfUrl } from "./server/uploadthing";
import fs from "fs";
import path from "path";
import os from "os";

export async function downloadFromUploadthing(file_key: string) {
  try {
    const fileUrl = await getPdfUrl(file_key);
    const pdfFile = await axios.get(fileUrl[0].url, {
      responseType: "arraybuffer",
    });
    const obj = pdfFile.data;
    const downloadFolder = path.join(os.homedir(), "Downloads/tmp");

    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder);
    }
    const file_name = path.join(downloadFolder, `pdf-${Date.now()}.pdf`);

    fs.writeFileSync(file_name, Buffer.from(obj));
    return file_name;
  } catch (error) {
    console.log(error);
  }
}
