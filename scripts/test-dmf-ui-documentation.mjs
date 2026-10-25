import {fileURLToPath} from 'node:url';
import {runBrowserSuite} from './dmf-ui-browser/runner.mjs';
await runBrowserSuite({root:fileURLToPath(new URL('../',import.meta.url)),scenarios:['documentation','create','content-docs','search'],taskName:process.env.DMF_UI_TEST_TASK||'dmf-ui-documentation',spaceId:process.env.DMF_UI_TEST_SPACE_ID?Number(process.env.DMF_UI_TEST_SPACE_ID):null});
