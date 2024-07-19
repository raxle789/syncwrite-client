"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import SyncWriteLogo from "../../../../public/assets/logo/SyncWriteLogo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { Plus } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { FileType } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { signOutUser } from "@/utils/firebase/firebase.util";
import Cookies from "js-cookie";
import { getUserDataFromCookies } from "@/utils/authentication";
import {
  getOrCreateUser,
  updateProfileUser,
  getOrCreateDocList,
  updateDocList,
  deleteDoc,
} from "@/utils/user";
import { v4 as uuidv4 } from "uuid";

const FormSchema = z.object({
  fullname: z.string().min(2, {
    message: "Fullname must be at least 2 characters.",
  }),
  avatar: z
    .any()
    .refine(
      (file) => {
        if (!file) return true; // allow empty file input
        return file.size <= 500 * 1024; // file size limit 500KB
      },
      { message: "File size should be less than 500KB" }
    )
    .optional(),
  email: z.string().min(2, {
    message: "Email cannot be changed.",
  }),
});

type TUserData = {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
  avatar?: string | null;
};

type TDocItem = {
  docId: String;
  fileName: String;
  thumbnail: String;
  openedDate: Date;
};

const DocumentListPage = () => {
  // state
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editState, setEditState] = useState(false);
  const [fileAction, setFileAction] = useState("");
  const [fileName, setFileName] = useState("");
  const [userData, setUserData] = useState<TUserData | null>(null);
  const [avatar, setAvatar] = useState("");
  const [fullname, setFullname] = useState("");
  const [initial, setInitial] = useState("");
  const [docList, setDocList] = useState<TDocItem[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
    },
  });

  // functions
  // const sortByOpenedDate = (items: TDocItem[]): TDocItem[] => {
  //   return items.sort(
  //     (a, b) => b.openedDate.getTime() - a.openedDate.getTime()
  //   );
  // };

  const fetchProfileUser = async (
    id: string,
    email: string,
    displayName: string,
    avatar: string
  ) => {
    try {
      const result = await updateProfileUser(id, email, displayName, avatar);
      console.log("result: ", result);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const fetchGetDocList = async (id: string) => {
    try {
      const result = await getOrCreateDocList(id);
      console.log("result: ", result);
      if (result) {
        // const sortedList = sortByOpenedDate(result?.list);
        // setDocList(sortedList);
        setDocList(result?.list);
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const updateDocListUser = async (id: string, list: TDocItem[]) => {
    try {
      const result = await updateDocList(id, list);
      console.log("result: ", result);
      // const sortedList = sortByOpenedDate(result.list);
      // setDocList(sortedList);
      setDocList(result.list);
    } catch (error) {
      console.error("Error document list user data: ", error);
    }
  };

  const deleteDocumentUser = async (docId: string) => {
    try {
      const result = await deleteDoc(docId);
      toast({
        description: "Document has been deleted",
      });
    } catch (error) {
      console.error("Error document list user data: ", error);
    }
  };

  const handleOpenSearch = () => {
    setIsCommandOpen(!isCommandOpen);
  };

  const openEdit = () => {
    setEditState(!editState);
  };

  const handleCommandItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsCommandOpen(false);
    console.log("Link clicked:", e.currentTarget.href);
  };

  const formatOpenedDate = (itemDate: Date | string): string => {
    let date;
    if (typeof itemDate === "string") {
      date = new Date(itemDate);
    } else {
      date = itemDate;
    }

    if (date instanceof Date) {
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      return isToday
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : date.toLocaleDateString();
    }
    return "Invalid date";
  };

  // const takeScreenshot = async () => {
  //   try {
  //     const response = await fetch("/api/take-screenshot", {
  //       method: "POST",
  //     });
  //     const data = await response.json();
  //     console.log("Screenshot taken, title:", data.title);
  //   } catch (error) {
  //     console.error("Error taking screenshot:", error);
  //   }
  // };
  // const takeScreenshot = async () => {
  //   try {
  //     const response = await fetch("/api/take-screenshot", {
  //       method: "POST",
  //     });
  //     const data = await response.json();
  //     console.log("Screenshot taken, title:", data.title);
  //   } catch (error) {
  //     console.error("Error taking screenshot:", error);
  //   }
  // };

  const handleFileAction = (action: string) => {
    console.log("file action: ", action);
    if (action === "edit") {
      setFileAction("edit");
    } else {
      setFileAction("delete");
    }
    setIsDialogOpen(true);
  };

  const handleFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(event.target.value);
  };

  const openDoc = (itemIndex: number) => {
    const selectedItem = docList.splice(itemIndex, 1);
    const timestamp = new Date();
    let openedDoc = selectedItem[0];
    openedDoc.openedDate = timestamp;

    const newDocList = [openedDoc, ...docList];
    if (userData && userData.uid) {
      updateDocListUser(userData.uid, newDocList);
    }
  };

  const createNewDoc = () => {
    const newId = uuidv4();
    const timestamp = new Date();
    const newDocItem: TDocItem = {
      docId: newId,
      fileName: "New Document",
      thumbnail: "",
      openedDate: timestamp,
    };
    const newDocList = [newDocItem, ...docList];

    const targetUrl = `/document/${newId}`;
    window.open(targetUrl, "_blank");
    if (userData && userData.uid) {
      updateDocListUser(userData.uid, newDocList);
    }
  };

  const editFilename = (itemIndex: number) => {};

  const deleteFile = (itemIndex: number) => {
    const selectedItem = docList.splice(itemIndex, 1);
    const newDocList = [...docList];
    if (userData && userData.uid) {
      updateDocListUser(userData.uid, newDocList);
      const docId = selectedItem[0].docId;
      deleteDocumentUser(docId.toString());
    }
    setIsDialogOpen(false);
  };

  const getInitials = (fullName: string) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length < 2) return "SW";
    const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    setInitial(initials);
  };

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void
  ) => {
    const file = event.target.files?.[0];
    // const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    console.log("user signed out!");
    // Remove user data from cookies
    Cookies.remove("syncwrite-userData");
    console.log("cookies removed");
    router.replace("/");
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = {
      fullname: fullname || data.fullname,
      email: data.email,
      // avatar: data.avatar ? data.avatar : undefined,
      avatar: avatar || undefined,
    };

    console.log("submittedData: ", formData);
    if (userData !== null && userData.uid) {
      fetchProfileUser(
        userData.uid,
        formData.email,
        formData.fullname,
        formData.avatar ?? ""
      );
    }
    setEditState(false);
    toast({
      description: "Update profile succeed",
      // description: (
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">
      //       {JSON.stringify(formData, null, 2)}
      //     </code>
      //   </pre>
      // ),
    });
  }

  // useEffect
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    // takeScreenshot();
    // SSHandler();
    console.log("ss diambil");
  }, []);

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

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      // const { uid, email, displayName } = user;
      const fetchUserData = async () => {
        try {
          const result = await getOrCreateUser(
            user.uid,
            user.email,
            user.displayName,
            ""
          );
          console.log("result: ", result);
          const userSigned: TUserData = {
            uid: result._id,
            email: result.email,
            displayName: result.displayName,
            avatar: result.avatar,
          };
          setUserData(userSigned);
          setAvatar(result.avatar ?? "");
          setFullname(result.displayName ?? "");
          getInitials(result.displayName);
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserData();
      fetchGetDocList(user.uid);
    } else {
      console.log("No user data found in cookies.");
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    if (userData) {
      form.reset({
        fullname: fullname ?? "",
        email: userData.email ?? "",
      });
      // setFullname(userData.displayName ?? "");
    }
  }, [userData, form]);

  useEffect(() => {
    console.log("userData: ", userData);
  }, [userData]);
  // useEffect(() => {
  //   console.log("avatar: ", avatar);
  // }, [avatar]);
  useEffect(() => {
    console.log("isDialogOpen: ", isDialogOpen);
  }, [isDialogOpen]);
  // useEffect(() => {
  //   console.log("docList: ", docList);
  // }, [docList]);
  return (
    <>
      <header className="flex items-center justify-between sticky top-0 z-10 px-6 py-2 bg-background border-b border-solid border-border">
        <div className="flex items-center justify-start">
          <Link className="mr-3" href="/my-documents">
            <Image
              src={SyncWriteLogo}
              alt="sync-write-logo"
              style={{ width: "40px", height: "auto" }}
            />
          </Link>
          <Link href="/my-documents">
            <h1 className="text-2xl font-bold">SyncWrite</h1>
          </Link>
        </div>

        <div className="flex items-center justify-end">
          <button
            className="mr-3 inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible: ring-I focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover: px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] be-muted/ 50 text-sm font-normal text-muted-foreground shadow-none lg:w-64"
            onClick={handleOpenSearch}
          >
            <span className="hidden lg:inline-flex">Search Documents...</span>
            <span className="inline-flex lg:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              CTRL + K
            </kbd>
          </button>
          {windowWidth >= 650 && (
            <div className="mr-3">
              <ModeToggle />
            </div>
          )}
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer">
                  <AvatarImage
                    className="object-cover"
                    src={avatar}
                    alt="avatar-image"
                  />
                  <AvatarFallback>{initial ?? "SW"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {windowWidth < 650 && (
                  <>
                    <DropdownMenuLabel>
                      <ModeToggle />
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DialogTrigger asChild>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    My profile
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={handleSignOut}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <DialogHeader>
                    <DialogTitle>My Profile</DialogTitle>
                    <DialogDescription>
                      <div className="my-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={openEdit}
                        >
                          <Pencil size={17} />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <FormLabel>Fullname</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jane Doe"
                                {...field}
                                // value={userData?.displayName ?? ""}
                                value={fullname}
                                onChange={handleNameChange}
                                disabled={!editState}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {editState && (
                        <FormField
                          control={form.control}
                          name="avatar"
                          render={({ field }) => (
                            <FormItem className="mb-2">
                              <FormLabel>Avatar</FormLabel>
                              <FormControl>
                                <Input
                                  id="avatar"
                                  className="hover:cursor-pointer"
                                  type="file"
                                  accept="image/*"
                                  // onChange={handleAvatarChange}
                                  onChange={(e) =>
                                    handleAvatarChange(e, field.onChange)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="example@email.com"
                                {...field}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </DialogDescription>
                  </DialogHeader>

                  {editState && (
                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  )}
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <section className="px-20 pt-4">
        <div className="h-[260px] flex items-center justify-center container-bg object-right-bottom object-cover rounded-xl mb-4"></div>
        <div className="flex items-center justify-between mb-4">
          <p>Newest documents</p>
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={createNewDoc}
          >
            <Plus />
          </Button>
        </div>
        <div className="h-full grid grid-cols-5 gap-5">
          {docList &&
            docList.map((item: TDocItem, index) => (
              <div key={index} className="h-[16rem]">
                <Card className="h-full">
                  {/* max-w-[19%] */}
                  <Link
                    href={`/document/${item.docId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => openDoc(index)}
                  >
                    <CardHeader className="flex items-center justify-center h-[78%]">
                      <CardTitle>Preview doc</CardTitle>
                    </CardHeader>
                  </Link>
                  <CardFooter className="justify-between pl-[1.2rem] pr-[0.2rem]">
                    <div>
                      <Link
                        href={`/document/${item.docId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => openDoc(index)}
                      >
                        <p>{item.fileName}</p>
                        <CardDescription>
                          Opened {formatOpenedDate(item.openedDate)}
                        </CardDescription>
                      </Link>
                    </div>
                    <div>
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="rounded-full"
                              variant="ghost"
                              size="icon"
                            >
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                className="hover:cursor-pointer"
                                onClick={() => handleFileAction("edit")}
                              >
                                <FileType className="mr-2" size={16} />
                                Edit name
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                className="hover:cursor-pointer"
                                onClick={() => handleFileAction("delete")}
                              >
                                <Trash2 className="mr-2" size={16} />
                                Delete file
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {isDialogOpen && fileAction === "edit" && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit File Name</DialogTitle>
                              <DialogDescription>
                                <Input
                                  className="mt-3"
                                  placeholder="File name"
                                  onChange={handleFilenameChange}
                                  value={fileName}
                                />
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() => editFilename(index)}
                              >
                                Confirm
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        )}

                        {isDialogOpen && fileAction === "delete" && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. Are you sure you
                                want to permanently delete this file from our
                                server?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() => deleteFile(index)}
                              >
                                Confirm
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
        </div>
      </section>

      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type file name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <Link
              className="hover:cursor-pointer"
              href="#"
              onClick={(e) => handleCommandItemClick(e)}
            >
              <CommandItem>Calendar</CommandItem>
            </Link>
            <Link
              className="hover:cursor-pointer"
              href="#"
              onClick={(e) => handleCommandItemClick(e)}
            >
              <CommandItem>Search Emoji</CommandItem>
            </Link>
            <Link
              className="hover:cursor-pointer"
              href="#"
              onClick={(e) => handleCommandItemClick(e)}
            >
              <CommandItem>Calculator</CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default DocumentListPage;
