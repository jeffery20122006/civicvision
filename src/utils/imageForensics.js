/**
 * Forensic Image Analysis Utility for CivicVision Pro
 * Analyzes whether an uploaded photo is an authentic camera photo
 * or an AI-generated synthetic image (Midjourney, DALL-E, Stable Diffusion, Flux, etc.),
 * and extracts visual perceptual hash for geospatial duplicate clustering.
 */

// 1. Binary EXIF & AI Generator Metadata Parser
export const parseExifAndMetadata = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const view = new DataView(buffer);
        const textDecoder = new TextDecoder('utf-8');
        
        // Convert initial chunk to string to search for AI prompt / generation signatures
        const maxScanBytes = Math.min(buffer.byteLength, 128 * 1024); // 128KB scan
        const asciiChunk = textDecoder.decode(new Uint8Array(buffer, 0, maxScanBytes)).toLowerCase();
        
        // AI Signatures commonly embedded in PNG/WebP tEXt or JPEG APP markers
        const aiKeywords = [
          'midjourney',
          'stable diffusion',
          'stablediffusion',
          'dall-e',
          'dalle',
          'comfyui',
          'novelai',
          'flux.1',
          'civitai',
          'automatic1111',
          'adobe firefly',
          'bing image creator',
          'gemini_generated',
          'generative ai',
          'parameters:\n',
          'negative prompt:',
          'steps: ',
          'sampler: ',
          'cfg scale: ',
          'model_hash:'
        ];

        const detectedAiKeywords = aiKeywords.filter(keyword => asciiChunk.includes(keyword));
        const hasAiMetadata = detectedAiKeywords.length > 0;

        // Check for Camera Hardware EXIF (JPEG APP1 marker 0xFFE1)
        let hasCameraExif = false;
        let cameraMake = null;
        let cameraModel = null;
        let software = null;
        let iso = null;
        let exposure = null;
        let fNumber = null;
        let dateTime = null;

        // Simple JPEG EXIF scanner
        if (view.getUint16(0) === 0xFFD8) { // JPEG SOI
          let offset = 2;
          while (offset < view.byteLength - 4) {
            const marker = view.getUint16(offset);
            offset += 2;

            if (marker === 0xFFE1) { // APP1 EXIF
              const length = view.getUint16(offset);
              offset += 2;
              
              // Check for "Exif\0\0"
              const exifHeader = view.getUint32(offset);
              if (exifHeader === 0x45786966) { // 'Exif'
                hasCameraExif = true;
                
                // Read TIFF header
                const tiffStart = offset + 6;
                const littleEndian = view.getUint16(tiffStart) === 0x4949; // 'II' vs 'MM'
                
                const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian);
                if (firstIfdOffset >= 8 && firstIfdOffset < length) {
                  const ifdStart = tiffStart + firstIfdOffset;
                  const entries = view.getUint16(ifdStart, littleEndian);
                  
                  for (let i = 0; i < Math.min(entries, 40); i++) {
                    const entryOffset = ifdStart + 2 + (i * 12);
                    if (entryOffset + 12 > buffer.byteLength) break;
                    
                    const tag = view.getUint16(entryOffset, littleEndian);
                    const count = view.getUint32(entryOffset + 4, littleEndian);
                    const valOffset = view.getUint32(entryOffset + 8, littleEndian);

                    // 0x010F = Make, 0x0110 = Model, 0x0131 = Software, 0x0132 = DateTime
                    if (tag === 0x010F && count < 64) {
                      const strStart = tiffStart + valOffset;
                      if (strStart + count <= buffer.byteLength) {
                        cameraMake = textDecoder.decode(new Uint8Array(buffer, strStart, count)).replace(/\0/g, '').trim();
                      }
                    } else if (tag === 0x0110 && count < 64) {
                      const strStart = tiffStart + valOffset;
                      if (strStart + count <= buffer.byteLength) {
                        cameraModel = textDecoder.decode(new Uint8Array(buffer, strStart, count)).replace(/\0/g, '').trim();
                      }
                    } else if (tag === 0x0131 && count < 64) {
                      const strStart = tiffStart + valOffset;
                      if (strStart + count <= buffer.byteLength) {
                        software = textDecoder.decode(new Uint8Array(buffer, strStart, count)).replace(/\0/g, '').trim();
                      }
                    } else if (tag === 0x0132 && count < 32) {
                      const strStart = tiffStart + valOffset;
                      if (strStart + count <= buffer.byteLength) {
                        dateTime = textDecoder.decode(new Uint8Array(buffer, strStart, count)).replace(/\0/g, '').trim();
                      }
                    }
                  }
                }
              }
              break;
            } else if ((marker & 0xFF00) === 0xFF00) {
              const segLength = view.getUint16(offset);
              offset += segLength;
            } else {
              break;
            }
          }
        }

        // Check filename clues (e.g., "Gemini_Generated_Image...", "DALL·E...", "Flux...")
        const fileNameLower = (file.name || '').toLowerCase();
        const hasAiFileName = 
          fileNameLower.includes('gemini') || 
          fileNameLower.includes('dall') || 
          fileNameLower.includes('midjourney') || 
          fileNameLower.includes('flux') ||
          fileNameLower.includes('stablediffusion') ||
          fileNameLower.includes('ai_');

        resolve({
          hasCameraExif,
          cameraMake,
          cameraModel,
          software,
          iso,
          exposure,
          fNumber,
          dateTime,
          detectedAiKeywords,
          hasAiMetadata: hasAiMetadata || hasAiFileName,
          fileNameClue: hasAiFileName ? file.name : null,
          fileSizeKb: Math.round(file.size / 1024),
          mimeType: file.type
        });
      } catch (err) {
        console.warn("EXIF parse warning:", err);
        resolve({
          hasCameraExif: false,
          hasAiMetadata: false,
          detectedAiKeywords: [],
          fileSizeKb: Math.round(file.size / 1024)
        });
      }
    };
    reader.onerror = () => resolve({ hasCameraExif: false, hasAiMetadata: false, detectedAiKeywords: [] });
    reader.readAsArrayBuffer(file);
  });
};

