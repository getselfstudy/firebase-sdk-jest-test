import React from 'react';
import '../src/scss/react-ui.scss';
import Patterns from '../src/lib/util/Patterns';

export const parameters = {
  themes: {
    default: 'light',
    target: 'html',
    icon: 'contrast',
    list: [
      { name: 'light', class: 'light' },
      { name: 'dark', class: 'dark' },
      { name: 'custom-light', class: ['custom', 'light'] },
      { name: 'custom-dark', class: ['custom', 'dark'] },
      { name: 'high-contrast', class: 'hc' },
    ],
  },
  theme: {
    default: 'light',
    selector: 'body',
    icon: 'expandalt',
    onChange(theme) {
      // handle new theme
    },
    themes: [
      {
        id: 'ss-fs-85p',
        title: 'Font Size 85%',
        class: 'ss-fs-85p',
        color: '#000',
      },
      {
        id: 'ss-fs-100p',
        title: 'Font Size 100%',
        class: 'ss-fs-100p',
        color: '#000',
      },
      {
        id: 'ss-fs-115p',
        title: 'Font Size 115%',
        class: 'ss-fs-115p',
        color: '#000',
      },
      {
        id: 'ss-fs-130p',
        title: 'Font Size 130%',
        class: 'ss-fs-130p',
        color: '#000',
      },
      {
        id: 'ss-fs-145p',
        title: 'Font Size 145%',
        class: 'ss-fs-145p',
        color: '#000',
      },
      {
        id: 'ss-fs-160p',
        title: 'Font Size 160%',
        class: 'ss-fs-160p',
        color: '#000',
      },
      {
        id: 'ss-fs-175p',
        title: 'Font Size 175%',
        class: 'ss-fs-175p',
        color: '#000',
      },
    ],
  },
};

export const decorators = [
  (Story) => (
    <div>
      <Patterns />
      <Story />
    </div>
  ),
];
