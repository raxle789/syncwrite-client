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

// takeScreenshot("http://localhost:3000/document/242t4gdsbs");
