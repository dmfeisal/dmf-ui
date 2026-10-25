export function setModalOpen(root:HTMLElement,open:boolean){
 if(!root.hasAttribute('data-dmf-modal-root'))throw new Error('Expected a Sheet or AlertDialog root.');
 root.dispatchEvent(new CustomEvent('dialog:set',{detail:{open}}));
}
