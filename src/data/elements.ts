/* Element data — IUPAC standard atomic weights; [bracketed] values are the
   mass number of the longest-lived / most-studied isotope for synthetic
   elements. Shell distributions follow the standard ground-state
   “electrons per shell” table (including the anomalous configurations). */

export type Category =
  | "nonmetal"
  | "halogen"
  | "noble"
  | "alkali"
  | "alkaline"
  | "transition"
  | "post"
  | "metalloid"
  | "lanthanide"
  | "actinide";

export interface ElementData {
  z: number;
  sym: string;
  name: string;
  mass: string; // standard atomic weight, or [isotope mass]
  synthetic: boolean;
  shells: number[]; // electrons per shell, n = 1..7
  cat: Category;
}

type Row = [string, string, string, ...number[]];

const rows: [number, Row, Category][] = [
  [1, ["H", "Hydrogen", "1.008", 1], "nonmetal"],
  [2, ["He", "Helium", "4.0026", 2], "noble"],
  [3, ["Li", "Lithium", "6.94", 2, 1], "alkali"],
  [4, ["Be", "Beryllium", "9.0122", 2, 2], "alkaline"],
  [5, ["B", "Boron", "10.81", 2, 3], "metalloid"],
  [6, ["C", "Carbon", "12.011", 2, 4], "nonmetal"],
  [7, ["N", "Nitrogen", "14.007", 2, 5], "nonmetal"],
  [8, ["O", "Oxygen", "15.999", 2, 6], "nonmetal"],
  [9, ["F", "Fluorine", "18.998", 2, 7], "halogen"],
  [10, ["Ne", "Neon", "20.180", 2, 8], "noble"],
  [11, ["Na", "Sodium", "22.990", 2, 8, 1], "alkali"],
  [12, ["Mg", "Magnesium", "24.305", 2, 8, 2], "alkaline"],
  [13, ["Al", "Aluminium", "26.982", 2, 8, 3], "post"],
  [14, ["Si", "Silicon", "28.085", 2, 8, 4], "metalloid"],
  [15, ["P", "Phosphorus", "30.974", 2, 8, 5], "nonmetal"],
  [16, ["S", "Sulfur", "32.06", 2, 8, 6], "nonmetal"],
  [17, ["Cl", "Chlorine", "35.45", 2, 8, 7], "halogen"],
  [18, ["Ar", "Argon", "39.948", 2, 8, 8], "noble"],
  [19, ["K", "Potassium", "39.098", 2, 8, 8, 1], "alkali"],
  [20, ["Ca", "Calcium", "40.078", 2, 8, 8, 2], "alkaline"],
  [21, ["Sc", "Scandium", "44.956", 2, 8, 9, 2], "transition"],
  [22, ["Ti", "Titanium", "47.867", 2, 8, 10, 2], "transition"],
  [23, ["V", "Vanadium", "50.942", 2, 8, 11, 2], "transition"],
  [24, ["Cr", "Chromium", "51.996", 2, 8, 13, 1], "transition"],
  [25, ["Mn", "Manganese", "54.938", 2, 8, 13, 2], "transition"],
  [26, ["Fe", "Iron", "55.845", 2, 8, 14, 2], "transition"],
  [27, ["Co", "Cobalt", "58.933", 2, 8, 15, 2], "transition"],
  [28, ["Ni", "Nickel", "58.693", 2, 8, 16, 2], "transition"],
  [29, ["Cu", "Copper", "63.546", 2, 8, 18, 1], "transition"],
  [30, ["Zn", "Zinc", "65.38", 2, 8, 18, 2], "transition"],
  [31, ["Ga", "Gallium", "69.723", 2, 8, 18, 3], "post"],
  [32, ["Ge", "Germanium", "72.630", 2, 8, 18, 4], "metalloid"],
  [33, ["As", "Arsenic", "74.922", 2, 8, 18, 5], "metalloid"],
  [34, ["Se", "Selenium", "78.971", 2, 8, 18, 6], "nonmetal"],
  [35, ["Br", "Bromine", "79.904", 2, 8, 18, 7], "halogen"],
  [36, ["Kr", "Krypton", "83.798", 2, 8, 18, 8], "noble"],
  [37, ["Rb", "Rubidium", "85.468", 2, 8, 18, 8, 1], "alkali"],
  [38, ["Sr", "Strontium", "87.62", 2, 8, 18, 8, 2], "alkaline"],
  [39, ["Y", "Yttrium", "88.906", 2, 8, 18, 9, 2], "transition"],
  [40, ["Zr", "Zirconium", "91.224", 2, 8, 18, 10, 2], "transition"],
  [41, ["Nb", "Niobium", "92.906", 2, 8, 18, 13, 1], "transition"],
  [42, ["Mo", "Molybdenum", "95.95", 2, 8, 18, 13, 1], "transition"],
  [43, ["Tc", "Technetium", "[98]", 2, 8, 18, 13, 2], "transition"],
  [44, ["Ru", "Ruthenium", "101.07", 2, 8, 18, 15, 1], "transition"],
  [45, ["Rh", "Rhodium", "102.91", 2, 8, 18, 16, 1], "transition"],
  [46, ["Pd", "Palladium", "106.42", 2, 8, 18, 18], "transition"],
  [47, ["Ag", "Silver", "107.87", 2, 8, 18, 18, 1], "transition"],
  [48, ["Cd", "Cadmium", "112.41", 2, 8, 18, 18, 2], "transition"],
  [49, ["In", "Indium", "114.82", 2, 8, 18, 18, 3], "post"],
  [50, ["Sn", "Tin", "118.71", 2, 8, 18, 18, 4], "post"],
  [51, ["Sb", "Antimony", "121.76", 2, 8, 18, 18, 5], "metalloid"],
  [52, ["Te", "Tellurium", "127.60", 2, 8, 18, 18, 6], "metalloid"],
  [53, ["I", "Iodine", "126.90", 2, 8, 18, 18, 7], "halogen"],
  [54, ["Xe", "Xenon", "131.29", 2, 8, 18, 18, 8], "noble"],
  [55, ["Cs", "Caesium", "132.91", 2, 8, 18, 18, 8, 1], "alkali"],
  [56, ["Ba", "Barium", "137.33", 2, 8, 18, 18, 8, 2], "alkaline"],
  [57, ["La", "Lanthanum", "138.91", 2, 8, 18, 18, 9, 2], "lanthanide"],
  [58, ["Ce", "Cerium", "140.12", 2, 8, 18, 19, 9, 2], "lanthanide"],
  [59, ["Pr", "Praseodymium", "140.91", 2, 8, 18, 21, 8, 2], "lanthanide"],
  [60, ["Nd", "Neodymium", "144.24", 2, 8, 18, 22, 8, 2], "lanthanide"],
  [61, ["Pm", "Promethium", "[145]", 2, 8, 18, 23, 8, 2], "lanthanide"],
  [62, ["Sm", "Samarium", "150.36", 2, 8, 18, 24, 8, 2], "lanthanide"],
  [63, ["Eu", "Europium", "151.96", 2, 8, 18, 25, 8, 2], "lanthanide"],
  [64, ["Gd", "Gadolinium", "157.25", 2, 8, 18, 25, 9, 2], "lanthanide"],
  [65, ["Tb", "Terbium", "158.93", 2, 8, 18, 27, 8, 2], "lanthanide"],
  [66, ["Dy", "Dysprosium", "162.50", 2, 8, 18, 28, 8, 2], "lanthanide"],
  [67, ["Ho", "Holmium", "164.93", 2, 8, 18, 29, 8, 2], "lanthanide"],
  [68, ["Er", "Erbium", "167.26", 2, 8, 18, 30, 8, 2], "lanthanide"],
  [69, ["Tm", "Thulium", "168.93", 2, 8, 18, 31, 8, 2], "lanthanide"],
  [70, ["Yb", "Ytterbium", "173.05", 2, 8, 18, 32, 8, 2], "lanthanide"],
  [71, ["Lu", "Lutetium", "174.97", 2, 8, 18, 32, 9, 2], "lanthanide"],
  [72, ["Hf", "Hafnium", "178.49", 2, 8, 18, 32, 10, 2], "transition"],
  [73, ["Ta", "Tantalum", "180.95", 2, 8, 18, 32, 11, 2], "transition"],
  [74, ["W", "Tungsten", "183.84", 2, 8, 18, 32, 12, 2], "transition"],
  [75, ["Re", "Rhenium", "186.21", 2, 8, 18, 32, 13, 2], "transition"],
  [76, ["Os", "Osmium", "190.23", 2, 8, 18, 32, 14, 2], "transition"],
  [77, ["Ir", "Iridium", "192.22", 2, 8, 18, 32, 15, 2], "transition"],
  [78, ["Pt", "Platinum", "195.08", 2, 8, 18, 32, 17, 1], "transition"],
  [79, ["Au", "Gold", "196.97", 2, 8, 18, 32, 18, 1], "transition"],
  [80, ["Hg", "Mercury", "200.59", 2, 8, 18, 32, 18, 2], "transition"],
  [81, ["Tl", "Thallium", "204.38", 2, 8, 18, 32, 18, 3], "post"],
  [82, ["Pb", "Lead", "207.2", 2, 8, 18, 32, 18, 4], "post"],
  [83, ["Bi", "Bismuth", "208.98", 2, 8, 18, 32, 18, 5], "post"],
  [84, ["Po", "Polonium", "[209]", 2, 8, 18, 32, 18, 6], "post"],
  [85, ["At", "Astatine", "[210]", 2, 8, 18, 32, 18, 7], "halogen"],
  [86, ["Rn", "Radon", "[222]", 2, 8, 18, 32, 18, 8], "noble"],
  [87, ["Fr", "Francium", "[223]", 2, 8, 18, 32, 18, 8, 1], "alkali"],
  [88, ["Ra", "Radium", "[226]", 2, 8, 18, 32, 18, 8, 2], "alkaline"],
  [89, ["Ac", "Actinium", "[227]", 2, 8, 18, 32, 18, 9, 2], "actinide"],
  [90, ["Th", "Thorium", "232.04", 2, 8, 18, 32, 18, 10, 2], "actinide"],
  [91, ["Pa", "Protactinium", "231.04", 2, 8, 18, 32, 20, 9, 2], "actinide"],
  [92, ["U", "Uranium", "238.03", 2, 8, 18, 32, 21, 9, 2], "actinide"],
  [93, ["Np", "Neptunium", "[237]", 2, 8, 18, 32, 22, 9, 2], "actinide"],
  [94, ["Pu", "Plutonium", "[244]", 2, 8, 18, 32, 24, 8, 2], "actinide"],
  [95, ["Am", "Americium", "[243]", 2, 8, 18, 32, 25, 8, 2], "actinide"],
  [96, ["Cm", "Curium", "[247]", 2, 8, 18, 32, 25, 9, 2], "actinide"],
  [97, ["Bk", "Berkelium", "[247]", 2, 8, 18, 32, 27, 8, 2], "actinide"],
  [98, ["Cf", "Californium", "[251]", 2, 8, 18, 32, 28, 8, 2], "actinide"],
  [99, ["Es", "Einsteinium", "[252]", 2, 8, 18, 32, 29, 8, 2], "actinide"],
  [100, ["Fm", "Fermium", "[257]", 2, 8, 18, 32, 30, 8, 2], "actinide"],
  [101, ["Md", "Mendelevium", "[258]", 2, 8, 18, 32, 31, 8, 2], "actinide"],
  [102, ["No", "Nobelium", "[259]", 2, 8, 18, 32, 32, 8, 2], "actinide"],
  [103, ["Lr", "Lawrencium", "[266]", 2, 8, 18, 32, 32, 8, 3], "actinide"],
  [104, ["Rf", "Rutherfordium", "[267]", 2, 8, 18, 32, 32, 10, 2], "transition"],
  [105, ["Db", "Dubnium", "[268]", 2, 8, 18, 32, 32, 11, 2], "transition"],
  [106, ["Sg", "Seaborgium", "[269]", 2, 8, 18, 32, 32, 12, 2], "transition"],
  [107, ["Bh", "Bohrium", "[270]", 2, 8, 18, 32, 32, 13, 2], "transition"],
  [108, ["Hs", "Hassium", "[277]", 2, 8, 18, 32, 32, 14, 2], "transition"],
  [109, ["Mt", "Meitnerium", "[278]", 2, 8, 18, 32, 32, 15, 2], "transition"],
  [110, ["Ds", "Darmstadtium", "[281]", 2, 8, 18, 32, 32, 16, 2], "transition"],
  [111, ["Rg", "Roentgenium", "[282]", 2, 8, 18, 32, 32, 17, 2], "transition"],
  [112, ["Cn", "Copernicium", "[285]", 2, 8, 18, 32, 32, 18, 2], "transition"],
  [113, ["Nh", "Nihonium", "[286]", 2, 8, 18, 32, 32, 18, 3], "post"],
  [114, ["Fl", "Flerovium", "[289]", 2, 8, 18, 32, 32, 18, 4], "post"],
  [115, ["Mc", "Moscovium", "[290]", 2, 8, 18, 32, 32, 18, 5], "post"],
  [116, ["Lv", "Livermorium", "[293]", 2, 8, 18, 32, 32, 18, 6], "post"],
  [117, ["Ts", "Tennessine", "[294]", 2, 8, 18, 32, 32, 18, 7], "halogen"],
  [118, ["Og", "Oganesson", "[294]", 2, 8, 18, 32, 32, 18, 8], "noble"],
];

export const ELEMENTS: ElementData[] = rows.map(([z, row, cat]) => {
  const [sym, name, mass, ...shells] = row;
  return {
    z,
    sym,
    name,
    mass,
    synthetic: mass.startsWith("["),
    shells,
    cat,
  };
});

export const byZ = (z: number): ElementData =>
  ELEMENTS[Math.min(Math.max(z, 1), 118) - 1];

export const CAT_LABEL: Record<Category, string> = {
  nonmetal: "Reactive nonmetal",
  halogen: "Halogen",
  noble: "Noble gas",
  alkali: "Alkali metal",
  alkaline: "Alkaline earth metal",
  transition: "Transition metal",
  post: "Post-transition metal",
  metalloid: "Metalloid",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
};

export const padZ = (z: number) => String(z).padStart(3, "0");
