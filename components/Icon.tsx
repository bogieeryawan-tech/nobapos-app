import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const ICONS: { [key: string]: React.ReactNode } = {
  logo: (
    <>
      <path fill="#f9a602" d="M0 0h24v24H0z"/>
      <path fill="#212121" d="M-1 7c2-1 5-2 8-1s4 4 2 7l3-4 4 2-2 2c4 2 7 5 8 9v4H6c-1-1-3-3 0-5s7-2 10 0c-3 2-8 5-11 4-5-1-4-5-1-8-1-3-3-4-1-6z"/>
      <path fill="#dd2e44" d="M16 19c-1-2 2-2 4-1 1-1 4-1 4 1-1 2-4 2-4-1z"/>
      <path fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" d="M13 2l4 4-2 1 5 4"/>
    </>
  ),
  'alert-triangle': <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" />,
  backspace: <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 002-2zM18 9l-6 6M12 9l6 6" />,
  brain: <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 .5.83l2.5 1.67a1 1 0 0 1 .5 1.5v.3a1 1 0 0 0 .5.83l2.5 1.67a1 1 0 0 1 .5 1.5v.3a1 1 0 0 0 .5.83l2.5 1.67a1 1 0 0 1 0 1.66l-2.5 1.67a1 1 0 0 0-.5.83v.3a1 1 0 0 1-.5 1.5l-2.5 1.67a1 1 0 0 0-.5.83v1.2A2.5 2.5 0 0 1 12 22a2.5 2.5 0 0 1-2.5-2.5v-1.2a1 1 0 0 0-.5-.83l-2.5-1.67a1 1 0 0 1-.5-1.5v-.3a1 1 0 0 0-.5-.83l-2.5-1.67a1 1 0 0 1 0-1.66l2.5-1.67a1 1 0 0 0 .5-.83v-.3a1 1 0 0 1 .5-1.5l2.5-1.67a1 1 0 0 0 .5-.83V4.5A2.5 2.5 0 0 1 9.5 2z" /></>,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>,
  cash: <path d="M2 6h20v12H2zm2 2h4v2H4zm0 4h4v2H4zm6 0h10v2H10z" />,
  'chart-pie': <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>,
  checkmark: <path d="M20 6L9 17l-5-5" />,
  'clipboard-check': <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></>,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  credit_card: <path d="M22 10v10H2V10M2 6h20v2H2z" />,
  dana: <><path d="M12 2l9 4.9V17l-9 5-9-5V6.9L12 2z" /><path d="M12 22v-6.5" /><path d="M21 17l-9-5-9 5" /><path d="M3 7l9 5 9-5" /><path d="M12 12l6-3-6-4-6 4 6 3z"/></>,
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  'file-minus': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></>,
  'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></>,
  gopay: <><circle cx="12" cy="12" r="10" /><path d="M16 8h-2.4a2 2 0 1 0-4 4H16v4h-4v-3" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></>,
  loader: <path d="M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3z" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />,
  menu: <path d="M3 12h18M3 6h18M3 18h18" />,
  mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></>,
  'mic-off': <><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></>,
  minus: <path d="M5 12h14" />,
  ovo: <><circle cx="12" cy="12" r="10"/><path d="M7 12a5 5 0 0 1 10 0v-2a3 3 0 0 0 -6 0v2"/></>,
  plus: <path d="M12 5v14m-7-7h14" />,
  printer: <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />,
  qris: <><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" /></>,
  robot: <path d="M12 8V4H8v4H5v12h14V8h-7zM2 8h2v12H2zm20 0h-2v12h2zM8 12h8" />,
  'shopping-cart': <><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></>,
  suggestion: <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />,
  trash: <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
};

const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {ICONS[name] || null}
    </svg>
  );
};

export default Icon;