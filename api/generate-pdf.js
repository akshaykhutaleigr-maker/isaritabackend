const express = require('express');
const router = express.Router();
const puppeteer = require("puppeteer");
const { PDFDocument, rgb, StandardFonts, degrees } = require("pdf-lib");
const QRCode = require("qrcode");
const fs = require("fs-extra");
const path = require("path");
async function htmlToPdfBuffer(html) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
await page.setContent(html, { waitUntil: "domcontentloaded" });
  const buffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return buffer;
}

async function addWatermarkAndQR(pdfBytes, watermarkText, qrData) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(qrData);
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();

    // Watermark
    page.drawText("Watermark", {
  x: width / 4,
  y: height / 2,
  size: 60,
  color: rgb(0.8, 0.8, 0.8),
  rotate: degrees(45),   // ✅ Correct
  opacity: 0.1,
});

    // QR Code bottom right
    const qrDim = 80;
    page.drawImage(qrImage, {
      x: width - qrDim - 20,
      y: 20,
      width: qrDim,
      height: qrDim,
    });

    // Page number
    page.drawText(`Page ${idx + 1} of ${pages.length}`, {
      x: width / 2 - 40,
      y: 10,
      size: 12,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  return await pdfDoc.save();
}

router.post("/generate-merged-pdf", async (req, res) => {
  try {
    const { htmlFiles, watermarkText = "NGDRS Report" } = req.body;

    if (!htmlFiles || !Array.isArray(htmlFiles) || htmlFiles.length === 0) {
      return res.status(400).json({ error: "No HTML files provided" });
    }

    const pdfBuffers = [];
    for (const html of htmlFiles) {
      const buffer = await htmlToPdfBuffer(html);
      pdfBuffers.push(buffer);
    }

    // Merge PDFs
    const mergedPdf = await PDFDocument.create();
    for (const pdfBytes of pdfBuffers) {
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    let finalPdfBytes = await mergedPdf.save();

    // Add watermark + QR code
    finalPdfBytes = await addWatermarkAndQR(finalPdfBytes, watermarkText, "Citizen Verified");

    // Save merged PDF to disk
    const filePath = path.join(__dirname, "../merged_pdfs", `Merged_Report_${Date.now()}.pdf`);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, finalPdfBytes);

    // Send PDF for download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=Merged_Report.pdf`,
    });

    res.send(finalPdfBytes);

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "PDF generation failed", details: err.toString() });
  }
});


router.post('/generate-pdf', async (req, res) => {
 const { html, fileName = 'report.pdf', watermark = 'NGDRS Report' } = req.body;

  if (!html) return res.status(400).json({ error: 'HTML content is required' });
const userData = {
  name: "Sanjivani Waghmare",
  mobile: "9975026975",
  district: "Pune",
  user_id: "USR2025"
};

const qrBase64 = await QRCode.toDataURL(JSON.stringify(userData));

 const htmlWithWatermark = `
      <div style="position: relative;">
        <div style="
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%); font-size: 50px;
          color: rgba(0,0,0,0.1);
        ">
          ${watermark}
        </div>

        <div>

          <h1>Citizen Registration Report</h1>

          <!-- QR Code -->
          <p><strong>QR Code:</strong></p>
          <img src="${qrBase64}" width="120" />

         
          <!-- Dynamic HTML from Angular -->
          ${html}

        </div>
      </div>
    `;

  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
    type: 'pdf', 
  };

  pdf.create(htmlWithWatermark, options).toBuffer((err, buffer) => {
    if (err) {
      console.error('PDF error:', err);
      return res.status(500).json({ error: 'PDF generation failed' });
    }

    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': buffer.length
    });
    res.send(buffer);

    // Option 2: Save to server (uncomment if needed)
    // const filePath = path.join(__dirname, 'pdfs', fileName);
    // fs.writeFileSync(filePath, buffer);
  });
});

module.exports = router;
