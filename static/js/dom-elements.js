// scripts/dom-elements.js
export const elements = {
    // Text Analysis Model (Phi-3)
    textUploadArea: document.getElementById('text-upload-area'),
    textFileInput: document.getElementById('text-file-input'),
    browseTextBtn: document.getElementById('browse-text-btn'),
    textPreviewContainer: document.getElementById('text-preview-container'),
    textPreviewImage: document.getElementById('image-preview'),
    retakeTextBtn: document.getElementById('retake-text-btn'),
    processTextBtn: document.getElementById('process-text-btn'),
    textResults: document.getElementById('text-results'),
    textOutput: document.getElementById('text-output'),

    // Acne Detection Model (Custom)
    imageUploadArea: document.getElementById('image-upload-area'),
    imageFileInput: document.getElementById('image-file-input'),
    browseImageBtn: document.getElementById('browse-image-btn'),
    imagePreviewContainer: document.getElementById('image-preview-container'),
    acnePreviewImage: document.getElementById('image-preview-2'),
    retakeImageBtn: document.getElementById('retake-image-btn'),
    processImageBtn: document.getElementById('process-image-btn'),
    imageResults: document.getElementById('image-results'),
    markedImage: document.getElementById('marked-image'),

startLiveBtn: document.getElementById('start-live-btn'),
  liveContainer: document.getElementById('live-container'),
  video: document.getElementById('video'),
  cancelLiveBtn: document.getElementById('cancel-live-btn'),
  captureBtn: document.getElementById('capture-btn'),
  loadingIndicator: document.getElementById('loading-indicator'),
  liveFullFrame: document.getElementById('live-full-frame'),
  mainLiveImage: document.getElementById('main-live-image'),
  liveGrid: document.getElementById('live-grid'),
  liveResults: document.getElementById('live-results'),
  liveResultsContainer: document.getElementById('live-results-container'),

retakeLiveBtn: document.getElementById('retake-live-btn'),
 livePhiAnalysis: document.getElementById("live-phi-analysis"),
  phiAnalysisOutput: document.getElementById("phi-analysis-output"),
  // Common
  loadingIndicator:  document.getElementById("loading-indicator"),
  helpBtn:           document.querySelector(".help-btn"),
  // …
};

