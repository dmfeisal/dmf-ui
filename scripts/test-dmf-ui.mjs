import { fileURLToPath } from 'node:url';
import { runBrowserSuite } from './dmf-ui-browser/runner.mjs';
await runBrowserSuite({
  root:fileURLToPath(new URL('../',import.meta.url)),
  scenarios:['pilot','tabs','forms','switch','select','selection-contract','overlays','disclosures','content'],
  taskName:process.env.DMF_UI_TEST_TASK||'dmf-ui-source-quality',
  spaceId:process.env.DMF_UI_TEST_SPACE_ID?Number(process.env.DMF_UI_TEST_SPACE_ID):null,
});
