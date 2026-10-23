import { fileURLToPath } from 'node:url';
import { runBrowserSuite } from './dmf-ui-browser/runner.mjs';
await runBrowserSuite({root:fileURLToPath(new URL('../',import.meta.url)),buildDir:fileURLToPath(new URL('../.dmf-ui-test-results/navigation-dist/',import.meta.url)),scenarios:['navigation'],taskName:process.env.DMF_UI_TEST_TASK||'dmf-ui-navigation',spaceId:process.env.DMF_UI_TEST_SPACE_ID?Number(process.env.DMF_UI_TEST_SPACE_ID):null});
