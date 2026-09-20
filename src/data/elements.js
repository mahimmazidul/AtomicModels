// Element data for the Atomic Model Explorer.
//
// Fields:
//   z      : atomic number (number of protons in a neutral atom)
//   sym    : element symbol
//   name   : element name
//   mass   : standard atomic weight (IUPAC, 2021 values where available).
//            For elements with no stable isotope, the value is the mass number
//            of the most-studied / longest-lived isotope, shown in [brackets].
//            This field is for DISPLAY ONLY and is never used to derive neutrons.
//   iso    : representative isotope mass number, chosen explicitly so that a
//            neutron count can be shown WITHOUT rounding `mass`. Always labelled
//            as an explicit isotope in the UI.
//   config : ground-state electron configuration in IUPAC shorthand notation,
//            including the well-known anomalous ground states
//            (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au, Ac, Th, Pa,
//             U, Np, Cm, Lr).
//   cat    : chemical category, used for restrained colour theming.
//
// Data sources: IUPAC standard atomic weights (https://iupac.org/what-we-do/
// periodic-table-of-elements/) and standard ground-state electron configurations.

export const ELEMENTS = [
  { z: 1,   sym: 'H',  name: 'Hydrogen',   mass: '1.008',   iso: 1,   config: '1s1',                                cat: 'nonmetal' },
  { z: 2,   sym: 'He', name: 'Helium',     mass: '4.0026',  iso: 4,   config: '1s2',                                cat: 'noble' },
  { z: 3,   sym: 'Li', name: 'Lithium',    mass: '6.94',    iso: 7,   config: '[He] 2s1',                          cat: 'alkali' },
  { z: 4,   sym: 'Be', name: 'Beryllium',  mass: '9.0122',  iso: 9,   config: '[He] 2s2',                          cat: 'alkaline' },
  { z: 5,   sym: 'B',  name: 'Boron',      mass: '10.81',   iso: 11,  config: '[He] 2s2 2p1',                      cat: 'metalloid' },
  { z: 6,   sym: 'C',  name: 'Carbon',     mass: '12.011',  iso: 12,  config: '[He] 2s2 2p2',                      cat: 'nonmetal' },
  { z: 7,   sym: 'N',  name: 'Nitrogen',   mass: '14.007',  iso: 14,  config: '[He] 2s2 2p3',                      cat: 'nonmetal' },
  { z: 8,   sym: 'O',  name: 'Oxygen',     mass: '15.999',  iso: 16,  config: '[He] 2s2 2p4',                      cat: 'nonmetal' },
  { z: 9,   sym: 'F',  name: 'Fluorine',   mass: '18.998',  iso: 19,  config: '[He] 2s2 2p5',                      cat: 'halogen' },
  { z: 10,  sym: 'Ne', name: 'Neon',       mass: '20.180',  iso: 20,  config: '[He] 2s2 2p6',                      cat: 'noble' },
  { z: 11,  sym: 'Na', name: 'Sodium',     mass: '22.990',  iso: 23,  config: '[Ne] 3s1',                          cat: 'alkali' },
  { z: 12,  sym: 'Mg', name: 'Magnesium',  mass: '24.305',  iso: 24,  config: '[Ne] 3s2',                          cat: 'alkaline' },
  { z: 13,  sym: 'Al', name: 'Aluminium',  mass: '26.982',  iso: 27,  config: '[Ne] 3s2 3p1',                      cat: 'post' },
  { z: 14,  sym: 'Si', name: 'Silicon',    mass: '28.085',  iso: 28,  config: '[Ne] 3s2 3p2',                      cat: 'metalloid' },
  { z: 15,  sym: 'P',  name: 'Phosphorus', mass: '30.974',  iso: 31,  config: '[Ne] 3s2 3p3',                      cat: 'nonmetal' },
  { z: 16,  sym: 'S',  name: 'Sulfur',     mass: '32.06',   iso: 32,  config: '[Ne] 3s2 3p4',                      cat: 'nonmetal' },
  { z: 17,  sym: 'Cl', name: 'Chlorine',   mass: '35.45',   iso: 35,  config: '[Ne] 3s2 3p5',                      cat: 'halogen' },
  { z: 18,  sym: 'Ar', name: 'Argon',      mass: '39.95',   iso: 40,  config: '[Ne] 3s2 3p6',                      cat: 'noble' },
  { z: 19,  sym: 'K',  name: 'Potassium',  mass: '39.098',  iso: 39,  config: '[Ar] 4s1',                          cat: 'alkali' },
  { z: 20,  sym: 'Ca', name: 'Calcium',    mass: '40.078',  iso: 40,  config: '[Ar] 4s2',                          cat: 'alkaline' },
  { z: 21,  sym: 'Sc', name: 'Scandium',   mass: '44.956',  iso: 45,  config: '[Ar] 3d1 4s2',                      cat: 'transition' },
  { z: 22,  sym: 'Ti', name: 'Titanium',   mass: '47.867',  iso: 48,  config: '[Ar] 3d2 4s2',                      cat: 'transition' },
  { z: 23,  sym: 'V',  name: 'Vanadium',   mass: '50.942',  iso: 51,  config: '[Ar] 3d3 4s2',                      cat: 'transition' },
  { z: 24,  sym: 'Cr', name: 'Chromium',   mass: '51.996',  iso: 52,  config: '[Ar] 3d5 4s1',                      cat: 'transition' },
  { z: 25,  sym: 'Mn', name: 'Manganese',  mass: '54.938',  iso: 55,  config: '[Ar] 3d5 4s2',                      cat: 'transition' },
  { z: 26,  sym: 'Fe', name: 'Iron',       mass: '55.845',  iso: 56,  config: '[Ar] 3d6 4s2',                      cat: 'transition' },
  { z: 27,  sym: 'Co', name: 'Cobalt',     mass: '58.933',  iso: 59,  config: '[Ar] 3d7 4s2',                      cat: 'transition' },
  { z: 28,  sym: 'Ni', name: 'Nickel',     mass: '58.693',  iso: 58,  config: '[Ar] 3d8 4s2',                      cat: 'transition' },
  { z: 29,  sym: 'Cu', name: 'Copper',     mass: '63.546',  iso: 63,  config: '[Ar] 3d10 4s1',                     cat: 'transition' },
  { z: 30,  sym: 'Zn', name: 'Zinc',       mass: '65.38',   iso: 64,  config: '[Ar] 3d10 4s2',                     cat: 'transition' },
  { z: 31,  sym: 'Ga', name: 'Gallium',    mass: '69.723',  iso: 69,  config: '[Ar] 3d10 4s2 4p1',                 cat: 'post' },
  { z: 32,  sym: 'Ge', name: 'Germanium',  mass: '72.630',  iso: 74,  config: '[Ar] 3d10 4s2 4p2',                 cat: 'metalloid' },
  { z: 33,  sym: 'As', name: 'Arsenic',    mass: '74.922',  iso: 75,  config: '[Ar] 3d10 4s2 4p3',                 cat: 'metalloid' },
  { z: 34,  sym: 'Se', name: 'Selenium',   mass: '78.971',  iso: 80,  config: '[Ar] 3d10 4s2 4p4',                 cat: 'nonmetal' },
  { z: 35,  sym: 'Br', name: 'Bromine',    mass: '79.904',  iso: 79,  config: '[Ar] 3d10 4s2 4p5',                 cat: 'halogen' },
  { z: 36,  sym: 'Kr', name: 'Krypton',    mass: '83.798',  iso: 84,  config: '[Ar] 3d10 4s2 4p6',                 cat: 'noble' },
  { z: 37,  sym: 'Rb', name: 'Rubidium',   mass: '85.468',  iso: 85,  config: '[Kr] 5s1',                          cat: 'alkali' },
  { z: 38,  sym: 'Sr', name: 'Strontium',  mass: '87.62',   iso: 88,  config: '[Kr] 5s2',                          cat: 'alkaline' },
  { z: 39,  sym: 'Y',  name: 'Yttrium',    mass: '88.906',  iso: 89,  config: '[Kr] 4d1 5s2',                      cat: 'transition' },
  { z: 40,  sym: 'Zr', name: 'Zirconium',  mass: '91.224',  iso: 90,  config: '[Kr] 4d2 5s2',                      cat: 'transition' },
  { z: 41,  sym: 'Nb', name: 'Niobium',    mass: '92.906',  iso: 93,  config: '[Kr] 4d4 5s1',                      cat: 'transition' },
  { z: 42,  sym: 'Mo', name: 'Molybdenum', mass: '95.95',   iso: 98,  config: '[Kr] 4d5 5s1',                      cat: 'transition' },
  { z: 43,  sym: 'Tc', name: 'Technetium', mass: '[98]',    iso: 98,  config: '[Kr] 4d5 5s2',                      cat: 'transition' },
  { z: 44,  sym: 'Ru', name: 'Ruthenium',  mass: '101.07',  iso: 102, config: '[Kr] 4d7 5s1',                      cat: 'transition' },
  { z: 45,  sym: 'Rh', name: 'Rhodium',    mass: '102.91',  iso: 103, config: '[Kr] 4d8 5s1',                      cat: 'transition' },
  { z: 46,  sym: 'Pd', name: 'Palladium',  mass: '106.42',  iso: 106, config: '[Kr] 4d10',                         cat: 'transition' },
  { z: 47,  sym: 'Ag', name: 'Silver',     mass: '107.87',  iso: 107, config: '[Kr] 4d10 5s1',                     cat: 'transition' },
  { z: 48,  sym: 'Cd', name: 'Cadmium',    mass: '112.41',  iso: 114, config: '[Kr] 4d10 5s2',                     cat: 'transition' },
  { z: 49,  sym: 'In', name: 'Indium',     mass: '114.82',  iso: 115, config: '[Kr] 4d10 5s2 5p1',                 cat: 'post' },
  { z: 50,  sym: 'Sn', name: 'Tin',        mass: '118.71',  iso: 120, config: '[Kr] 4d10 5s2 5p2',                 cat: 'post' },
  { z: 51,  sym: 'Sb', name: 'Antimony',   mass: '121.76',  iso: 121, config: '[Kr] 4d10 5s2 5p3',                 cat: 'metalloid' },
  { z: 52,  sym: 'Te', name: 'Tellurium',  mass: '127.60',  iso: 130, config: '[Kr] 4d10 5s2 5p4',                 cat: 'metalloid' },
  { z: 53,  sym: 'I',  name: 'Iodine',     mass: '126.90',  iso: 127, config: '[Kr] 4d10 5s2 5p5',                 cat: 'halogen' },
  { z: 54,  sym: 'Xe', name: 'Xenon',      mass: '131.29',  iso: 132, config: '[Kr] 4d10 5s2 5p6',                 cat: 'noble' },
  { z: 55,  sym: 'Cs', name: 'Caesium',    mass: '132.91',  iso: 133, config: '[Xe] 6s1',                          cat: 'alkali' },
  { z: 56,  sym: 'Ba', name: 'Barium',     mass: '137.33',  iso: 138, config: '[Xe] 6s2',                          cat: 'alkaline' },
  { z: 57,  sym: 'La', name: 'Lanthanum',  mass: '138.91',  iso: 139, config: '[Xe] 5d1 6s2',                      cat: 'lanthanide' },
  { z: 58,  sym: 'Ce', name: 'Cerium',     mass: '140.12',  iso: 140, config: '[Xe] 4f1 5d1 6s2',                  cat: 'lanthanide' },
  { z: 59,  sym: 'Pr', name: 'Praseodymium', mass: '140.91', iso: 141, config: '[Xe] 4f3 6s2',                     cat: 'lanthanide' },
  { z: 60,  sym: 'Nd', name: 'Neodymium',  mass: '144.24',  iso: 142, config: '[Xe] 4f4 6s2',                      cat: 'lanthanide' },
  { z: 61,  sym: 'Pm', name: 'Promethium', mass: '[145]',   iso: 145, config: '[Xe] 4f5 6s2',                      cat: 'lanthanide' },
  { z: 62,  sym: 'Sm', name: 'Samarium',   mass: '150.36',  iso: 152, config: '[Xe] 4f6 6s2',                      cat: 'lanthanide' },
  { z: 63,  sym: 'Eu', name: 'Europium',   mass: '151.96',  iso: 153, config: '[Xe] 4f7 6s2',                      cat: 'lanthanide' },
  { z: 64,  sym: 'Gd', name: 'Gadolinium', mass: '157.25',  iso: 158, config: '[Xe] 4f7 5d1 6s2',                  cat: 'lanthanide' },
  { z: 65,  sym: 'Tb', name: 'Terbium',    mass: '158.93',  iso: 159, config: '[Xe] 4f9 6s2',                      cat: 'lanthanide' },
  { z: 66,  sym: 'Dy', name: 'Dysprosium', mass: '162.50',  iso: 164, config: '[Xe] 4f10 6s2',                     cat: 'lanthanide' },
  { z: 67,  sym: 'Ho', name: 'Holmium',    mass: '164.93',  iso: 165, config: '[Xe] 4f11 6s2',                     cat: 'lanthanide' },
  { z: 68,  sym: 'Er', name: 'Erbium',     mass: '167.26',  iso: 166, config: '[Xe] 4f12 6s2',                     cat: 'lanthanide' },
  { z: 69,  sym: 'Tm', name: 'Thulium',    mass: '168.93',  iso: 169, config: '[Xe] 4f13 6s2',                     cat: 'lanthanide' },
  { z: 70,  sym: 'Yb', name: 'Ytterbium',  mass: '173.05',  iso: 174, config: '[Xe] 4f14 6s2',                     cat: 'lanthanide' },
  { z: 71,  sym: 'Lu', name: 'Lutetium',   mass: '174.97',  iso: 175, config: '[Xe] 4f14 5d1 6s2',                 cat: 'lanthanide' },
  { z: 72,  sym: 'Hf', name: 'Hafnium',    mass: '178.49',  iso: 180, config: '[Xe] 4f14 5d2 6s2',                 cat: 'transition' },
  { z: 73,  sym: 'Ta', name: 'Tantalum',   mass: '180.95',  iso: 181, config: '[Xe] 4f14 5d3 6s2',                 cat: 'transition' },
  { z: 74,  sym: 'W',  name: 'Tungsten',   mass: '183.84',  iso: 184, config: '[Xe] 4f14 5d4 6s2',                 cat: 'transition' },
  { z: 75,  sym: 'Re', name: 'Rhenium',    mass: '186.21',  iso: 187, config: '[Xe] 4f14 5d5 6s2',                 cat: 'transition' },
  { z: 76,  sym: 'Os', name: 'Osmium',     mass: '190.23',  iso: 192, config: '[Xe] 4f14 5d6 6s2',                 cat: 'transition' },
  { z: 77,  sym: 'Ir', name: 'Iridium',    mass: '192.22',  iso: 193, config: '[Xe] 4f14 5d7 6s2',                 cat: 'transition' },
  { z: 78,  sym: 'Pt', name: 'Platinum',   mass: '195.08',  iso: 195, config: '[Xe] 4f14 5d9 6s1',                 cat: 'transition' },
  { z: 79,  sym: 'Au', name: 'Gold',       mass: '196.97',  iso: 197, config: '[Xe] 4f14 5d10 6s1',                cat: 'transition' },
  { z: 80,  sym: 'Hg', name: 'Mercury',    mass: '200.59',  iso: 202, config: '[Xe] 4f14 5d10 6s2',                cat: 'transition' },
  { z: 81,  sym: 'Tl', name: 'Thallium',   mass: '204.38',  iso: 205, config: '[Xe] 4f14 5d10 6s2 6p1',           cat: 'post' },
  { z: 82,  sym: 'Pb', name: 'Lead',       mass: '207.2',   iso: 208, config: '[Xe] 4f14 5d10 6s2 6p2',           cat: 'post' },
  { z: 83,  sym: 'Bi', name: 'Bismuth',    mass: '208.98',  iso: 209, config: '[Xe] 4f14 5d10 6s2 6p3',           cat: 'post' },
  { z: 84,  sym: 'Po', name: 'Polonium',   mass: '[209]',   iso: 209, config: '[Xe] 4f14 5d10 6s2 6p4',           cat: 'post' },
  { z: 85,  sym: 'At', name: 'Astatine',   mass: '[210]',   iso: 210, config: '[Xe] 4f14 5d10 6s2 6p5',           cat: 'halogen' },
  { z: 86,  sym: 'Rn', name: 'Radon',      mass: '[222]',   iso: 222, config: '[Xe] 4f14 5d10 6s2 6p6',           cat: 'noble' },
  { z: 87,  sym: 'Fr', name: 'Francium',   mass: '[223]',   iso: 223, config: '[Rn] 7s1',                          cat: 'alkali' },
  { z: 88,  sym: 'Ra', name: 'Radium',     mass: '[226]',   iso: 226, config: '[Rn] 7s2',                          cat: 'alkaline' },
  { z: 89,  sym: 'Ac', name: 'Actinium',   mass: '[227]',   iso: 227, config: '[Rn] 6d1 7s2',                      cat: 'actinide' },
  { z: 90,  sym: 'Th', name: 'Thorium',    mass: '232.04',  iso: 232, config: '[Rn] 6d2 7s2',                      cat: 'actinide' },
  { z: 91,  sym: 'Pa', name: 'Protactinium', mass: '231.04', iso: 231, config: '[Rn] 5f2 6d1 7s2',                 cat: 'actinide' },
  { z: 92,  sym: 'U',  name: 'Uranium',    mass: '238.03',  iso: 238, config: '[Rn] 5f3 6d1 7s2',                  cat: 'actinide' },
  { z: 93,  sym: 'Np', name: 'Neptunium',  mass: '[237]',   iso: 237, config: '[Rn] 5f4 6d1 7s2',                  cat: 'actinide' },
  { z: 94,  sym: 'Pu', name: 'Plutonium',  mass: '[244]',   iso: 244, config: '[Rn] 5f6 7s2',                      cat: 'actinide' },
  { z: 95,  sym: 'Am', name: 'Americium',  mass: '[243]',   iso: 243, config: '[Rn] 5f7 7s2',                      cat: 'actinide' },
  { z: 96,  sym: 'Cm', name: 'Curium',     mass: '[247]',   iso: 247, config: '[Rn] 5f7 6d1 7s2',                  cat: 'actinide' },
  { z: 97,  sym: 'Bk', name: 'Berkelium',  mass: '[247]',   iso: 247, config: '[Rn] 5f9 7s2',                      cat: 'actinide' },
  { z: 98,  sym: 'Cf', name: 'Californium', mass: '[251]',  iso: 251, config: '[Rn] 5f10 7s2',                     cat: 'actinide' },
  { z: 99,  sym: 'Es', name: 'Einsteinium', mass: '[252]',  iso: 252, config: '[Rn] 5f11 7s2',                     cat: 'actinide' },
  { z: 100, sym: 'Fm', name: 'Fermium',    mass: '[257]',   iso: 257, config: '[Rn] 5f12 7s2',                     cat: 'actinide' },
  { z: 101, sym: 'Md', name: 'Mendelevium', mass: '[258]',  iso: 258, config: '[Rn] 5f13 7s2',                     cat: 'actinide' },
  { z: 102, sym: 'No', name: 'Nobelium',   mass: '[259]',   iso: 259, config: '[Rn] 5f14 7s2',                     cat: 'actinide' },
  { z: 103, sym: 'Lr', name: 'Lawrencium', mass: '[262]',   iso: 262, config: '[Rn] 5f14 7s2 7p1',                 cat: 'actinide' },
  { z: 104, sym: 'Rf', name: 'Rutherfordium', mass: '[267]', iso: 267, config: '[Rn] 5f14 6d2 7s2',               cat: 'transition' },
  { z: 105, sym: 'Db', name: 'Dubnium',    mass: '[268]',   iso: 268, config: '[Rn] 5f14 6d3 7s2',               cat: 'transition' },
  { z: 106, sym: 'Sg', name: 'Seaborgium', mass: '[269]',   iso: 269, config: '[Rn] 5f14 6d4 7s2',               cat: 'transition' },
  { z: 107, sym: 'Bh', name: 'Bohrium',    mass: '[270]',   iso: 270, config: '[Rn] 5f14 6d5 7s2',               cat: 'transition' },
  { z: 108, sym: 'Hs', name: 'Hassium',    mass: '[269]',   iso: 269, config: '[Rn] 5f14 6d6 7s2',               cat: 'transition' },
  { z: 109, sym: 'Mt', name: 'Meitnerium', mass: '[278]',   iso: 278, config: '[Rn] 5f14 6d7 7s2',               cat: 'unknown' },
  { z: 110, sym: 'Ds', name: 'Darmstadtium', mass: '[281]', iso: 281, config: '[Rn] 5f14 6d8 7s2',               cat: 'unknown' },
  { z: 111, sym: 'Rg', name: 'Roentgenium', mass: '[282]',  iso: 282, config: '[Rn] 5f14 6d9 7s2',               cat: 'unknown' },
  { z: 112, sym: 'Cn', name: 'Copernicium', mass: '[285]',  iso: 285, config: '[Rn] 5f14 6d10 7s2',              cat: 'transition' },
  { z: 113, sym: 'Nh', name: 'Nihonium',   mass: '[286]',   iso: 286, config: '[Rn] 5f14 6d10 7s2 7p1',          cat: 'unknown' },
  { z: 114, sym: 'Fl', name: 'Flerovium',  mass: '[289]',   iso: 289, config: '[Rn] 5f14 6d10 7s2 7p2',          cat: 'unknown' },
  { z: 115, sym: 'Mc', name: 'Moscovium',  mass: '[290]',   iso: 290, config: '[Rn] 5f14 6d10 7s2 7p3',          cat: 'unknown' },
  { z: 116, sym: 'Lv', name: 'Livermorium', mass: '[293]',  iso: 293, config: '[Rn] 5f14 6d10 7s2 7p4',          cat: 'unknown' },
  { z: 117, sym: 'Ts', name: 'Tennessine', mass: '[294]',   iso: 294, config: '[Rn] 5f14 6d10 7s2 7p5',          cat: 'unknown' },
  { z: 118, sym: 'Og', name: 'Oganesson',  mass: '[294]',   iso: 294, config: '[Rn] 5f14 6d10 7s2 7p6',          cat: 'unknown' }
];

// Index helpers (built once).
export const BY_Z = new Map(ELEMENTS.map((e) => [e.z, e]));
export const BY_SYM = new Map(ELEMENTS.map((e) => [e.sym, e]));

export function byZ(z) { return BY_Z.get(Number(z)); }
export function bySym(sym) { return BY_SYM.get(String(sym)); }
