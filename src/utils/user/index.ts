export const getOrCreateUser = async (
  uid?: string,
  email?: string | null,
  displayName?: string | null,
  avatar?: string | null
) => {
  try {
    const response = await fetch(
      "https://syncwrite-server.vercel.app/api/get-or-create-user",
      {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uid,
          email: email,
          displayName: displayName,
          avatar: avatar,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const updateProfileUser = async (
  uid?: string,
  email?: string | null,
  displayName?: string | null,
  avatar?: string | null
) => {
  try {
    const response = await fetch(
      "https://syncwrite-server.vercel.app/api/update-profile",
      {
        mode: "no-cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uid,
          email: email,
          displayName: displayName,
          avatar: avatar,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getOrCreateDocList = async (uid?: string) => {
  try {
    const response = await fetch(
      "https://syncwrite-server.vercel.app/api/get-or-create-doclist",
      {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uid,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch document list");
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};

type TDocItem = {
  docId: String;
  fileName: String;
  thumbnail: String;
  openedDate: Date;
};
export const updateDocList = async (id?: string, list?: TDocItem[]) => {
  try {
    const response = await fetch(
      "https://syncwrite-server.vercel.app/api/update-doclist",
      {
        mode: "no-cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          list: list,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update document list");
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const updateDocName = async (id?: string, fileName?: string) => {
  try {
    const response = await fetch(
      "https://syncwrite-server.vercel.app/api/change-filename",
      {
        mode: "no-cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          fileName: fileName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update document name");
    }

    const data = await response.json();
    console.log("response data: ", data);
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const deleteDoc = async (id: string) => {
  try {
    const response = await fetch(
      `https://syncwrite-server.vercel.app/api/delete-doc/${id}`,
      {
        mode: "no-cors",
        method: "DELETE",
        headers: {},
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete document");
    }

    // const data = await response.json();
    console.log("response: ", response);
    return response;
  } catch (error: any) {
    console.log(error.message);
  }
};
