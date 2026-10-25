import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
 site:"https://ui.feisal.id",
 output:"static",
 integrations:[{
  name:'dmf-ui-command-cache',
  hooks:{'astro:config:setup':({command,updateConfig})=>{
   // Astro check/build must not replace a running dev server's optimized modules.
   updateConfig({vite:{cacheDir:fileURLToPath(new URL(`./node_modules/.vite/dmf-ui-${command}/`,import.meta.url))}});
  }},
 }],
 vite:{
  plugins:[tailwindcss()],
  optimizeDeps:{include:[
   '@data-slot/accordion','@data-slot/dialog','@data-slot/dropdown-menu',
   '@data-slot/popover','@data-slot/radio-group','@data-slot/select',
   '@data-slot/switch','@data-slot/tabs','@data-slot/toast','@data-slot/tooltip',
  ]},
 },
});
