import './style.css';

import {
  SvgElementWithHTML,
  convertImageDataToURL,
  rgbToHexString,
  setupZoomElementAttributes,
  updateElementStyles,
  updateTextContent
} from './utils';

const initialize = () => {
  const image = new Image();
  image.src = '/src/assets/palm-trees.jpg';
  const convertImage = convertImageDataToURL();

  let isPickerActive = false;

  const zoomElement = document.getElementById('zoom-svg') as SvgElementWithHTML;
  const zoomTextElement = zoomElement.querySelector('text') as SVGTextElement;
  const zoomPatternImage = zoomElement.querySelector('pattern image') as SVGImageElement;
  const zoomOuterRing = zoomElement.querySelector('circle.outer-ring') as SVGCircleElement;
  const zoomRectElement = zoomElement.querySelector('rect') as SVGRectElement;

  const headerElement = document.getElementById('color-dropper-header') as HTMLElement;
  const canvasElement = document.getElementById('drawing-canvas') as HTMLCanvasElement;
  const canvasContext = canvasElement.getContext('2d', { willReadFrequently: true });

  const hexTextElement = headerElement.querySelector('div.color-hex-text') as HTMLDivElement;
  const pickerButton = headerElement.querySelector('button.picker-button') as HTMLButtonElement;

  const { width: zoomWidth, height: zoomHeight } = zoomElement.getBoundingClientRect();
  const { width: zoomTextWidth, height: zoomTextHeight } = zoomTextElement.getBoundingClientRect();
  const headerHeight = headerElement.getBoundingClientRect().height;

  const zoomFactor = 5;
  const cropWidth = zoomWidth / zoomFactor;
  const cropHeight = zoomHeight / zoomFactor;

  setupZoomElementAttributes(
    zoomPatternImage,
    zoomRectElement,
    zoomTextElement,
    zoomWidth,
    zoomHeight,
    zoomFactor,
    zoomTextWidth,
    zoomTextHeight
  );

  const togglePicker = () => {
    isPickerActive = !isPickerActive;
    pickerButton.classList.toggle('active', isPickerActive);
  };

  const showElements = () => {
    if (isPickerActive) {
      hexTextElement.style.visibility = 'visible';
      zoomElement.style.visibility = 'visible';
      canvasElement.style.cursor = 'none';
    }
  };

  const hideElements = () => {
    if (isPickerActive) {
      hexTextElement.style.visibility = 'hidden';
      zoomElement.style.visibility = 'hidden';
      canvasElement.style.cursor = 'auto';
    }
  };

  const updateZoom = (e: MouseEvent) => {
    if (!isPickerActive) return;

    const { offsetX, offsetY } = e;

    const getZoomedImageData = () => {
      return canvasContext!.getImageData(
        offsetX - cropWidth / 2,
        offsetY - cropHeight / 2,
        cropWidth,
        cropHeight
      );
    };

    const getPixelColor = () => {
      const pixelData = canvasContext!.getImageData(offsetX, offsetY, 1, 1).data;
      return rgbToHexString(pixelData[0], pixelData[1], pixelData[2]);
    };

    const updateZoomElement = (zoomURL: string, color: string) => {
      zoomPatternImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', zoomURL);

      zoomOuterRing.setAttribute('fill', color);

      const zoomTop = `${offsetY - zoomHeight / 2}px`;
      const zoomLeft = `${offsetX - zoomWidth / 2}px`;
      updateElementStyles(zoomElement, zoomTop, zoomLeft);
      updateTextContent(hexTextElement, zoomTextElement, zoomRectElement, color);
    };

    requestAnimationFrame(() => {
      const imageData = getZoomedImageData();
      const color = getPixelColor();
      const zoomURL = convertImage(imageData);
      updateZoomElement(zoomURL, color);
    });
  };

  const copyColorCode = () => {
    if (isPickerActive) {
      navigator.clipboard.writeText(zoomTextElement.textContent || '');
    }
  };

  image.onload = function () {
    if (!canvasContext) return;

    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight - headerHeight;

    canvasContext.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);

    pickerButton.onclick = function () {
      togglePicker();
    };

    canvasElement.onmouseenter = function () {
      showElements();
    };

    canvasElement.onmouseout = function () {
      hideElements();
    };

    canvasElement.onmousemove = function (event) {
      updateZoom(event);
    };

    canvasElement.onclick = function (event) {
      copyColorCode();
    };
  };
};

window.addEventListener('DOMContentLoaded', initialize);
