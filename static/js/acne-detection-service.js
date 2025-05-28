// scripts/acne-detection-service.js


const ACNE_DETECTION_API_URL = "https://8cc9-35-187-249-145.ngrok-free.app/acne";

export async function detectAcne(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const resp = await fetch(ACNE_DETECTION_API_URL, {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
  });
  if (!resp.ok) throw new Error(`Acne API Error ${resp.status}`);
  return resp.json();  
  // returns: { "forehead":{severity,annotation_base64}, ..., "chin":{…} }
}

