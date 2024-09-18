"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
// import TextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TiHome } from "react-icons/ti";
import { Link } from "lucide-react";
import { SatelliteDish } from "lucide-react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getUserDataFromCookies } from "@/utils/authentication";
import { takeScreenshot } from "@/utils/preview-doc";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { getCollaborators } from "@/utils/collaboration";
import html2canvas from "html2canvas";

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
  const [windowWidth, setWindowWidth] = useState(0);

  // functions
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

  // Function to save screenshot to database
  const takeDocScreenshot = async (docId: string, image: string) => {
    try {
      const result = await takeScreenshot(docId, image);
      console.log("result: ", result);
    } catch (error) {
      console.error("Error saving thumbnail result: ", error);
    }
  };

  // Function to take a screenshot of Quill editor and convert it to canvas
  const captureQuillToCanvas = async () => {
    if (!quill) return;

    // Get the quill editor DOM element
    const quillElement: any = document.querySelector(".ql-editor");

    if (quillElement) {
      try {
        // Use html2canvas to capture the content of the quill editor
        const canvas = await html2canvas(quillElement, {
          scale: 2, // Optional: increases image resolution
          useCORS: true, // If you're loading images from external sources
          backgroundColor: null, // Ensures transparent background if needed
        });

        // Convert the canvas to data URL (base64) or image for further use
        const imgDataUrl = canvas.toDataURL("image/png");
        console.log(imgDataUrl); // This is the base64 image URL
        takeDocScreenshot(documentId!, imgDataUrl);

        // Optionally, you can render the image on the page, upload it, or save it
        // document.querySelector("#thumbnail").src = imgDataUrl; // Example of rendering the thumbnail
      } catch (error) {
        console.error("Error capturing Quill content to canvas:", error);
      }
    }
  };

  // const takePreviewDocImage = async (url: string) => {
  //   try {
  //     const result = await takePreviewDoc(url);
  //     console.log("result: ", result);
  //   } catch (error) {
  //     console.error("Error fetching user data: ", error);
  //   }
  // };

  // Function to get collaborator list right now
  const getCollaboratorList = async (list: TSocketUser[]) => {
    try {
      const result = await getCollaborators(list);
      console.log("result: ", result);
      setCollaborators(result);
    } catch (error) {
      console.error("Error collaborators result: ", error);
    }
  };

  // Function to show and hide toolbar based on user's condition
  function updateToolbar(signedState: boolean) {
    if (quill) {
      const toolbarModule = quill.getModule("toolbar");
      if (signedState && windowWidth > 900) {
        toolbarModule.options = TOOLBAR_OPTIONS;
        toolbarModule.container.style.display = ""; // Show toolbar
      } else {
        toolbarModule.options = false;
        toolbarModule.container.style.display = "none"; // Hide toolbar
      }
    }
  }

  // Function to get initial user
  const getInitials = (fullName: string) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length < 2) return "SW";
    const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    return initials.toUpperCase();
  };

  // useEffect
  // Handle user's joining, disconnecting, and sync collaborator list
  useEffect(() => {
    // const s: Socket = io("http://localhost:3000/api/socket", {
    //   transports: ["websocket"], // Ini akan mencoba langsung menggunakan WebSocket
    // });
    const url = process.env.NEXT_PUBLIC_SERVER_ROUTE;
    const s: Socket = io(url!);
    // const socket = io("https://your-server-domain.com", {
    //   transports: ["websocket"],
    //   withCredentials: true,
    // });

    const user = getUserDataFromCookies();
    if (user) {
      s.emit("join", user.uid, documentId);
    } else {
      s.emit("join", "anonim", documentId);
    }

    s.on("users", (users) => {
      // console.log("Users: ", users);
      setUsers(users);
    });

    s.on("user-joined", (user) => {
      // console.log("User joined: ", user);
      setUsers((prevUsers: any) => [...prevUsers, user]);
    });

    s.on("user-left", (socketId) => {
      // console.log("User left: ", socketId);
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

  // Update collaborator list
  useEffect(() => {
    console.log("users now: ", users);
    getCollaboratorList(users);
  }, [users]);

  // Show collaborator list on console
  useEffect(() => {
    console.log("collaborators now: ", collaborators);
  }, [collaborators]);

  // Load document and save thumbnail
  useEffect(() => {
    if (socket == null || quill == null) return;

    const user = getUserDataFromCookies();
    socket.once("load-document", (document) => {
      quill.setContents(document.data);
      setFileName(document.fileName);

      if (user && windowWidth > 900) {
        quill.enable();
      } else {
        quill.disable();
      }

      captureQuillToCanvas();
    });

    if (user) {
      socket.emit("get-document", user.uid, documentId);
    } else {
      socket.emit("get-document", "anonim", documentId);
    }
  }, [socket, quill, documentId]);

  // Save document changes
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

  // Receive changes and emit to every user in the room
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

  // Send changes to every user
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

  // Create Quill container
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
  //   if (quill && quill.getContents().ops.length > 0) {
  //     captureQuillToCanvas();
  //   }
  // }, [quill]);

  // Update toolbar based on signedState
  useEffect(() => {
    updateToolbar(hasSigned);
    const user = getUserDataFromCookies();
    if (quill) {
      if (user && windowWidth > 900) {
        quill.enable();
      } else {
        quill.disable();
      }
    }
  }, [hasSigned, quill, windowWidth]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle decision if the user is loged or not
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
            onClick={() => router.replace("/my-documents")}
          >
            <TiHome style={{ fontSize: "1.75rem" }} />
          </Button>
          <p className="name-container ml-3 mr-3 max-w-[150px] md:max-w-[250px] whitespace-nowrap overflow-x-auto">
            {fileName}
          </p>
          {hasSigned && windowWidth >= 900 && (
            <Badge>{saveState ? "Saved" : "Not saved"}</Badge>
          )}
          {(!hasSigned || (windowWidth >= 460 && windowWidth < 900)) && (
            <Badge>Read only</Badge>
          )}
          {hasSigned && windowWidth >= 900 && (
            <span className="text-xs ml-3">
              Any changes will save every 2 seconds
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
                      <Avatar className="mr-3 hover:cursor-pointer hidden sm:block">
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
                  className="rounded-full mr-3 hidden sm:block"
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
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>{windowWidth < 640 ? "Others" : "Share"}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {windowWidth < 460 && (
                  <DropdownMenuLabel>
                    <Badge>Read only</Badge>
                  </DropdownMenuLabel>
                )}
                {windowWidth >= 460 && (
                  <DropdownMenuLabel>Anyone can edit</DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                {windowWidth < 640 && (
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <SatelliteDish className="mr-2" size={16} />
                      View online
                    </DropdownMenuItem>
                  </DialogTrigger>
                )}
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={handleCopyLink}
                >
                  <Link className="mr-2" size={14} />
                  Copy link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="rounded-lg w-[90%]">
              <DialogHeader className="text-left">
                <DialogTitle>Online users</DialogTitle>
                <DialogDescription className="pt-4">
                  {collaborators &&
                    collaborators.map(
                      (collaborator: TCollaborator, index: number) => (
                        <div key={index} className="flex items-center mb-3">
                          <Avatar className="mr-5">
                            <AvatarImage
                              className="object-cover"
                              src={collaborator.avatar}
                              alt="avatar-image"
                            />
                            <AvatarFallback>
                              {getInitials(collaborator.displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-base">
                            {collaborator.displayName}
                          </p>
                        </div>
                      )
                    )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="text-editor-container" ref={wrapperRef}></div>
    </div>
  );
};

export default EditorPage;
