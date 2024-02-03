import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { downloadFromUploadthing } from "./pdf-download";
import {
  // Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
// import md5 from "md5";
// import { convertToAscii } from "./utils";
// import { getEmbeddings } from "./embeddings";
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from "@langchain/pinecone";
const pinecone = new Pinecone();

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadPdfIntoPinecone(file_key: string) {
  const path_name = await downloadFromUploadthing(file_key);

  const loader = new PDFLoader(path_name!);

  const docs = await loader.load();


  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(docs)
  // const docs = (await loader.load()) as PDFPage[];

  const pineconeIndex = pinecone.index('chatpdf');

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  // await Promise.all(splitDocs.map(docs => PineconeStore.fromDocuments(
  //   // @ts-ignore
  //   docs,
  //   embeddings,
  //   {
  //     pineconeIndex,
  //     namespace: file_key
  //   }
  // )))

  await PineconeStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      pineconeIndex,
      namespace: file_key,
    }
  )

  return;

  //2. Split and segment the pdf into smaller documents

  // const documents = await Promise.all(pages.map(prepareDocument));


  // // 3. vectorise and embed individual documents
  // const records = await Promise.all(documents.flat().map(embedDocument));

  // await pc.createIndex({
  //   name: 'sample-index',
  //   dimension: 1536,
  //   spec: {
  //     serverless: {
  //       cloud: 'aws',
  //       region: 'us-west-2',
  //     },
  //   },
  // });

  // // 4. upload to pinecone
  // const index = pc.index("chatpdf");
  
  // if(records){
  //   index.upsert(records);
  // }
  
  // return;
}

// async function embedDocument(doc: Document) {
//     try {
//       const embeddings = await getEmbeddings(doc.pageContent);
//       const hash = md5(doc.pageContent);
  
//       return {
//         id: hash,
//         values: embeddings,
//         metadata: {
//           text: doc.metadata.text,
//           pageNumber: doc.metadata.pageNumber,
//         },
//       } as PineconeRecord;
//     } catch (error) {
//       console.log("error embedding document", error);
//       throw error;
//     }
//   }

// const truncateStringByBytes = (str: string, bytes: number) => {
//     const enc = new TextEncoder();
//     return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
//   };
  
// async function prepareDocument(page: PDFPage) {
//   let { pageContent, metadata } = page;
//   pageContent = pageContent.replace(/\n/g, "");
//   // split the docs
//   const splitter = new RecursiveCharacterTextSplitter();
//   const docs = await splitter.splitDocuments([
//     new Document({
//       pageContent,
//       metadata: {
//         pageNumber: metadata.loc.pageNumber,
//         text: truncateStringByBytes(pageContent, 36000),
//       },
//     }),
//   ]);
//   return docs;
// }
