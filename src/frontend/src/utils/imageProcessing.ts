export interface ProcessImageOptions {
  scaleFactor: number;
  sharpness: number; // 0–100
  noiseReduction: boolean;
}

export interface ProcessProgress {
  percent: number;
  stage: string;
}

/**
 * Apply a 3x3 convolution kernel to ImageData.
 */
function applyConvolution(
  imageData: ImageData,
  kernel: number[],
  divisor: number,
): ImageData {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ni = ((y + ky) * width + (x + kx)) * 4;
            sum += data[ni + c] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        output[idx + c] = Math.min(255, Math.max(0, sum / divisor));
      }
      output[idx + 3] = data[idx + 3]; // preserve alpha
    }
  }

  // Copy border pixels unchanged
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        const idx = (y * width + x) * 4;
        output[idx] = data[idx];
        output[idx + 1] = data[idx + 1];
        output[idx + 2] = data[idx + 2];
        output[idx + 3] = data[idx + 3];
      }
    }
  }

  return new ImageData(output, width, height);
}

/**
 * Apply box blur (noise reduction) — 3x3 averaging kernel.
 */
function applyBoxBlur(imageData: ImageData): ImageData {
  const kernel = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  return applyConvolution(imageData, kernel, 9);
}

/**
 * Apply unsharp mask sharpening.
 * strength: 0–100 (mapped to blend factor)
 */
function applySharpen(imageData: ImageData, strength: number): ImageData {
  if (strength === 0) return imageData;

  // Unsharp mask kernel; blended by strength
  const s = strength / 100;
  const center = 1 + 4 * s;
  const edge = -s;

  const kernel = [0, edge, 0, edge, center, edge, 0, edge, 0];
  return applyConvolution(imageData, kernel, 1);
}

/**
 * Upscale an HTMLImageElement using multi-step bicubic-style approach.
 */
function stepwiseUpscale(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement {
  let current = sourceCanvas;
  let currentW = sourceCanvas.width;
  let currentH = sourceCanvas.height;

  while (currentW < targetWidth || currentH < targetHeight) {
    const nextW = Math.min(currentW * 2, targetWidth);
    const nextH = Math.min(currentH * 2, targetHeight);

    const step = document.createElement("canvas");
    step.width = nextW;
    step.height = nextH;
    const ctx = step.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(current, 0, 0, nextW, nextH);

    current = step;
    currentW = nextW;
    currentH = nextH;
  }

  return current;
}

/**
 * Process an image File with upscaling, sharpening, and noise reduction.
 * Returns a PNG Blob.
 */
export async function processImage(
  file: File,
  options: ProcessImageOptions,
  onProgress?: (p: ProcessProgress) => void,
): Promise<Blob> {
  onProgress?.({ percent: 5, stage: "Loading image…" });

  const imageBitmap = await createImageBitmap(file);

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = imageBitmap.width;
  srcCanvas.height = imageBitmap.height;
  const srcCtx = srcCanvas.getContext("2d")!;
  srcCtx.drawImage(imageBitmap, 0, 0);
  imageBitmap.close();

  onProgress?.({ percent: 20, stage: "Upscaling resolution…" });

  const targetW = imageBitmap.width * options.scaleFactor;
  const targetH = imageBitmap.height * options.scaleFactor;

  const upscaled = stepwiseUpscale(srcCanvas, targetW, targetH);

  onProgress?.({ percent: 55, stage: "Applying enhancements…" });

  const ctx = upscaled.getContext("2d")!;
  let imgData = ctx.getImageData(0, 0, upscaled.width, upscaled.height);

  if (options.noiseReduction) {
    onProgress?.({ percent: 65, stage: "Reducing noise…" });
    imgData = applyBoxBlur(imgData);
  }

  if (options.sharpness > 0) {
    onProgress?.({ percent: 80, stage: "Sharpening…" });
    imgData = applySharpen(imgData, options.sharpness);
  }

  ctx.putImageData(imgData, 0, 0);

  onProgress?.({ percent: 95, stage: "Encoding output…" });

  return new Promise<Blob>((resolve, reject) => {
    upscaled.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to encode canvas to blob"));
    }, "image/png");
  });
}

// ─── Video Processing ──────────────────────────────────────────────────────────

export interface ProcessVideoOptions extends ProcessImageOptions {
  // same fields
}

export async function processVideo(
  file: File,
  options: ProcessVideoOptions,
  onProgress?: (p: ProcessProgress) => void,
): Promise<Blob> {
  onProgress?.({ percent: 2, stage: "Loading video…" });

  return new Promise<Blob>((resolve, reject) => {
    const videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    videoEl.src = objectUrl;

    videoEl.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load video"));
    });

    videoEl.addEventListener("loadedmetadata", async () => {
      try {
        const { videoWidth, videoHeight, duration } = videoEl;
        const targetW = videoWidth * options.scaleFactor;
        const targetH = videoHeight * options.scaleFactor;

        // Output canvas
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d")!;

        // MediaRecorder setup
        const stream = canvas.captureStream(30);
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";

        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 8_000_000,
        });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(new Blob(chunks, { type: mimeType }));
        };

        recorder.start(100);

        // Frame-by-frame processing
        const FPS = 30;
        const frameInterval = 1 / FPS;
        let currentTime = 0;

        const processFrame = () =>
          new Promise<void>((res) => {
            videoEl.currentTime = currentTime;
            videoEl.addEventListener(
              "seeked",
              () => {
                // Draw upscaled frame
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                // Draw original at half size if needed for step-up
                if (options.scaleFactor > 2) {
                  const mid = document.createElement("canvas");
                  mid.width = videoWidth * 2;
                  mid.height = videoHeight * 2;
                  const mCtx = mid.getContext("2d")!;
                  mCtx.imageSmoothingEnabled = true;
                  mCtx.imageSmoothingQuality = "high";
                  mCtx.drawImage(videoEl, 0, 0, mid.width, mid.height);
                  ctx.drawImage(mid, 0, 0, targetW, targetH);
                } else {
                  ctx.drawImage(videoEl, 0, 0, targetW, targetH);
                }

                // Apply pixel-level filters if enabled
                if (options.noiseReduction || options.sharpness > 0) {
                  let imgData = ctx.getImageData(0, 0, targetW, targetH);
                  if (options.noiseReduction) imgData = applyBoxBlur(imgData);
                  if (options.sharpness > 0)
                    imgData = applySharpen(imgData, options.sharpness);
                  ctx.putImageData(imgData, 0, 0);
                }

                res();
              },
              { once: true },
            );
          });

        while (currentTime <= duration) {
          await processFrame();
          const progress = Math.min(
            98,
            Math.round((currentTime / duration) * 90) + 5,
          );
          const eta = Math.round(
            ((duration - currentTime) / frameInterval) * 0.04,
          );
          onProgress?.({
            percent: progress,
            stage: `Processing frame ${Math.round(currentTime * FPS)} / ${Math.round(duration * FPS)} · ETA ${eta}s`,
          });
          currentTime += frameInterval;
        }

        onProgress?.({ percent: 99, stage: "Encoding video…" });
        recorder.stop();
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    });

    videoEl.load();
  });
}
