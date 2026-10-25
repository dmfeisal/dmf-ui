import type {House} from '@lucide/astro';
export type NavigationIcon=typeof House;
export type Presentation='label'|'icon-label'|'icon';
export type NavigationItem={label:string;href:string;icon?:NavigationIcon;current?:boolean;disabled?:boolean;rel?:'prev'|'next'};
