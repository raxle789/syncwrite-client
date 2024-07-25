"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
// import TextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TiHome } from "react-icons/ti";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getUserDataFromCookies } from "@/utils/authentication";
import { takePreviewDoc } from "@/utils/preview-doc";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { getCollaborators } from "@/utils/collaboration";

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

type TSocketUser = {
  userId: string;
  socketId: string;
};

type TCollaborator = {
  userId: string;
  displayName: string;
  avatar: string;
};

const EditorPage = () => {
  // states
  // const { id: documentId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const documentId = pathname.split("/").pop();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [saveState, setSaveState] = useState(true);
  const [users, setUsers] = useState<TSocketUser[]>([]);
  const [collaborators, setCollaborators] = useState<TCollaborator[]>([]);
  const [hasSigned, setHasSigned] = useState(false);
  const [fileName, setFileName] = useState("");
  const usersNow = [
    { name: "Abdullah Al Fatih", initials: "AF" },
    { name: "Abdullah Al Fatih", initials: "AF" },
    { name: "Abdullah Al Fatih", initials: "AF" },
  ];

  const handleCopyLink = () => {
    const url = window.location.origin + pathname;
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          description: "Link copied to clipboard!",
        });
      },
      (err) => {
        toast({
          description: `Could not copy text: , ${err}`,
        });
      }
    );
  };

  // functions
  const takePreviewDocImage = async (url: string) => {
    try {
      const result = await takePreviewDoc(url);
      console.log("result: ", result);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const getCollaboratorList = async (list: TSocketUser[]) => {
    try {
      const result = await getCollaborators(list);
      console.log("result: ", result);
      setCollaborators(result);
    } catch (error) {
      console.error("Error collaborators result: ", error);
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

  const getInitials = (fullName: string) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length < 2) return "SW";
    const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    return initials.toUpperCase();
  };

  const handleFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  // useEffect
  useEffect(() => {
    const s: Socket = io("http://localhost:3001");
    const user = getUserDataFromCookies();
    if (user) {
      s.emit("join", user.uid, documentId);
    }

    s.on("users", (users) => {
      console.log("Users: ", users);
      setUsers(users);
    });

    s.on("user-joined", (user) => {
      console.log("User joined: ", user);
      setUsers((prevUsers: any) => [...prevUsers, user]);
    });

    s.on("user-left", (socketId) => {
      console.log("User left: ", socketId);
      setUsers((prevUsers: any) =>
        prevUsers.filter((user: any) => user.socketId !== socketId)
      );
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [documentId]);

  // useEffect(() => {
  //   if (socket && socket.connected) {
  //     const user = getUserDataFromCookies();
  //     socket.emit("join", user.uid, documentId);
  //     console.log("join room");
  //   }
  //   if (socket && !socket.connected) {
  //     const user = getUserDataFromCookies();
  //     socket.emit("leave", user.uid, documentId);
  //     console.log("leave room");
  //   }
  // }, [socket]);
  // useEffect(() => {
  //   if (socket) {
  //     socket.on("disconnect", () => {
  //       const user = getUserDataFromCookies();
  //       socket.emit("leave", user.uid, documentId);
  //       console.log("leave room");
  //     });
  //   }
  // }, [socket]);

  useEffect(() => {
    console.log("users now: ", users);
    getCollaboratorList(users);
  }, [users]);

  useEffect(() => {
    console.log("collaborators now: ", collaborators);
  }, [collaborators]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const user = getUserDataFromCookies();
    socket.once("load-document", (document) => {
      // console.log(document);
      quill.setContents(document.data);
      setFileName(document.fileName);
      // setTimeout(() => {
      //   const targetUrl = `http://localhost:3000${pathname}`;
      //   takePreviewDocImage(targetUrl);
      // }, 3000);

      if (user) {
        quill.enable();
      }
    });
    // const targetUrl = `http://localhost:3000${pathname}`;
    // takePreviewDocImage(targetUrl);
    if (user) {
      socket.emit("get-document", user.uid, documentId);
    } else {
      socket.emit("get-document", "", documentId);
    }
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      setSaveState(true);
      // socket.emit("save-document", quill.getContents());
      socket.emit("save-document", quill.getContents(), (error: any) => {
        if (error) {
          setSaveState(false);
          toast({
            description: `"Error saving document:", ${error}`,
          });
        }
      });
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      // setSaveState(false);
    };
  }, [socket, quill]);

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

  // useEffect(() => {
  //   if (quill) {
  //     setTimeout(() => {
  //       const targetUrl = `http://localhost:3000${pathname}`;
  //       if (
  //         quill.getContents().ops.length > 1 ||
  //         quill.getContents().ops.length === 1
  //       ) {
  //         takePreviewDocImage(targetUrl);
  //       } else {
  //         console.log("Quill has no content.");
  //       }
  //     }, 5000);
  //   }
  // }, [quill]);

  // Update toolbar based on signedState
  useEffect(() => {
    updateToolbar(hasSigned);
  }, [hasSigned, quill]);

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (!user) {
      setHasSigned(false);
    } else {
      setHasSigned(true);
    }
  }, []);
  return (
    <div>
      <header
        className={`bg-coolGray sticky top-0 z-10 flex items-center justify-between px-3 py-2 ${
          hasSigned ? "" : "border-b border-solid border-border"
        }`}
      >
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            className="px-[0.7rem] py-[0.6rem] rounded-full w-11 h-11"
            size="icon"
          >
            <TiHome style={{ fontSize: "1.75rem" }} />
          </Button>
          <p className="ml-3 mr-3">{fileName}</p>
          {hasSigned && <Badge>{saveState ? "Saved" : "Not saved"}</Badge>}
          {!hasSigned && <Badge>Read only</Badge>}
          {hasSigned && (
            <span className="text-xs ml-3">
              Any changes will save every 2 seconds
            </span>
          )}
          {!hasSigned && (
            <span className="text-xs ml-3">
              Log in and use laptop to start collaborate
            </span>
          )}
        </div>

        <div className="flex items-center justify-end">
          {collaborators &&
            collaborators.map((collaborator: TCollaborator, index: number) =>
              index < 3 ? (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="mr-3 hover:cursor-pointer">
                        <AvatarImage
                          className="object-cover"
                          src={collaborator.avatar}
                          alt="avatar-image"
                        />
                        <AvatarFallback>
                          {getInitials(collaborator.displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{collaborator.displayName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null
            )}
          {collaborators && collaborators.length > 3 && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  className="rounded-full mr-3"
                  variant="ghost"
                  size="icon"
                >
                  {collaborators && collaborators.length - 3}+
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {collaborators &&
                    collaborators.map(
                      (collaborator: TCollaborator, index: number) =>
                        index > 2 ? (
                          <p key={index} className="font-normal">
                            {collaborator.displayName}
                          </p>
                        ) : null
                    )}
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button>Share</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Anyone can edit</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={handleCopyLink}
              >
                <Link className="mr-2" size={14} />
                Copy link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {/* hai */}
      {/* <TextEditor signedState={hasSigned} /> */}
      <div className="text-editor-container" ref={wrapperRef}></div>
    </div>
  );
};

export default EditorPage;
