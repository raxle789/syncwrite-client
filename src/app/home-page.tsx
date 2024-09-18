"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Image } from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import cover from "../../public/assets/text-cover.jpg";
import Image from "next/image";
import {
  PopupSignIn,
  RedirectSignIn,
  // auth,
} from "@/utils/firebase/firebase.util";
import { getRedirectResult, getAuth, onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";
import { getUserDataFromCookies } from "@/utils/authentication";

type TUserData = {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
};

export default function HomePage() {
  const router = useRouter();

  // Functions
  const handleSignIn = async () => {
    try {
      const result = await PopupSignIn();
      if (result) {
        const data = result.user;
        const userSigned: TUserData = {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
        };
        // setUserData(userSigned);
        console.log("data: ", data);
        // Simpan data pengguna ke dalam cookie
        Cookies.set("syncwrite-userData", JSON.stringify(userSigned), {
          expires: 3,
        }); // Cookie disimpan selama 3 hari
        console.log("cookies created");
        router.push("/my-documents");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignInRedirect = async () => {
    console.log("handle redirect");
    try {
      await RedirectSignIn();
      console.log("redirect");
      const auth = getAuth();
      console.log("auth sudah");
      const response = await getRedirectResult(auth);
      console.log(response);
      if (response) {
        const data = response.user;
        const userSigned: TUserData = {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
        };
        // setUserData(userSigned);
        console.log("data: ", data);
        // Simpan data pengguna ke dalam cookie
        Cookies.set("syncwrite-userData", JSON.stringify(userSigned), {
          expires: 3,
        }); // Cookie disimpan selama 3 hari
        console.log("cookies created");
        router.push("/my-documents");
      }
    } catch (error) {
      console.log("Error sign in: ", error);
    }
  };

  // useEffect(() => {
  //   const fetchSignInResult = async () => {
  //     const auth = getAuth();
  //     try {
  //       const result = await getRedirectResult(auth);
  //       if (result) {
  //         const user = result.user;
  //         console.log("User info: ", user);
  //         // Lakukan sesuatu dengan informasi pengguna, misalnya menyimpan dalam state atau context
  //         setUserId(user.uid);
  //         router.push("/my-documents");
  //       }
  //     } catch (error) {
  //       console.error("Error during sign-in: ", error);
  //     }
  //   };
  //   fetchSignInResult();
  // }, [router]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const auth = getAuth();
  //       console.log("auth sudah");
  //       // const response = await getRedirectResult(auth);
  //       // console.log(response);
  //       getRedirectResult(auth)
  //         .then((result) => {
  //           if (result) {
  //             const user = result.user;
  //             console.log("User info: ", user);
  //             // Lakukan sesuatu dengan informasi pengguna, misalnya menyimpan dalam state atau context
  //             // router.push("/my-documents");
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Error during sign-in: ", error);
  //         });
  //       // if (response) {
  //       //   const data = response.user;
  //       //   const userSigned: TUserData = {
  //       //     uid: data.uid,
  //       //     email: data.email,
  //       //     displayName: data.displayName,
  //       //   };
  //       //   // setUserData(userSigned);
  //       //   console.log("data: ", data);
  //       //   // Simpan data pengguna ke dalam cookie
  //       //   Cookies.set("syncwrite-userData", JSON.stringify(userSigned), {
  //       //     expires: 3,
  //       //   }); // Cookie disimpan selama 3 hari
  //       //   console.log("cookies created");
  //       //   router.push("/my-documents");
  //       // }
  //     } catch (error) {
  //       console.error("Error during sign-in: ", error);
  //     }
  //   };

  //   console.log("masuk use Effect redirect");
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   console.log("masuk unsubsribe");
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in
  //       const userSigned = {
  //         uid: user.uid,
  //         email: user.email,
  //         displayName: user.displayName,
  //       };

  //       console.log("User signed in: ", userSigned);

  //       // Simpan data pengguna ke dalam cookie
  //       Cookies.set("syncwrite-userData", JSON.stringify(userSigned), {
  //         expires: 3,
  //       });

  //       console.log("Cookies created.");
  //       router.push("/my-documents");
  //     } else {
  //       // User is signed out
  //       console.log("No user signed in.");
  //     }
  //   });

  //   // Clean up subscription on unmount
  //   return () => unsubscribe();
  // }, []);

  // Handle decision if the user is loged or not
  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      router.replace("/my-documents");
    } else {
      console.log("No user data found in cookies.");
    }
  }, []);
  return (
    <main className="home-container min-h-dvh flex flex-wrap items-center justify-around bg-coolGray">
      <div className="vertical-text fixed left-0 top-1/2 transform -translate-y-1/2 text-xs italic z-10">
        Dans le jardin secret, les roses murmurent des rêves doux au vent.
      </div>
      {/* <div className="fixed left-0 top-0 h-screen w-[40%] bg-zinc-50">
        <Image className="object-cover" src={cover} alt="cover" />
      </div> */}

      <div className="z-10">
        <h1 className="font-bold text-center text-5xl mb-3">
          <span className="font-bold text-blue-500">/ </span>SyncWrite
        </h1>
        <p className="text-center text-lg">Collaboration Docs Workspace</p>
      </div>
      <div className="p-3 z-10">
        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>
              Start collaborate with log in or sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="min-w-full justify-start" onClick={handleSignIn}>
              <Image
                className="mr-3"
                src="/assets/logo/Google__Logo.svg"
                alt="Google Logo"
                width={21}
                height={21}
              />
              Log in with Google
            </Button>
          </CardContent>
          <CardFooter className="flex-col">
            <p className="text-sm mb-2">Don&apos;t have an account?</p>
            <Button className="min-w-full justify-start" onClick={handleSignIn}>
              <Image
                className="mr-3"
                src="/assets/logo/Google__Logo.svg"
                alt="Google Logo"
                width={21}
                height={21}
              />
              Sign up with Google
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* <div className="relative">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam,
          mollitia incidunt. Ratione ea laudantium consectetur eligendi, ad quas
          cupiditate veniam?
        </p>
      </div> */}
      <div className="absolute w-full h-[15%] bottom-0 left-0 p-4 z-10">
        <div className="w-full h-full bg-background rounded-2xl shadow-2xl flex items-center justify-center">
          {/* <div className="flex items-center justify-center"> */}
          <div className="w-full flex items-center">
            <div className="flex items-center w-1/2">
              <h3 className="font-bold text-2xl px-12">Create</h3>
              <h3 className="font-bold text-2xl px-12">Sync</h3>
              <h3 className="font-bold text-2xl px-12">Collaborate</h3>
            </div>
            <div>
              <p className="font-semibold text-lg italic">
                Sous la lune brillante, le silence danse avec les étoiles
                éternelles du ciel.
              </p>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </main>
  );
}
