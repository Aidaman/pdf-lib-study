import {
  PDFDocument, StandardFonts, rgb, PDFFont,
  PDFPage, PDFWidgetAnnotation, PDFButton, PDFAcroPushButton,
  PDFRef, PDFDict, PDFAnnotation, AppearanceCharacteristics, drawButton, drawEllipse, ColorTypes
} from 'pdf-lib'
import {defaultButtonAppearanceProvider} from "pdf-lib/ts3.4/es";

export enum PdfStatus {
  "NULL",
  "Created",
  "Saved",
}

export class PdfBuilder {
  private pdfDoc!: PDFDocument;
  private pdfStatus: number = PdfStatus.NULL;
  private pdfArrayBuffer!: ArrayBuffer;

  private async saveDoc() {
    if (this.pdfDoc) {
      this.pdfArrayBuffer = await this.pdfDoc.save();
      return this.pdfArrayBuffer;
    }
    return null;
  }

  public async getPdfAndDownload() {
    const bytes = await this.saveDoc();
    if (bytes) {
      let blob: Blob = new Blob([bytes], {type: "application/pdf"});
      const pickerOptions = {
        suggestedName: `MyPdfDoc.pdf`,
        types: [
          {
            description: 'A PDF file',
            accept: {
              'application/pdf': ['.pdf'],
            },
          },
        ],
      };

      //@ts-ignore
      const fileHandle = await window.showSaveFilePicker(pickerOptions);

      const writableFileStream = await fileHandle.createWritable();
      await writableFileStream.write(blob);
      await writableFileStream.close();
    }

    return this.pdfDoc;
  }

  public async createPdfDoc() {
    if (this.pdfStatus === PdfStatus.NULL) {
      this.pdfDoc = await PDFDocument.create();
      const page: PDFPage = this.pdfDoc.addPage();
      this.pdfStatus = PdfStatus.Created;
      await this.saveDoc();
    }

    return this;
  }

  public async addPage() {
    if (this.pdfStatus !== PdfStatus.NULL) {
      this.pdfDoc.addPage();
      await this.saveDoc();
    }

    return this;
  }

  public async writeText(pageIndex: number, text: string, fontsize: number) {
    if (this.pdfStatus !== PdfStatus.NULL && this.pdfDoc.getPage(pageIndex)) {
      const {width, height} = this.pdfDoc.getPage(pageIndex).getSize();
      const timesNewRomanFont: PDFFont = await this.pdfDoc.embedFont(StandardFonts.TimesRoman);

      this.pdfDoc.getPage(pageIndex).drawText(text, {
        x: 50,
        y: height - 4 * fontsize,
        size: fontsize,
        font: timesNewRomanFont,
        color: rgb(0, 0, 0),
      });

      await this.saveDoc();
    }

    return this;
  }

  // public async modifyDocument(pathToDoc: string, text: string, pageIndex: number) {
  public async modifyDocument(text: string, pageIndex: number) {
    //Load a document by a link
    // const existingPdfBytes: ArrayBuffer = await fetch(pathToDoc)
    //   .then((res) => res.arrayBuffer());

    this.pdfDoc = await PDFDocument.load(this.pdfArrayBuffer);
    const timesNewRomanFont: PDFFont = await this.pdfDoc.embedFont(StandardFonts.TimesRoman);
    const pages: PDFPage[] = this.pdfDoc.getPages();
    const firstPage: PDFPage = pages[0];
    const {width, height} = firstPage.getSize();

    pages[pageIndex].drawText(text, {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      font: timesNewRomanFont,
      color: rgb(1, 0.120, 0.30)
    })

    await this.saveDoc();
    return this;
  }

  public async addAnnotation(pageIndex: number, text: string){
    if (this.pdfStatus !== PdfStatus.NULL){
      const page: PDFPage = this.pdfDoc.getPage(pageIndex);
      const pdfRef: PDFRef = PDFRef.of(1);
      const pdfDict: PDFDict = PDFDict.withContext(this.pdfDoc.context);
      const buttonWithAnnotation: PDFButton = PDFButton.of(PDFAcroPushButton.fromDict(pdfDict, pdfRef), pdfRef, this.pdfDoc);
      const annotation: PDFAnnotation = PDFWidgetAnnotation.fromDict(pdfDict);

      

      // buttonWithAnnotation.updateAppearances(await this.pdfDoc.embedFont(StandardFonts.TimesRoman), (field, widget, font) => {
      //   const {width, height} = this.pdfDoc.getPage(0).getSize();
      //   return ({
      //     normal: drawButton({
      //       borderColor: undefined,
      //       borderWidth: 25,
      //       color: undefined,
      //       font: StandardFonts.TimesRoman,
      //       fontSize: 25,
      //       textColor: undefined,
      //       textLines: [],
      //       x: width / 2,
      //       y: height / 2,
      //       width: 100,
      //       height: 100
      //   }),
      //     down: drawEllipse
      //   })
      // });

      // const annotation: PDFWidgetAnnotation = PDFWidgetAnnotation.create();
    }

    return this;
  }
}
