import ImageKit from "imagekit";
let instance;
function client() {
  if (!instance) instance = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  return instance;
}
export default {
  upload: (...args) => client().upload(...args),
  deleteFile: (...args) => client().deleteFile(...args),
  url: (...args) => client().url(...args),
};
