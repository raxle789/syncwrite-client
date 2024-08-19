"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  PopupSignIn,
  RedirectSignIn,
  auth,
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
      <div>
        <h1 className="font-bold text-center text-5xl mb-3">SyncWrite</h1>
        <p className="text-center text-lg">Collaboration Docs Workspace</p>
      </div>
      <div className="p-3">
        <Card>
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
      {/* <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="min-h-dvh flex flex-wrap items-center justify-around">
          <div>
            <h1 className="font-bold text-center text-5xl mb-3">SyncWrite</h1>
            <p className="text-center text-lg">Collaboration Docs Workspace</p>
          </div>
          <div className="p-3">
            <Card>
              <CardHeader>
                <CardTitle>Log in</CardTitle>
                <CardDescription>
                  Start collaborate with log in or sign up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="min-w-full justify-start">
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
                <p className="text-sm mb-2">Don't have an account?</p>
                <Button className="min-w-full justify-start">
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
        </div>
      </div> */}
    </main>
  );
}
