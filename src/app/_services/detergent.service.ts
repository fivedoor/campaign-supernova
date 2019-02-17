import { Injectable } from '@angular/core';
import * as detergent from "detergent";

@Injectable({
  providedIn: 'root'
})
export class DetergentService {

  constructor() { }

   findText(copySource, txtOutput) {
        console.log('FUNC: findText()');

        if (copySource) {
          console.log('copySource detected');
          console.log('Creating Txt nodes from copy');

          let obj: any = {};

          const outputText = function(match: string, p1: string): any {
            obj = {};
            // Encode text
            p1 = detergent(p1, {

              removeWidows: true,             // replace the last space in paragraph with &nbsp;
              convertEntities: true,          // encode all non-ASCII chars
              convertDashes: true,            // typographically-correct the n/m-dashes
              convertApostrophes: true,       // typographically-correct the apostrophes
              replaceLineBreaks: true,        // replace all line breaks with BR's
              removeLineBreaks: false,        // put everything on one line
              useXHTML: true,                 // add closing slashes on BR's
              removeSoftHyphens: true,        // remove character which encodes to &#173; or &shy;
              dontEncodeNonLatin: true,       // skip non-latin character encoding
              keepBoldEtc: true,              // any bold, strong, i or em tags are stripped of attributes and retained
              // enforceFullStopSpaces: false // JH added custom option to prevent adding space after '.' in the nunjucks links symbol

            });

            obj['paragraph'] = p1;
            txtOutput.push(obj);  
          };
          // reformat links for njucks
          copySource = copySource.replace(/\|(.*?)}}/g, '.link|safe}}');
          // split paragraphs
          copySource.replace(/([^\n]+)/g, outputText);

        } else {
          console.log('No copy detected from copySource');
        }
      }
}
