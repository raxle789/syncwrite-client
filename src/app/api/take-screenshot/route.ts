import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // await page.goto("https://developer.chrome.com/");
    await page.goto("http://localhost:3000/document/242t4gdsbs");

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // Take screenshot
    const screenshotBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    // Convert buffer to base64
    const screenshotBase64 = screenshotBuffer.toString("base64");

    // Print the full title.
    // console.log('The title of this blog post is "%s".', screenshotBuffer);
    return NextResponse.json({ title: screenshotBase64 });
  } catch (error) {
    console.error("Error taking screenshot:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
}

export async function ScreenshotHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    if (!req.url) {
      throw new Error("Request URL is undefined");
    }
    // Parse the URL to get the pathname
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    console.log("Current pathname:", pathname);

    // Puppeteer logic here
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://developer.chrome.com/");

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // Take screenshot
    const screenshotBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    // Convert buffer to base64
    const screenshotBase64 = screenshotBuffer.toString("base64");

    res.status(200).json({ screenshot: screenshotBase64 });
  } catch (error) {
    console.error("Error taking screenshot:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
