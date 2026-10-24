import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import {Proof} from './Proof';
export function renderProof(){return renderToString(<StrictMode><Proof /></StrictMode>);}
export {Proof};
