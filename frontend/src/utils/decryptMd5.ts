export const md5 = (string: string): string => {
  const crypto = new TextEncoder();
  const data = crypto.encode(string);
  const hashBuffer = new Uint8Array(16);
  let i;
  for (i = 0; i < data.length; i++) {
    hashBuffer[i % 16] ^= data[i];
  }
  return Array.from(hashBuffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
};
