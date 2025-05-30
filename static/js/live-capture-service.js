// scripts/live-capture-service.js

// 1. Camera Control Functions
export async function startCamera(videoEl) {
    try {
        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoEl.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            videoEl.onloadedmetadata = resolve;
        });
        
        return stream;
    } catch (error) {
        console.error('Camera Error:', error);
        throw new Error(`Camera access failed: ${error.message}`);
    }
}

export function stopCamera(stream) {
    if (!stream) return;
    stream.getTracks().forEach(track => track.stop());
}

// 2. Frame Capture Function
export function captureFrame(videoEl, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoEl, 0, 0);
        
        canvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            quality
        );
    });
}

// 3. Analysis Function (Matches your Flask endpoint)
export async function analyzeLive(blob) {
  const LIVE_API = "https://53ab-34-143-170-251.ngrok-free.app/acne/live"; // Update this!
  try {
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');

    const response = await fetch(LIVE_API, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

// 4. Combined Capture+Analyze Function (for convenience)
export async function captureAndAnalyze(videoEl) {
    const blob = await captureFrame(videoEl);
    return await analyzeLive(blob);
}

