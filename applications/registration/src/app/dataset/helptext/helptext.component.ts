import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {HelptextsService} from "../helptexts.service";

@Component({
    selector: 'helptext',
    templateUrl: './helptext.component.html'
})

export class HelpText implements OnInit {
    @Input('text')
    public text: string;

    @Input('moretext')
    public moretext: string;

    @Input('name')
    public name: string;

    allHelptexts: any[];
    resolvedShortDesc: string = null;
    resolvedDescription: string = null;

  constructor(private helptextsService: HelptextsService) {
  }

  ngOnInit() {
    this.fetchHelpTexts().then(()=> {
      this.allHelptexts
        .filter(entry => entry.id == this.name)
        .forEach(entry => {
          this.resolvedShortDesc = entry.shortdesc.replace(new RegExp('\n', 'g'), "<br />");
          this.resolvedDescription = entry.description.replace(new RegExp('\n', 'g'), "<br />");
        })
    });
  }

  fetchHelpTexts() {
    return this.helptextsService.fetchHelptexts('nb').then(helptexts =>
      this.allHelptexts = helptexts);
  }
}
