import { Directive,Component, HostListener} from '@angular/core';

@Directive({
  selector: '[appShortcut]'
})
export class ShortcutDirective {

  constructor() { }
  @HostListener('document:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    
    if (event.keyCode === 66) {
      alert("hi")
    }
  }
}
