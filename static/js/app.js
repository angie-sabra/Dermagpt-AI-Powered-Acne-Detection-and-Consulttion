// scripts/app.js

import { elements } from "./dom-elements.js";
import {
  setupDragAndDrop,
  createFileHandler,
  handleTextAnalysis,
  handleAcneDetection
} from "./event-handlers.js";

import {
  startCamera,
  stopCamera,
  captureFrame,
  analyzeLive
} from "./live-capture-service.js";

document.addEventListener("DOMContentLoaded", () => {
  // ——————————————
  // Text Analysis Upload
  // ——————————————
  const textHandler = createFileHandler(
    elements.textPreviewImage,
    elements.textUploadArea,
    elements.textPreviewContainer
  );
  elements.browseTextBtn.onclick = () => elements.textFileInput.click();
  elements.textFileInput.onchange = (e) => textHandler(e.target.files[0]);
  elements.processTextBtn.onclick = () => {
    if (elements.textFileInput.files.length)
      handleTextAnalysis(elements.textFileInput.files[0]);
  };
  elements.retakeTextBtn.onclick = () => {
    elements.textFileInput.value = "";
    elements.textUploadArea.style.display = "block";
    elements.textPreviewContainer.style.display = "none";
    elements.textResults.style.display = "none";
  };
  setupDragAndDrop(elements.textUploadArea, textHandler);

  // ——————————————
  // Acne Detection Upload
  // ——————————————
  const acneHandler = createFileHandler(
    elements.acnePreviewImage,
    elements.imageUploadArea,
    elements.imagePreviewContainer
  );
  elements.browseImageBtn.onclick = () => elements.imageFileInput.click();
  elements.imageFileInput.onchange = (e) => acneHandler(e.target.files[0]);
  elements.processImageBtn.onclick = () => {
    if (elements.imageFileInput.files.length)
      handleAcneDetection(elements.imageFileInput.files[0]);
  };
  elements.retakeImageBtn.onclick = () => {
    elements.imageFileInput.value = "";
    elements.imageUploadArea.style.display = "block";
    elements.imagePreviewContainer.style.display = "none";
    elements.imageResults.style.display = "none";
  };
  setupDragAndDrop(elements.imageUploadArea, acneHandler);

  // ——————————————
  // Live Capture
  // ——————————————
  let stream = null;

  elements.startLiveBtn.onclick = async () => {
    // hide previous results
    elements.loadingIndicator.style.display = "none";
    elements.liveFullFrame.style.display = "none";
    elements.liveResults.style.display = "none";

    // show the video preview
    elements.startLiveBtn.style.display = "none";
    elements.liveContainer.style.display = "block";

    try {
      stream = await startCamera(elements.video);
    } catch (err) {
      console.error("Camera start failed:", err);
      elements.startLiveBtn.style.display = "block";
      elements.liveContainer.style.display = "none";
    }
  };
elements.captureBtn.onclick = async () => {
  elements.loadingIndicator.style.display = "block";
  elements.liveResultsContainer.style.display = "none";

  try {
    const blob = await captureFrame(elements.video);
    const data = await analyzeLive(blob);
    console.log("API Response:", data);

    if (stream) stopCamera(stream);
    elements.liveContainer.style.display = "none";
 

    // ✅ Show full image
    if (!data.full_frame) throw new Error("No full_frame in response");
    elements.mainLiveImage.src = `data:image/jpeg;base64,${data.full_frame}`;
    elements.liveFullFrame.style.display = "block"; // 🔧 ADD
    elements.liveResults.style.display = "block";   // 🔧 ADD

    // ✅ Show regions
    const regions = data.regions || {};
    const anatomicalOrder = [
      "forehead", "right-eye", "right-cheek",
      "left-eye", "left-cheek", "between-eyes",
      "nose", "mouth", "chin"
    ];

    elements.liveGrid.innerHTML = anatomicalOrder.map(region => {
      const regionData = regions[region];
      return `
        <div class="region-card">
          ${regionData ? `
            <img src="data:image/jpeg;base64,${regionData.annotation_b64}" alt="${region}">
            <p>${region.replace("-", " ")}<br><strong>${regionData.severity}</strong></p>
          ` : `
            <div class="missing-region">Not detected</div>
            <p>${region.replace("-", " ")}<br><strong>N/A</strong></p>
          `}
        </div>
      `;
    }).join("");

    elements.liveResultsContainer.style.display = "block";
  } catch (error) {
    console.error("Error:", error);
    alert(`Analysis failed: ${error.message}`);
  } finally {
    elements.loadingIndicator.style.display = "none";
  }
};
elements.retakeLiveBtn.onclick = () => {
    // Hide results and show camera again
    elements.liveResultsContainer.style.display = "none";
    elements.liveContainer.style.display = "block";
    elements.startLiveBtn.style.display = "none";
    
    // Restart the camera
    startCamera(elements.video).then(newStream => {
        stream = newStream;
    }).catch(err => {
        console.error("Camera restart failed:", err);
        elements.startLiveBtn.style.display = "block";
        elements.liveContainer.style.display = "none";
    });
};
  // — Help
  elements.helpBtn.onclick = () => {
    alert("Help:\n1) Text: upload\n2) Acne: upload\n3) Live: webcam capture");
  };
});
