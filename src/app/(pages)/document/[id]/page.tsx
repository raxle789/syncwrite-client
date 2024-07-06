"use client";
import TextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { TiHome } from "react-icons/ti";

const DocumentPage = () => {
  return (
    <>
      <header className="editor-header flex items-center justify-between px-3 py-2">
        <div className="flex items-center justify-start">
          <Button variant="ghost" className="py-[1.55rem] rounded-full">
            <TiHome style={{ fontSize: "1.25rem" }} />
          </Button>
          <Input />
        </div>
        <div>
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <TextEditor />
    </>
  );
};

export default DocumentPage;
