import {renderToString} from 'react-dom/server';
import {DiscoveryExample} from './discovery';
import type {DiscoveryAssets} from './discovery';
export function renderDiscovery(assets:DiscoveryAssets){return renderToString(<DiscoveryExample assets={assets}/>);}
