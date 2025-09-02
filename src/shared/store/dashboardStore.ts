import { atom } from 'jotai';

export type Theme = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';
export type Language = 'ko' | 'en';

export const themeAtom = atom<Theme>('light');
export const fontSizeAtom = atom<FontSize>('small');
export const languageAtom = atom<Language>('ko');
export const selectedSiteAtom = atom<string>('');