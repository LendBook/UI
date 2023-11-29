declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.webp";
declare module "*.mov";


interface IPropsOfComponent {
    className?: string;
    children?: ReactNode | string;
    [key: string]: any;
}

// global.d.ts
interface Window {
    dataLayer: any[];
}


declare module 'react-notifications';