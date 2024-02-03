import axios from "axios";
import { getPdfUrl } from "./server/uploadthing";
import fs from "fs";
import path from "path";
// import { Blob } from "buffer";
import os from "os";

export async function downloadFromUploadthing(file_key: string) {
  try {
    const fileUrl = await getPdfUrl(file_key);
    const pdfFile = await axios.get(fileUrl[0].url, {
      responseType: "arraybuffer",
    });
    const obj = pdfFile.data;

    const blob = new Blob([Buffer.from(obj)], { type: "application/pdf" });
    return blob;
    
  } catch (error) {
    console.log(error);
  }
}
