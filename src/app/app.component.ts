import { Component } from '@angular/core';
import { PdfBuilder } from './shared/pdf-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private pdfBuilder: PdfBuilder = new PdfBuilder();
  // private readonly pathToDoc: string = "https://pdf-lib.js.org/assets/with_update_sections.pdf";

  public title: string = 'PDF-lib-test';

  public formText: string = "";
  public annotationText: string = "";
  public newDocTitle: string = "";
  public selectedPageIndex: number = 0;
  public annotationPageIndex: number = 0;

  public async createNewDocument(e?: Event){
    if(e) e.preventDefault();

    if(this.newDocTitle.length > 5){
      await (await (await this.pdfBuilder.createPdfDoc())
        .addPage())
        .writeText(0, this.newDocTitle, 72);
      this.newDocTitle = "";
    }
  }

  public async addPageToDoc(){
    await this.pdfBuilder.addPage();
  }

  public async modifyDocument(){
    await this.pdfBuilder.modifyDocument(this.formText, this.selectedPageIndex)
    // await this.pdfBuilder.modifyDocument(this.pathToDoc, this.formText, this.selectedPageIndex)
  }

  public async getPdf(){
    await this.pdfBuilder.getPdfAndDownload();
  }

  public async addAnnotation(pageIndex: number, annotationText: string){
    await this.pdfBuilder.addAnnotation(pageIndex, annotationText);
  }
}
