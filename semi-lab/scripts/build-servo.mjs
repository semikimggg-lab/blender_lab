import {build} from 'esbuild';
await build({entryPoints:['src/servo/app.js'],outfile:'public/servo-app.js',bundle:true,minify:true,format:'esm',target:'es2022'});
