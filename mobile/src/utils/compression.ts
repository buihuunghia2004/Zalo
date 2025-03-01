import pako from 'pako';

export const compressData = (data: any): Uint8Array => {
  const stringifiedData = JSON.stringify(data);
  return pako.gzip(stringifiedData);
};

export const decompressData = (compressedData: Uint8Array | string): any => {
  const decompressed = pako.ungzip(compressedData as Uint8Array, { to: 'string' });
  return JSON.parse(decompressed);
};