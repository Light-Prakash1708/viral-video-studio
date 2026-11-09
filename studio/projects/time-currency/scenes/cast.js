// cast.js: one signature colour per character.
export const RICH = { top: 'suit', color: '#14141c', color2: '#c9a24a', head: 'none', face: 'sunglasses' };   // the billionaire: black suit, gold
export const POOR = { top: 'hoodie', color: '#5a6470', head: 'beanie', headColor: '#3a6ea5' };              // the poor man: grey hoodie, blue beanie
export const MOTHER = { top: 'dress', color: '#b8402f', head: 'bun' };                                       // mother: red dress
export const SON = { top: 'tshirt', color: '#f2c21a', head: 'none', kid: true };                            // son: yellow tee
export const THIEF = { top: 'trench', head: 'hood' };
export const YOU = { top: 'hoodie', color: '#8a5ad6', head: 'none' };                                       // the viewer
export const CAST = [RICH, POOR, MOTHER, SON, YOU];
