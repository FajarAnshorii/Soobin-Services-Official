/**
 * Client-side image compression helper to ensure chat uploads are ultra-lightweight (~50KB-80KB).
 */
export async function compressChatImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
): Promise<{ dataUrl: string; fileName: string; fileSize: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Approximate size
        const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
        const fileSize = sizeInBytes > 1024 * 1024 
          ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(sizeInBytes / 1024)} KB`;

        resolve({
          dataUrl,
          fileName: file.name,
          fileSize,
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
