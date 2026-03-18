export const juzNames = [
    "ALIF LAM MEEM", "SAYAQOOL", "TILKAL RUSULL", "LAN TANA LOO", "WAL MOHSANAT",
    "LA YUHIBBULLAH", "WA IZA SAMIU", "WA LAU ANNANA", "QALAL MALAO", "WA A'LAMU",
    "YATAZEROON", "WA MAMIN DA'ABAT", "WA MA UBRIOO", "RUBAMA", "SUBHANALLAZI",
    "QAL ALAM", "IQTARABA", "QADD AFLAHA", "WA QALALLAZINA", "A'MAN KHALAQA",
    "UTLU MA OOHIYA", "WA MANYAQNUT", "WA MALI", "FAMAN AZLAM", "ILAHE YURADDU",
    "HA'A MEEM", "QALA FAMA KHATBUKUM", "QADD SAMI ALLAH", "TABARAKALLAZI", "AMMA YATASA'ALOON"
];

export const getCompletedJuzs = (str) => {
    try { return typeof str === 'string' ? JSON.parse(str) : (str || []); }
    catch { return []; }
};

export const getRunningJuzs = (val) => {
    try {
        if (Array.isArray(val)) return val;
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : (val ? [parseInt(val)] : []);
    } catch {
        return val ? [parseInt(val)] : [];
    }
};
