import {searchEntries} from '../data/search-index';

// One cached file for every page; DocumentationLayout points the search dialog at it.
export const GET=()=>new Response(JSON.stringify(searchEntries),{headers:{'Content-Type':'application/json; charset=utf-8'}});
