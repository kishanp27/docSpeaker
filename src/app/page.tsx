import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import Link from "next/link";
// import SignIn from "@/components/ui/modal/SignIn";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  let element;

  if (isAuth) {
    if (firstChat) {
      element = (
        <Link href={`/chat/${firstChat.id}`}>
          <Button>Go to your chats &rarr;</Button>
        </Link>
      );
    } else {
      element = (
        <p className="underline text-rose-300 font-medium">
          Upload a pdf document to get started
        </p>
      );
    }
  } else {
    element = (
      <Link href={"/sign-in"}>
        <Button>Get Started &rarr;</Button>
      </Link>
    );
  }

  return (
    <div
      className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100
    "
    >
      <div className="w-full top-0 h-contain py-3 px-5">
        <div className={`mx-auto flex ${isAuth ? "justify-between": "justify-center"} max-w-5xl`}>
          <Link
            href={"/"}
            className="bg-white text-rose-00 font-bold p-2 rounded-full shadow-lg hover:cursor-pointer"
          >
            docSpeaker.
          </Link>
          {isAuth && <UserButton afterSignOutUrl="/"/>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-20">
        <div className="text-center max-w-6xl flex items-center flex-col gap-6">
          <h1 className="text-5xl mt-20 font-bold text-slate-800">
            Chat with your <span className="text-rose-500">PDF Documents</span>{" "}
            in seconds.
          </h1>
          {element}

          {/* <SignIn /> */}
          <p className="max-w-3xl font-medium">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research papers with the
            help of AI
          </p>
        </div>

        {isAuth && (
          <div className="w-4/5">
            <FileUpload />
          </div>
        )}
      </div>
    </div>
  );
}
