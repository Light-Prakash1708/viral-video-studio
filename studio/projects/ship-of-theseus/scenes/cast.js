// cast.js: one signature colour per recurring character.
export const THESEUS = { top: 'tshirt', color: '#d64a33', head: 'curly' };                     // the hero: red tunic
export const WRIGHT = { top: 'tshirt', color: '#3a6ea5', head: 'headband', headColor: '#f2c21a' }; // shipwright: blue tee, gold headband
export const PLUTARCH = { top: 'labcoat', head: 'none' };                                        // the writer: white robe
export const PHIL_A = { top: 'tshirt', color: '#3fb950', head: 'none' };                         // "same ship" philosopher
export const PHIL_B = { top: 'tshirt', color: '#f29ac0', head: 'bun' };                          // "new ship" philosopher
export const HOBBES = { top: 'trench', head: 'none' };                                           // Thomas Hobbes: dark coat
export const YOU = { top: 'hoodie', color: '#8a5ad6', head: 'none' };                            // the viewer: purple hoodie
export const YOU_KID = { ...YOU, kid: true };
export const CAST = [THESEUS, WRIGHT, PLUTARCH, HOBBES, YOU];
