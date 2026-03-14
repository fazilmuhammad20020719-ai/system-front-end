import jsPDF from 'jspdf';

// ── School / Institution Constants ──
// Update these values to match your actual institution details
export const SCHOOL_INFO = {
    name: 'FMAC Education Institute',
    tagline: 'Excellence in Learning',
    address: 'No. 12, College Road, Colombo 03, Sri Lanka',
    phone: '+94 11 234 5678',
    email: 'info@fmac.edu.lk',
    website: 'www.fmac.edu.lk',
    bank: 'Bank of Ceylon',
    account: '0123456789',
};

/**
 * Generates and downloads a standard Fee Bill PDF.
 *
 * @param {object} record       - The fee row data (month, year, paidAmount, balance, status, txns)
 * @param {number} monthlyRate  - The student's monthly fee rate
 * @param {object} studentInfo  - { name, id, program, year, phone, email }
 */
export function generateFeeBill(record, monthlyRate, studentInfo = {}) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const PW = 210; // page width
    const ML = 14;  // margin left
    const MR = 196; // margin right

    // ── Colour Palette ──
    const GREEN = [34, 120, 60];
    const LGREEN = [220, 243, 228];
    const GRAY = [100, 100, 100];
    const DGRAY = [40, 40, 40];
    const WHITE = [255, 255, 255];

    const SCHOOL = SCHOOL_INFO;

    // ── Data Prep ──
    const txnId = record.txns?.length > 0 ? record.txns[0].id : 'N/A';
    const invoiceNo = `INV-${record.year}-${String(txnId).padStart(4, '0')}`;
    const billDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const dueDate = `${record.month} 30, ${record.year}`;
    const period = `${record.month} ${record.year}`;
    const rate = Number(monthlyRate) || 0;
    const paid = Number(record.paidAmount) || 0;
    const balance = Number(record.balance) || 0;
    const sInfo = studentInfo || {};

    // ─────────────────────────────────────────────
    // SECTION 1 · HEADER BANNER
    // ─────────────────────────────────────────────
    doc.setFillColor(...GREEN);
    doc.rect(0, 0, PW, 38, 'F');

    doc.setTextColor(...WHITE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(SCHOOL.name, ML, 16);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text(SCHOOL.tagline, ML, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(SCHOOL.address, MR, 12, { align: 'right' });
    doc.text(`Tel: ${SCHOOL.phone}  |  ${SCHOOL.email}`, MR, 17, { align: 'right' });
    doc.text(SCHOOL.website, MR, 22, { align: 'right' });

    doc.setFillColor(...LGREEN);
    doc.rect(0, 38, PW, 12, 'F');
    doc.setTextColor(...GREEN);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('FEE BILL / RECEIPT', PW / 2, 46.5, { align: 'center' });

    // ─────────────────────────────────────────────
    // SECTION 2 · INVOICE META
    // ─────────────────────────────────────────────
    let cy = 58;
    doc.setTextColor(...DGRAY);

    const metaLeft = [['Invoice No.', invoiceNo], ['Bill Date', billDate], ['Billing Period', period]];
    const metaRight = [['Due Date', dueDate], ['Status', record.status]];

    const drawMeta = (items, x) => {
        let my = cy;
        items.forEach(([label, val]) => {
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
            doc.setTextColor(...GRAY);
            doc.text(label.toUpperCase(), x, my);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
            doc.setTextColor(...DGRAY);
            doc.text(String(val), x, my + 5);
            my += 13;
        });
    };
    drawMeta(metaLeft, ML);
    drawMeta(metaRight, 120);

    cy = 93;
    doc.setDrawColor(...LGREEN);
    doc.setLineWidth(0.6);
    doc.line(ML, cy, MR, cy);

    // ─────────────────────────────────────────────
    // SECTION 3 · STUDENT PROFILE BOX
    // ─────────────────────────────────────────────
    cy += 4;
    doc.setFillColor(...LGREEN);
    doc.roundedRect(ML, cy, MR - ML, 28, 2, 2, 'F');

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(...GREEN);
    doc.text('STUDENT INFORMATION', ML + 4, cy + 6);

    const profileItems = [
        ['Full Name', sInfo.name || sInfo.id || 'N/A'],
        ['Student ID', sInfo.id || 'N/A'],
        ['Program', sInfo.program || 'N/A'],
        ['Year', sInfo.year || 'N/A'],
        ['Phone', sInfo.phone || 'N/A'],
        ['Email', sInfo.email || 'N/A'],
    ];

    const cols = [ML + 4, 75, 130];
    const perCol = 2;
    profileItems.forEach((item, idx) => {
        const col = Math.floor(idx / perCol);
        const row = idx % perCol;
        const px = cols[col] || cols[2];
        const py = cy + 12 + row * 7;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
        doc.setTextColor(...GRAY);
        doc.text(item[0] + ':', px, py);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
        doc.setTextColor(...DGRAY);
        doc.text(String(item[1]), px + (item[0].length * 1.6 + 4), py);
    });

    // ─────────────────────────────────────────────
    // SECTION 4 · ITEMIZED CHARGES TABLE
    // ─────────────────────────────────────────────
    cy += 36;

    doc.setFillColor(...GREEN);
    doc.rect(ML, cy, MR - ML, 8, 'F');
    doc.setTextColor(...WHITE);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
    doc.text('DESCRIPTION', ML + 4, cy + 5.5);
    doc.text('QTY', 120, cy + 5.5);
    doc.text('RATE (Rs.)', 148, cy + 5.5);
    doc.text('AMOUNT (Rs.)', MR - 4, cy + 5.5, { align: 'right' });

    cy += 8;

    const feeItems = [
        { desc: 'Tuition Fee (Monthly)', qty: 1, rate, amount: rate },
        { desc: 'Transportation / Bus Fee', qty: 1, rate: 0, amount: 0 },
        { desc: 'Examination / Laboratory Fee', qty: 1, rate: 0, amount: 0 },
        { desc: 'Library / Miscellaneous Fee', qty: 1, rate: 0, amount: 0 },
        { desc: 'Late Payment Fine', qty: 1, rate: 0, amount: 0 },
    ];

    feeItems.forEach((item, i) => {
        const rowBg = i % 2 === 0 ? [250, 255, 252] : [255, 255, 255];
        doc.setFillColor(...rowBg);
        doc.rect(ML, cy, MR - ML, 8, 'F');
        doc.setDrawColor(220, 230, 225); doc.setLineWidth(0.2);
        doc.line(ML, cy + 8, MR, cy + 8);

        doc.setTextColor(...DGRAY);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
        doc.text(item.desc, ML + 4, cy + 5.5);
        doc.text(String(item.qty), 120, cy + 5.5);
        doc.text(item.rate.toLocaleString(), 148, cy + 5.5);
        doc.text(item.amount > 0 ? item.amount.toLocaleString() : '—', MR - 4, cy + 5.5, { align: 'right' });
        cy += 8;
    });

    // ─────────────────────────────────────────────
    // SECTION 5 · FINANCIAL SUMMARY
    // ─────────────────────────────────────────────
    cy += 4;
    doc.setDrawColor(...GREEN); doc.setLineWidth(0.4);
    doc.line(110, cy, MR, cy);
    cy += 1;

    const summaryRows = [
        ['Sub-Total (Rs.)', rate.toLocaleString()],
        ['Discount / Rebate', '0.00'],
        ['Tax (0%)', '0.00'],
        ['Amount Paid (Rs.)', paid.toLocaleString()],
    ];

    summaryRows.forEach(([label, val]) => {
        cy += 7;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(label, 112, cy);
        doc.setTextColor(...DGRAY);
        doc.text(val, MR - 4, cy, { align: 'right' });
    });

    cy += 5;
    doc.setFillColor(...GREEN);
    doc.roundedRect(110, cy, MR - 110, 10, 1.5, 1.5, 'F');
    doc.setTextColor(...WHITE);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('TOTAL AMOUNT DUE', 114, cy + 6.8);
    doc.text(`Rs. ${balance.toLocaleString()}`, MR - 4, cy + 6.8, { align: 'right' });
    cy += 14;

    if (balance <= 0) {
        doc.setFillColor(220, 243, 228);
        doc.roundedRect(110, cy, MR - 110, 8, 1.5, 1.5, 'F');
        doc.setTextColor(...GREEN);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
        doc.text('✔ FULLY PAID', PW / 2 + 20, cy + 5.5, { align: 'center' });
        cy += 12;
    }

    // ─────────────────────────────────────────────
    // SECTION 6 · PAYMENT INSTRUCTIONS
    // ─────────────────────────────────────────────
    cy += 4;
    doc.setDrawColor(...LGREEN); doc.setLineWidth(0.6);
    doc.line(ML, cy, MR, cy);
    cy += 6;

    doc.setFillColor(...LGREEN);
    doc.roundedRect(ML, cy, MR - ML, 30, 2, 2, 'F');

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(...GREEN);
    doc.text('PAYMENT INSTRUCTIONS', ML + 4, cy + 6);

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.setTextColor(...DGRAY);
    doc.text('Accepted Methods:  Cash  •  Bank Transfer  •  Mobile Pay (GPay / PayPal)', ML + 4, cy + 13);
    doc.text(`Bank: ${SCHOOL.bank}  |  A/C No: ${SCHOOL.account}`, ML + 4, cy + 19);
    doc.text(`Payment Due By:  ${dueDate}      Please quote Invoice No. ${invoiceNo} on all transfers.`, ML + 4, cy + 25);

    cy += 36;

    // ─────────────────────────────────────────────
    // SECTION 7 · SIGNATURE BLOCK
    // ─────────────────────────────────────────────
    const sigY = cy + 20;

    doc.setDrawColor(...GRAY); doc.setLineWidth(0.4);
    doc.line(ML, sigY, ML + 60, sigY);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('Authorized Signatory', ML, sigY + 5);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
    doc.text('(Finance Officer / Administrator)', ML, sigY + 9);

    doc.setDrawColor(...GRAY);
    doc.line(MR - 60, sigY, MR, sigY);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('Parent / Student Signature', MR - 60, sigY + 5);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
    doc.text('(Acknowledgement of Receipt)', MR - 60, sigY + 9);

    // ─────────────────────────────────────────────
    // FOOTER
    // ─────────────────────────────────────────────
    const FOOTER_Y = 285;
    doc.setFillColor(...GREEN);
    doc.rect(0, FOOTER_Y, PW, 12, 'F');
    doc.setTextColor(...WHITE);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5);
    doc.text(
        'This is a computer-generated document. No signature required if stamped.',
        PW / 2, FOOTER_Y + 5, { align: 'center' }
    );
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${billDate}   |   ${SCHOOL.website}`, PW / 2, FOOTER_Y + 9, { align: 'center' });

    doc.save(`FeeBill_${invoiceNo}_${record.month}_${record.year}.pdf`);
}
