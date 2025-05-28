// scripts/event-handlers.js

import { elements } from "./dom-elements.js";
import { analyzeWithPhi3 } from "./phi3-service.js";
import { detectAcne } from "./acne-detection-service.js";

// Upload utilities (unchanged)
export function setupDragAndDrop(element, callback) {
  ["dragenter","dragover","dragleave","drop"].forEach((ev) => {
    element.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); });
  });
  ["dragenter","dragover"].forEach((ev) =>
    element.addEventListener(ev, () => element.classList.add("highlight"))
  );
  ["dragleave","drop"].forEach((ev) =>
    element.addEventListener(ev, () => element.classList.remove("highlight"))
  );
  element.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) callback(file);
  });
}

export function createFileHandler(previewEl, uploadArea, previewContainer) {
  return (file) => {
    if (!file.type.startsWith("image/")) { alert("Please upload an image"); return; }
    if (file.size > 5e6) { alert("Max 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewEl.src = e.target.result;
      uploadArea.style.display       = "none";
      previewContainer.style.display = "flex";
    };
    reader.readAsDataURL(file);
    return file;
  };
}

export async function handleTextAnalysis(file) {
  elements.loadingIndicator.style.display = "block";
  elements.textResults.style.display      = "none";
  elements.processTextBtn.disabled        = true;
  elements.processTextBtn.innerHTML       = '<i class="fas fa-spinner fa-spin"></i> Analyzing…';

  try {
    const { analysis } = await analyzeWithPhi3(file);
    elements.textOutput.innerHTML = (analysis||"")
      .replace(/\n/g,"<br>")
      .replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
      .replace(/\*(.*?)\*/g,"<em>$1</em>");
    elements.textResults.style.display = "block";
  } catch (e) {
    elements.textOutput.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>${e.message}</p></div>`;
    elements.textResults.style.display = "block";
  } finally {
    elements.loadingIndicator.style.display = "none";
    elements.processTextBtn.disabled        = false;
    elements.processTextBtn.innerHTML       = '<i class="fas fa-file-alt"></i> Get Text Analysis';
  }
}

export async function handleAcneDetection(file) {
  const container = document.getElementById("marked-images-container");
  container.innerHTML = "";
  elements.loadingIndicator.style.display = "block";
  elements.imageResults.style.display      = "none";

  try {
    const regions = await detectAcne(file);
    Object.entries(regions).forEach(([region, {annotation_base64, severity}]) => {
      const fig = document.createElement("figure");
      fig.innerHTML = `
        <img src="data:image/jpeg;base64,${annotation_base64}" alt="${region}">
        <figcaption>${region}: ${severity}</figcaption>`;
      container.appendChild(fig);
    });
    elements.imageResults.style.display = "block";
  } catch (e) {
    console.error(e);
    elements.imageResults.style.display = "block";
  } finally {
    elements.loadingIndicator.style.display = "none";
  }
}
