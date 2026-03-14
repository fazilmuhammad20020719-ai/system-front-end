/**
 * Draws the cropped region of an image onto a canvas and returns it as a Blob.
 * @param {string} imageSrc - Data URL of the source image
 * @param {{ x: number, y: number, width: number, height: number }} pixelCrop - Pixel crop coordinates
 * @returns {Promise<Blob>}
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y,
        pixelCrop.width, pixelCrop.height,
        0, 0,
        pixelCrop.width, pixelCrop.height
      );
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/jpeg', 0.92);
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}
