const paths={
 cube:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
 add:'<path d="m9 3 6 3.5v7L9 17l-6-3.5v-7L9 3Z"/><path d="m3 6.5 6 3.5 6-3.5M9 10v7M18 14v7m-3-3.5h6"/>',
 erase:'<path d="m4 12 8-8a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-7 7H9l-5-4a2 2 0 0 1 0-3Z"/><path d="m8 8 9 9M12 19h9"/>',
 orbit:'<ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-35 12 12)"/><path d="M12 3v3m0 12v3m-3-9h6"/>',
 undo:'<path d="M8 5 3 10l5 5M3 10h11a6 6 0 0 1 0 12" transform="translate(0 -2)"/>',
 redo:'<path d="m16 5 5 5-5 5m5-5H10a6 6 0 0 0 0 12" transform="translate(0 -2)"/>',
 home:'<path d="m3 11 9-8 9 8M6 9v11h12V9M10 20v-7h4v7"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-.9 1.2-.9 1.7M12 17h.01"/>',
 chevron:'<path d="m7 10 5 5 5-5"/>',
 grid:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18m6-18v18M3 9h18M3 15h18"/>',
 trash:'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
 check:'<path d="m5 12 4 4 10-10"/>',
 save:'<path d="M5 3h12l3 3v15H4V3h1ZM8 3v6h8V3M8 21v-8h8v8"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 book:'<path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
};
export const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.cube}</svg>`;
export function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