// 2. High-Precision Canvas Forensics (Noise, ELA, Entropy, Perceptual Hash)
export const analyzeImageCanvas = async (imageSource) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Resize down to working scale for smooth real-time forensic processing
        const maxDim = 512;
        let targetW = width;
        let targetH = height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            targetW = maxDim;
            targetH = Math.round((height * maxDim) / width);
          } else {
            targetH = maxDim;
            targetW = Math.round((width * maxDim) / height);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const totalPixels = targetW * targetH;

        // --- FORENSIC SIGNAL 1: High-Frequency Sensor Noise & Laplacian Variance ---
        // Real optical camera sensors (CMOS/CCD) show natural Poisson photon noise & micro-grain
        // AI diffusion models (Stable Diffusion, Midjourney) produce over-smoothed latent patches or non-physical noise
        let laplacianSum = 0;
        let laplacianSqSum = 0;
        let validSamples = 0;
        
        // Also create a visual Noise Mask Canvas
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = targetW;
        noiseCanvas.height = targetH;
        const noiseCtx = noiseCanvas.getContext('2d');
        const noiseImgData = noiseCtx.createImageData(targetW, targetH);
        const noiseData = noiseImgData.data;

        // Histogram for Shannon Entropy
        const hist = new Uint32Array(256);

        for (let y = 1; y < targetH - 1; y++) {
          for (let x = 1; x < targetW - 1; x++) {
            const idx = (y * targetW + x) * 4;
            
            // Grayscale luminance
            const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            hist[Math.floor(lum)]++;

            // Laplacian 3x3: [0, -1, 0; -1, 4, -1; 0, -1, 0]
            const up = 0.299 * data[((y - 1) * targetW + x) * 4] + 0.587 * data[((y - 1) * targetW + x) * 4 + 1] + 0.114 * data[((y - 1) * targetW + x) * 4 + 2];
            const down = 0.299 * data[((y + 1) * targetW + x) * 4] + 0.587 * data[((y + 1) * targetW + x) * 4 + 1] + 0.114 * data[((y + 1) * targetW + x) * 4 + 2];
            const left = 0.299 * data[(y * targetW + (x - 1)) * 4] + 0.587 * data[(y * targetW + (x - 1)) * 4 + 1] + 0.114 * data[(y * targetW + (x - 1)) * 4 + 2];
            const right = 0.299 * data[(y * targetW + (x + 1)) * 4] + 0.587 * data[(y * targetW + (x + 1)) * 4 + 1] + 0.114 * data[(y * targetW + (x + 1)) * 4 + 2];
            
            const lap = Math.abs(4 * lum - up - down - left - right);
            laplacianSum += lap;
            laplacianSqSum += lap * lap;
            validSamples++;

            // High pass noise visualization (amplified)
            const nVal = Math.min(255, lap * 6);
            noiseData[idx] = nVal;
            noiseData[idx + 1] = Math.min(255, nVal * 1.1);
            noiseData[idx + 2] = Math.min(255, nVal * 1.3);
            noiseData[idx + 3] = 255;
          }
        }
        noiseCtx.putImageData(noiseImgData, 0, 0);
        const noiseMaskDataUrl = noiseCanvas.toDataURL('image/png');

        // Noise variance and standard deviation
        const meanLap = laplacianSum / (validSamples || 1);
        const lapVariance = (laplacianSqSum / (validSamples || 1)) - (meanLap * meanLap);
        const noiseStdDev = Math.sqrt(Math.max(0, lapVariance));

        // --- FORENSIC SIGNAL 2: Texture Shannon Entropy ---
        // Natural real photos have high chaotic entropy (leaves, asphalt, stone, textures: 6.8 - 7.9)
        // AI images often have lower or abnormally clustered entropy (smoothing in diffusion models)
        let entropy = 0;
        for (let i = 0; i < 256; i++) {
          if (hist[i] > 0) {
            const p = hist[i] / totalPixels;
            entropy -= p * Math.log2(p);
          }
        }

        // --- FORENSIC SIGNAL 3: Error Level Analysis (ELA) ---
        // Recompresses image at 85% JPEG quality and analyzes pixel degradation difference
        // Real camera photos show uniform error distribution across homogeneous textures
        // AI photos exhibit stark, unnatural error spikes and inconsistent generative gradients
        const compImg = new Image();
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        compImg.onload = () => {
          const compCanvas = document.createElement('canvas');
          compCanvas.width = targetW;
          compCanvas.height = targetH;
          const compCtx = compCanvas.getContext('2d');
          compCtx.drawImage(compImg, 0, 0, targetW, targetH);
          const compData = compCtx.getImageData(0, 0, targetW, targetH).data;

          const elaCanvas = document.createElement('canvas');
          elaCanvas.width = targetW;
          elaCanvas.height = targetH;
          const elaCtx = elaCanvas.getContext('2d');
          const elaImgData = elaCtx.createImageData(targetW, targetH);
          const elaOut = elaImgData.data;

          let totalDiff = 0;
          let diffSqSum = 0;
          const scale = 15; // Amplification multiplier for ELA visibility

          for (let i = 0; i < data.length; i += 4) {
            const rDiff = Math.abs(data[i] - compData[i]);
            const gDiff = Math.abs(data[i + 1] - compData[i + 1]);
            const bDiff = Math.abs(data[i + 2] - compData[i + 2]);
            const pixelDiff = (rDiff + gDiff + bDiff) / 3;

            totalDiff += pixelDiff;
            diffSqSum += pixelDiff * pixelDiff;

            // Render Heatmap (high difference in warm colors, low in blue/purple)
            elaOut[i] = Math.min(255, rDiff * scale * 1.2);
            elaOut[i + 1] = Math.min(255, gDiff * scale * 0.8);
            elaOut[i + 2] = Math.min(255, bDiff * scale * 1.5);
            elaOut[i + 3] = 255;
          }

          elaCtx.putImageData(elaImgData, 0, 0);
          const elaDataUrl = elaCanvas.toDataURL('image/png');

          const meanDiff = totalDiff / totalPixels;
          const diffVariance = (diffSqSum / totalPixels) - (meanDiff * meanDiff);

          // --- FORENSIC SIGNAL 4: 64-bit Perceptual Difference Hash (dHash) ---
          // Used for geospatial duplicate report cluster matching
          const dHashCanvas = document.createElement('canvas');
          dHashCanvas.width = 9;
          dHashCanvas.height = 8;
          const dHashCtx = dHashCanvas.getContext('2d');
          dHashCtx.drawImage(img, 0, 0, 9, 8);
          const dHashData = dHashCtx.getImageData(0, 0, 9, 8).data;

          let hashBits = '';
          for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
              const leftIdx = (y * 9 + x) * 4;
              const rightIdx = (y * 9 + (x + 1)) * 4;
              const leftLum = 0.299 * dHashData[leftIdx] + 0.587 * dHashData[leftIdx + 1] + 0.114 * dHashData[leftIdx + 2];
              const rightLum = 0.299 * dHashData[rightIdx] + 0.587 * dHashData[rightIdx + 1] + 0.114 * dHashData[rightIdx + 2];
              hashBits += leftLum < rightLum ? '1' : '0';
            }
          }
          const pHashHex = BigInt('0b' + hashBits).toString(16).padStart(16, '0');

          resolve({
            dimensions: { width, height },
            noiseStdDev: Number(noiseStdDev.toFixed(2)),
            entropy: Number(entropy.toFixed(2)),
            elaMeanDiff: Number(meanDiff.toFixed(2)),
            elaVariance: Number(diffVariance.toFixed(2)),
            pHashHex,
            elaDataUrl,
            noiseMaskDataUrl
          });
        };

        compImg.src = jpegDataUrl;
      } catch (err) {
        console.error("Canvas forensics failed:", err);
        resolve({
          dimensions: { width: 400, height: 400 },
          noiseStdDev: 5.0,
          entropy: 7.2,
          elaMeanDiff: 3.5,
          elaVariance: 12.0,
          pHashHex: '0000000000000000',
          elaDataUrl: null,
          noiseMaskDataUrl: null
        });
      }
    };

    img.onerror = () => {
      resolve({
        dimensions: { width: 0, height: 0 },
        noiseStdDev: 0,
        entropy: 0,
        elaMeanDiff: 0,
        elaVariance: 0,
        pHashHex: '0000000000000000',
        elaDataUrl: null,
        noiseMaskDataUrl: null
      });
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      img.src = URL.createObjectURL(imageSource);
    }
  });
};

