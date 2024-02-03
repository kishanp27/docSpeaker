"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


type Props = {};

const FileUpload = (props: Props) => {
  const [uploading, setUploading] = useState(false);

  const router = useRouter();


  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
      file_url,
    }: {
      file_key: string;
      file_name: string;
      file_url: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
        file_url
      });

      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => handlePdfSubmit(acceptedFiles),
  });

  const { startUpload } = useUploadThing("pdfUploader");

  async function handlePdfSubmit(files: any[]) {
    const pdfFile = files[0];
    if (pdfFile.size > 8 * 1024 * 1024) {
      toast.error("File size limit(8MB) exceeded!");
      return;
    }

    try {
      setUploading(true);
      const res = await startUpload(files);
      if (res) {
        const data = {
          file_key: res[0].key,
          file_name: res[0].name,
          file_url: res[0].url
        };

        mutate(data, {
          onSuccess: ({chat_id}) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            console.log(err);
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-10",
        })}
      >
        <input {...getInputProps()} />

        {uploading || isPending ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-400 animate-spin"/>
            <p className=" text-gray-400"> Spilling tea to GPT...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Inbox className="w-10 h-10 text-blue-300" />
            <p className=" text-gray-400">Drop your PDF here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
