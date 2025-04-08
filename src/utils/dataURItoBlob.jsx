export function DataURItoBlob(dataURI) {
  // Validate the input is a string and properly formatted
  if (!dataURI || typeof dataURI !== "string" || !dataURI.includes(",")) {
    throw new Error("Invalid Data URI format.");
  }

  try {
    // Split the base64 string to extract MIME type and actual base64 content
    const [mimePart, base64Data] = dataURI.split(",");

    // Decode the base64 content
    const byteString = atob(base64Data);

    // Extract the MIME type from the data URI
    const mimeString = mimePart.split(":")[1].split(";")[0];

    // Create an ArrayBuffer and a view to manipulate the binary data
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    // Populate the array with binary data from the base64 string
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    // Return a Blob using the binary data and MIME type
    return new Blob([uintArray], { type: mimeString });
  } catch (error) {
    console.error("Error converting Data URI to Blob:", error);
    throw new Error("Failed to convert Data URI to Blob.");
  }
}