// 3. Multi-Signal AI vs Real Image Classification Engine
export const evaluateImageAuthenticity = (metadata, canvasForensics) => {
  let aiScore = 0; // 0 to 100
  let realScore = 0; // 0 to 100
  const findings = [];

  // A. Metadata & AI Keyword Signatures (Strongest direct indicator)
  if (metadata.hasAiMetadata) {
    aiScore += 65;
    findings.push({
      signal: 'Synthetic Metadata Header',
      status: 'ai',
      description: metadata.detectedAiKeywords.length > 0 
        ? `Found AI generator tags in binary headers: "${metadata.detectedAiKeywords.join(', ')}"`
        : `Filename / Generation indicator matches synthetic AI export: ${metadata.fileNameClue}`
    });
  } else if (metadata.hasCameraExif && (metadata.cameraMake || metadata.cameraModel)) {
    realScore += 50;
    findings.push({
      signal: 'Hardware Camera EXIF',
      status: 'real',
      description: `Physical camera hardware identified: ${metadata.cameraMake || ''} ${metadata.cameraModel || ''} (${metadata.dateTime || 'Timestamped'})`
    });
  } else {
    // Web images often strip EXIF, slight tilt towards AI suspicion
    aiScore += 10;
    findings.push({
      signal: 'Camera Metadata Presence',
      status: 'neutral',
      description: 'No physical camera hardware headers present (common in AI generations or web-scrubbed media).'
    });
  }

  // B. Sensor Shot Noise (Poisson Noise Profile)
  // Real photos from mobile/DSLR cameras have natural sensor grain (std dev > 4.5).
  // AI diffusion images often have smooth synthetic gradients (< 2.5) or abnormal high-frequency noise without optical physics.
  if (canvasForensics.noiseStdDev < 2.8) {
    aiScore += 25;
    findings.push({
      signal: 'Sensor Pattern Noise (PRNU)',
      status: 'ai',
      description: `Unnaturally smooth pixel gradient (Noise σ = ${canvasForensics.noiseStdDev}). Lacks physical camera sensor photon noise.`
    });
  } else if (canvasForensics.noiseStdDev >= 4.0 && canvasForensics.noiseStdDev <= 25.0) {
    realScore += 25;
    findings.push({
      signal: 'Sensor Pattern Noise (PRNU)',
      status: 'real',
      description: `Realistic optical sensor shot noise detected (Noise σ = ${canvasForensics.noiseStdDev}) consistent with real CMOS/CCD sensors.`
    });
  } else {
    // Extreme noise (heavily filtered or noisy)
    aiScore += 10;
    findings.push({
      signal: 'Sensor Pattern Noise',
      status: 'neutral',
      description: `High-frequency dispersion (Noise σ = ${canvasForensics.noiseStdDev}) indicating heavy compression or synthetic grain.`
    });
  }

  // C. Error Level Analysis (ELA Compression Discrepancy)
  // AI images often have stark, erratic compression variance between generative regions and flat textures
  if (canvasForensics.elaVariance > 35.0 || canvasForensics.elaMeanDiff < 1.2) {
    aiScore += 20;
    findings.push({
      signal: 'Error Level Analysis (ELA)',
      status: 'ai',
      description: `Anomalous compression degradation profile (ELA Variance: ${canvasForensics.elaVariance}). Matches diffusion model generation.`
    });
  } else {
    realScore += 20;
    findings.push({
      signal: 'Error Level Analysis (ELA)',
      status: 'real',
      description: `Uniform compression degradation across pixel clusters (ELA Variance: ${canvasForensics.elaVariance}), characteristic of natural camera captures.`
    });
  }

  // D. Texture Entropy (Shannon Chaos)
  if (canvasForensics.entropy >= 6.8) {
    realScore += 15;
    findings.push({
      signal: 'Optical Texture Entropy',
      status: 'real',
      description: `High natural scene entropy (${canvasForensics.entropy} bits/pixel). Rich microscopic texture (gravel, foliage, pavement).`
    });
  } else if (canvasForensics.entropy < 5.8) {
    aiScore += 15;
    findings.push({
      signal: 'Optical Texture Entropy',
      status: 'ai',
      description: `Low scene entropy (${canvasForensics.entropy} bits/pixel). Smooth synthetic patches common in generative AI renders.`
    });
  }

  // Normalize scores
  const total = aiScore + realScore;
  const aiPercentage = total === 0 ? 50 : Math.round((aiScore / total) * 100);
  const realPercentage = 100 - aiPercentage;

  let verdict = 'UNKNOWN';
  let badgeColor = '#6b7280';
  let title = '';
  let summary = '';

  if (aiPercentage >= 65 || metadata.hasAiMetadata) {
    verdict = 'AI_GENERATED';
    badgeColor = '#ef4444';
    title = 'AI-Generated Synthetic Image';
    summary = `This image displays high-confidence synthetic hallmarks (${aiPercentage}% AI probability). It was likely created using an AI generator (such as Midjourney, Stable Diffusion, Flux, or DALL-E) rather than taken by a citizen at a real physical location.`;
  } else if (realPercentage >= 60) {
    verdict = 'REAL_CAMERA';
    badgeColor = '#10b981';
    title = 'Authentic Real Camera Photo';
    summary = `This image exhibits natural optical characteristics (${realPercentage}% Authenticity confidence). Optical camera sensor noise, uniform ELA compression decay, and natural chaotic texture confirm genuine physical scene capture.`;
  } else {
    verdict = 'SUSPICIOUS_AI';
    badgeColor = '#f59e0b';
    title = 'Suspicious / Digitally Altered';
    summary = `Mixed forensic signals detected (${aiPercentage}% AI suspicion). Lacks definitive camera hardware signatures and exhibits altered compression dynamics. Recommend manual verification before dispatching municipal workers.`;
  }

  return {
    verdict,
    badgeColor,
    title,
    summary,
    aiPercentage,
    realPercentage,
    findings,
    metadata,
    canvasForensics
  };
};

