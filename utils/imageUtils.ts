// Simple 1x1 red pixel as base64 - guaranteed to work
export const defaultImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

/**
 * Converts a base64 data URL to a Blob
 */
export function base64ToBlob(base64Data: string): Blob {
  // Extract the base64 string (remove data:image/png;base64, prefix)
  const base64String = base64Data.split(',')[1];
  
  // Convert base64 to binary string
  const binaryString = atob(base64String);
  
  // Create a Uint8Array from the binary string
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Create and return blob
  return new Blob([bytes], { type: 'image/png' });
}

/**
 * Converts a base64 data URL to a File object
 */
export function base64ToFile(base64Data: string, filename: string): File {
  const blob = base64ToBlob(base64Data);
  return new File([blob], filename, { type: 'image/png' });
}