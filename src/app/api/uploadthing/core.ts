import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth as currentUser } from "@clerk/nextjs";
 
const f = createUploadthing();
 
const auth = (req: Request) => ({ id: "fakeId" }); 
export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "8MB" } })
    .middleware(async ({ req }) => {
      const {userId} = await currentUser();
 
      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId};
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;