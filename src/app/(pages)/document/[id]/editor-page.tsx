"use client";
import TextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const EditorPage = () => {
  const pathname = usePathname();
  const { toast } = useToast();
  const users = [
    { name: "Abdullah Al Fatih", initials: "AF" },
    { name: "Abdullah Al Fatih", initials: "AF" },
    { name: "Abdullah Al Fatih", initials: "AF" },
  ];

  const handleCopyLink = () => {
    const url = window.location.origin + pathname;
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          className: "bg-[#09090b] text-primary-foreground",
          description: "Link copied to clipboard!",
        });
      },
      (err) => {
        toast({
          className: "bg-[#09090b] text-primary-foreground",
          description: `Could not copy text: , ${err}`,
        });
      }
    );
  };
  return (
    <>
      <header className="bg-[#f6faff] sticky top-0 z-10 flex items-center justify-between px-3 py-2">
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            className="px-[0.7rem] py-[0.6rem] rounded-full w-11 h-11"
            size="icon"
          >
            <TiHome style={{ fontSize: "1.75rem" }} />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  className="ml-3 mr-3 bg-[#f6faff] max-w-[33%] border-0 hover:border"
                  value="Laporan PKL"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Badge>Saving...</Badge>
          <span className="text-xs ml-3">
            Any changes will save every 2 seconds
          </span>
        </div>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="rounded-full mr-3" variant="ghost" size="icon">
                3+
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p className="font-normal">Windy Fadilah</p>
                <p className="font-normal">Susanti Aji</p>
                <p className="font-normal">Agus Kuncoro</p>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          {users.map(
            (
              user: {
                name: string;
                initials: string;
              },
              index: number
            ) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="mr-3 hover:cursor-pointer">
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
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

      <TextEditor />
    </>
  );
};

export default EditorPage;
