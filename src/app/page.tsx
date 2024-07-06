import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import google-logo from '../../public/assets/logo/Google__Logo.svg';
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-wrap items-center justify-around">
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
