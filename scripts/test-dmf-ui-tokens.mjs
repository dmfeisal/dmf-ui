import {fileURLToPath} from 'node:url';
import {runBrowserSuite} from './dmf-ui-browser/runner.mjs';
await runBrowserSuite({root:fileURLToPath(new URL('../',import.meta.url)),scenarios:['tokens'],taskName:process.env.DMF_UI_TEST_TASK||'dmf-ui-portable-tokens',spaceId:process.env.DMF_UI_TEST_SPACE_ID?Number(process.env.DMF_UI_TEST_SPACE_ID):null});
