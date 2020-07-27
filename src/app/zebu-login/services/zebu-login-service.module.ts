import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

/**
 * As we're using lazy loaded module, we need to keep separate
 * module for all the services. Else it will bring circular dependency warning.
 * For more information about the implementation,
 * https://medium.com/@tomastrajan/total-guide-to-angular-6-dependency-injection-providedin-vs-providers-85b7a347b59f
 */
@NgModule()
export class ZebuLoginServiceModule { }
