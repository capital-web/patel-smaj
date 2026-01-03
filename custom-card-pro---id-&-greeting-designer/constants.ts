
import { Template, AppSettings } from './types';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  siteLogo: 'https://picsum.photos/id/1/200/200',
  siteName: 'CardDesign Pro',
  adminPassword: 'admin123'
};

export const DEFAULT_TEMPLATE: Template = {
  id: 'default-1',
  name: 'Modern ID Card',
  backgroundImage: 'https://picsum.photos/id/10/1200/800',
  backgroundMode: 'stretch',
  canvasDimensions: { width: 1200, height: 800 },
  isActive: true,
  photoFields: [
    {
      id: 'photo-1',
      label: 'Your Photograph',
      position: { x: 510, y: 140 },
      dimensions: { width: 180, height: 180 },
      borderRadius: 90,
      borderColor: '#ffffff',
      borderWidth: 4,
    }
  ],
  textFields: [
    {
      id: 'text-1',
      label: 'Candidate Full Name',
      placeholder: 'Enter full name here',
      position: { x: 400, y: 350 },
      width: 400,
      fontSize: 32,
      color: '#333333',
      textBackgroundColor: 'transparent',
      fontWeight: '700',
      fontFamily: 'Inter',
      textAlign: 'center',
    }
  ],
};

export const ADMIN_URL_SLUG = 'secret-admin-portal';

export const FONT_OPTIONS = [
  'Inter',
  'Playfair Display',
  'Roboto Mono',
  'Arial',
  'Georgia',
  'Verdana'
];
