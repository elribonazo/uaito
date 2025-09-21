/**
 * Converts a Blob to a data URL.
 * @param {Blob} blob - The Blob to convert.
 * @returns {Promise<string>} A promise that resolves to the data URL.
 */
export const blobToDataURL = async (blob: Blob): Promise<string> => {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = `data:${blob.type};base64,${buffer.toString("base64")}`;
    return dataUrl;
  };
  