// scripts/phi3-service.js

// ←– Change to match your actual ngrok domain
export const PHI3_API_URL = "https://53ab-34-143-170-251.ngrok-free.app/analyze";

export async function analyzeWithPhi3(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(PHI3_API_URL, {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) {
    throw new Error(`Phi-3 API Error: ${response.status}`);
  }
  return response.json();  
}
