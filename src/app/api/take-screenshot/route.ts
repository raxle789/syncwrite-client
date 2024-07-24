import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     // await page.goto("https://developer.chrome.com/");
//     await page.goto("http://localhost:3000/document/242t4gdsbs");

//     // Set screen size.
//     await page.setViewport({ width: 1080, height: 1024 });

//     // Take screenshot
//     const screenshotBuffer = await page.screenshot({ type: "png" });

//     await browser.close();

//     // Convert buffer to base64
//     const screenshotBase64 = screenshotBuffer.toString("base64");

//     // Print the full title.
//     // console.log('The title of this blog post is "%s".', screenshotBuffer);
//     return NextResponse.json({ title: screenshotBase64 });
//   } catch (error) {
//     console.error("Error taking screenshot:", error);
//     return NextResponse.json({ message: "Internal server error" });
//   }
// }

export async function GET() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      "http://localhost:3000/document/b2283635-34cd-46c8-bb35-39cd81ded5c6"
    );

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Define the clip area
    // const clip = {
    //   x: 270, // Start from 270px from the left
    //   y: 400, // Start from 400px from the top
    //   width: 816, // Capture 816px width
    //   height: 550, // Capture height from 401px to 950px (950 - 400)
    // };

    // Take screenshot with clipping
    const screenshotBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    // Convert buffer to base64
    const screenshotBase64 = screenshotBuffer.toString("base64");

    return NextResponse.json({ screenshot: screenshotBase64 });
  } catch (error) {
    console.error("Error taking screenshot:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null); // Try parsing JSON
    if (!body || !body.url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    const { url } = body;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    // Define the clip area
    const clip = {
      x: 130, // Start from 270px from the left
      y: 120, // Start from 400px from the top
      width: 800, // Capture 816px width
      height: 550, // Capture height from 401px to 950px (950 - 400)
    };

    // Take screenshot with clipping
    const screenshotBuffer = await page.screenshot({ type: "png", clip });
    await browser.close();
    // Convert buffer to base64
    const screenshotBase64 = screenshotBuffer.toString("base64");

    return NextResponse.json({ screenshot: screenshotBase64 });
  } catch (error) {
    console.error("Error taking screenshot:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function ScreenshotHandler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     res.status(405).json({ message: "Method not allowed" });
//     return;
//   }

//   try {
//     if (!req.url) {
//       throw new Error("Request URL is undefined");
//     }
//     // Parse the URL to get the pathname
//     const { pathname } = new URL(req.url, `http://${req.headers.host}`);

//     console.log("Current pathname:", pathname);

//     // Puppeteer logic here
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto("https://developer.chrome.com/");

//     // Set screen size.
//     await page.setViewport({ width: 1080, height: 1024 });

//     // Take screenshot
//     const screenshotBuffer = await page.screenshot({ type: "png" });

//     await browser.close();

//     // Convert buffer to base64
//     const screenshotBase64 = screenshotBuffer.toString("base64");

//     res.status(200).json({ screenshot: screenshotBase64 });
//   } catch (error) {
//     console.error("Error taking screenshot:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
