
export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface PhotoField {
  id: string;
  label: string;
  position: Position;
  dimensions: Dimensions;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
}

export interface TextField {
  id: string;
  label: string;
  placeholder: string;
  position: Position;
  fontSize: number;
  color: string;
  textBackgroundColor: string;
  fontWeight: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  width: number;
}

export interface Template {
  id: string;
  name: string;
  backgroundImage: string;
  backgroundMode: 'contain' | 'stretch' | 'cover';
  canvasDimensions: Dimensions;
  photoFields: PhotoField[];
  textFields: TextField[];
  isActive: boolean;
}

export interface AppSettings {
  siteLogo: string;
  siteName: string;
  adminPassword: string;
}
