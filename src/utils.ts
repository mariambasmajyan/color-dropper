export type SvgElementWithHTML = HTMLElement & SVGElement;

const toHex = (color: number) => color.toString(16).padStart(2, '0').toUpperCase();

export const rgbToHexString = (r: number, g: number, b: number): string => {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const convertImageDataToURL = (): ((imageData: ImageData) => string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  return (imageData: ImageData) => {
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };
};

export const setupZoomElementAttributes = (
  zoomImageElement: SVGImageElement,
  zoomRectElement: SVGRectElement,
  zoomTextElement: SVGTextElement,
  zoomWidth: number,
  zoomHeight: number,
  zoomFactor: number,
  zoomTextWidth: number,
  zoomTextHeight: number
) => {
  zoomImageElement.setAttribute('width', `${zoomWidth}px`);
  zoomImageElement.setAttribute('height', `${zoomHeight}px`);

  zoomRectElement.setAttribute('width', zoomFactor.toString());
  zoomRectElement.setAttribute('height', zoomFactor.toString());
  zoomRectElement.setAttribute('x', (zoomWidth / 2 - zoomFactor / 2).toString());
  zoomRectElement.setAttribute('y', (zoomHeight / 2 - zoomFactor / 2).toString());

  zoomTextElement.setAttribute('x', (zoomWidth / 2 - zoomTextWidth / 2).toString());
  zoomTextElement.setAttribute(
    'y',
    (zoomHeight / 2 + (zoomTextHeight + zoomTextHeight / 2)).toString()
  );
};

export const updateElementStyles = (element: HTMLElement, top: string, left: string) => {
  element.style.top = top;
  element.style.left = left;
};

export const updateTextContent = (
  hexTextElement: HTMLElement,
  zoomTextElement: SVGTextElement,
  zoomRingElement: SVGPathElement,
  color: string
) => {
  hexTextElement.innerHTML = color;
  zoomTextElement.innerHTML = color;
  zoomRingElement.setAttribute('fill', color);
};
