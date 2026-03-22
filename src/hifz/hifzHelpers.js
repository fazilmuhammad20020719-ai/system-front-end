export const juzNames = [
    "ALIF LAM MEEM", "SAYAQOOL", "TILKAL RUSULL", "LAN TANA LOO", "WAL MOHSANAT",
    "LA YUHIBBULLAH", "WA IZA SAMIU", "WA LAU ANNANA", "QALAL MALAO", "WA A'LAMU",
    "YATAZEROON", "WA MAMIN DA'ABAT", "WA MA UBRIOO", "RUBAMA", "SUBHANALLAZI",
    "QAL ALAM", "IQTARABA", "QADD AFLAHA", "WA QALALLAZINA", "A'MAN KHALAQA",
    "UTLU MA OOHIYA", "WA MANYAQNUT", "WA MALI", "FAMAN AZLAM", "ILAHE YURADDU",
    "HA'A MEEM", "QALA FAMA KHATBUKUM", "QADD SAMI ALLAH", "TABARAKALLAZI", "AMMA YATASA'ALOON"
];

export const getCompletedJuzs = (str) => {
    try {
        const parsed = typeof str === 'string' ? JSON.parse(str) : (str || []);
        return parsed.map(item => typeof item === 'object' ? item : { num: item, start: null, finish: null });
    }
    catch { return []; }
};

export const getRunningJuzs = (val) => {
    try {
        let list = [];
        if (Array.isArray(val)) list = val;
        else {
            const parsed = JSON.parse(val);
            list = Array.isArray(parsed) ? parsed : (val ? [parseInt(val)] : []);
        }
        return list.map(item => typeof item === 'object' ? item : { num: item, start: null });
    } catch {
        return val ? [{ num: parseInt(val), start: null }] : [];
    }
};

export const formatJuzDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
};
