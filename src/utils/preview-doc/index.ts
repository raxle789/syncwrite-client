const baseRoute = process.env.NEXT_PUBLIC_SERVER_ROUTE;

export const takePreviewDoc = async (url: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/take-screenshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to take screenshot");
    }

    const data = await response.json();
    console.log("Screenshot:", data.screenshot);
    return data.screenshot;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unexpected error occurred");
    }
  }
};

export const takeScreenshot = async (docId?: string, image?: string | null) => {
  try {
    const response = await fetch(`${baseRoute}/api/save-thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docId: docId,
        image: image,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save thumbnail");
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};

// takeScreenshot("http://localhost:3000/document/242t4gdsbs");
