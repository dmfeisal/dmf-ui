import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[tailwindcss()],build:{manifest:true,rolldownOptions:{input:['reset.html','index.html','authentication.html','sign-in.html','hero.html','listing.html','card.html','discovery.html']}}});
