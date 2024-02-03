import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const getPdfUrl = (file_key: string) => {
    return utapi.getFileUrls(file_key)
}