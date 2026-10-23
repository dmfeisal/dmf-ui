import { fileURLToPath } from 'node:url';
import { runBrowserSuite } from './dmf-ui-browser/runner.mjs';
await runBrowserSuite({root:fileURLToPath(new URL('../',import.meta.url)),buildDir:process.env.DMF_UI_AUDIT_BUILD,scenarios:['accessibility'],taskName:process.env.DMF_UI_TEST_TASK||'dmf-ui-accessibility',spaceId:process.env.DMF_UI_TEST_SPACE_ID?Number(process.env.DMF_UI_TEST_SPACE_ID):null});
