type TCollaborators = {
  userId: string;
  socketId: string;
};
export const getCollaborators = async (list: TCollaborators[]) => {
  try {
    const response = await fetch(
      "https://syncwrite-server.vercel.app/api/get-users-now",
      {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userList: list,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch collaborators");
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};
