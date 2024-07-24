"use client";
import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { takePreviewDoc } from "@/utils/preview-doc";
import { getUserDataFromCookies } from "@/utils/authentication";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  ["image", "blockquote", "code-block", "link", "formula"],
  ["clean"],
];

type Prop = {
  signedState: boolean;
};

const TextEditor: React.FC<Prop> = ({ signedState }) => {
  // states
  // const { id: documentId } = useParams();
  const pathname = usePathname();
  const documentId = pathname.split("/").pop();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  // functions
  const takePreviewDocImage = async (url: string) => {
    try {
      const result = await takePreviewDoc(url);
      console.log("result: ", result);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  function updateToolbar(signedState: boolean) {
    if (quill) {
      const toolbarModule = quill.getModule("toolbar");
      if (signedState) {
        toolbarModule.options = TOOLBAR_OPTIONS;
        toolbarModule.container.style.display = ""; // Show toolbar
      } else {
        toolbarModule.options = false;
        toolbarModule.container.style.display = "none"; // Hide toolbar
      }
    }
  }

  // useEffect
  useEffect(() => {
    const s: Socket = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      const user = getUserDataFromCookies();
      quill.setContents(document);
      // const targetUrl = `http://localhost:3000${pathname}`;
      // takePreviewDocImage(targetUrl);

      if (user) {
        quill.enable();
      }
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // useEffect(() => {
  //   if (socket == null || quill == null) return;

  //   const interval = setInterval(() => {
  //     const targetUrl = `http://localhost:3000${pathname}`;
  //     // takePreviewDocImage(targetUrl);
  //     console.log("pathname: ", pathname);
  //   }, 10000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [socket, quill]);

  // useEffect(() => {
  //   takePreviewDocImage(pathname);
  // }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any, oldDelta: any, source: string | any) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  // Update toolbar based on signedState
  useEffect(() => {
    updateToolbar(signedState);
  }, [signedState, quill]);

  return <div className="text-editor-container" ref={wrapperRef}></div>;
};

export default TextEditor;
