export interface PixelArtLayer {
  src: string;
  alt: string;
}

export interface PixelCardArt {
  background: PixelArtLayer;
  foreground: PixelArtLayer;
  overlay?: PixelArtLayer;
  frame?: PixelArtLayer;
}
