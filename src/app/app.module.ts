import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { ZebuodrGentrComponent } from './zebuodr-gentr/zebuodr-gentr.component';
import { HttpClientModule } from '@angular/common/http';
import { ZebuodrGentrService } from 'src/app/services/zebuodr-gentr.service';
// import { WebSocketService } from 'src/app/services/websocket.service';
import { ZebuFauthenComponent } from './zebu-fauthen/zebu-fauthen.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthguardGuard } from './guard/authguard.guard';
import { ZebuOrderBookComponent } from './zebu-order-book/zebu-order-book.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DataTablesModule } from 'angular-datatables';
import { MktwatchComponent } from './mktwatch/mktwatch.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { SharedataserviceService } from './services/sharedataservice.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { ShortcutDirective } from './shortdirective/shortcut.directive';
import { PayoffComponent } from './payoff/payoff.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatListModule, MatGridListModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort'
import { MatProgressBarModule, MatRadioModule, MatSliderModule } from '@angular/material'
import { MatTableModule, MatSidenavModule, MatMenuModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { UnblockUserComponent } from './unblock-user/unblock-user.component';
import { OrderhistorydialogComponent } from './orderhistorydialog/orderhistorydialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderCancelConfirmDialogBoxComponent } from './order-cancel-confirm-dialog-box/order-cancel-confirm-dialog-box.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MarketstatusComponent } from './marketstatus/marketstatus.component';
import { SecurityinfoComponent } from './securityinfo/securityinfo.component';
// import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { IndexlistComponent } from './indexlist/indexlist.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrderPlacedConformationDialogBoxComponent } from './order-placed-conformation-dialog-box/order-placed-conformation-dialog-box.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CounterComponent } from './counter.component';
import { CounterService } from './counter.service';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HomeComponent } from './home/home.component';
import { ChartsComponent } from './charts/charts.component';
import { OrderComponent } from './order/order.component';
import { PositionsComponent } from './positions/positions.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { FundsComponent } from './funds/funds.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { OptionchainComponent } from './optionchain/optionchain.component';
import { CustomersupportComponent } from './customersupport/customersupport.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationComponent } from './notification/notification.component';
import { MainComponent } from './main/main.component';
import { TradeAlertComponent } from './trade-alert/trade-alert.component';
import { DialogLogoutComponent } from './dialog-logout/dialog-logout.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ConversionDialogComponent } from './conversion-dialog/conversion-dialog.component';
import { HoldingExitComponent } from './holding-exit/holding-exit.component';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import { CancelExitAllComponent } from './cancel-exit-all/cancel-exit-all.component';
import { ZebulldocComponent } from './zebulldoc/zebulldoc.component';
import { IntroductionComponent } from './zebullDocs/introduction/introduction.component';

import { LoginComponent } from './zebullDocs/login/login.component';
import { Validate2faComponent } from './zebullDocs/validate2fa/validate2fa.component';
import { Save2faComponent } from './zebullDocs/save2fa/save2fa.component';
import { ForgotpasswordComponent } from './zebullDocs/forgotpassword/forgotpassword.component';
import { UnblockuserComponent } from './zebullDocs/unblockuser/unblockuser.component';
import { UserdetailsComponent } from './zebullDocs/userdetails/userdetails.component';
import { SearchComponent } from './zebullDocs/search/search.component';
import { GetlimitsComponent } from './zebullDocs/getlimits/getlimits.component';
import { MarketwatchlistComponent } from './zebullDocs/marketwatchlist/marketwatchlist.component';
import { MarketwatchscripsComponent } from './zebullDocs/marketwatchscrips/marketwatchscrips.component';
import { AddscripsComponent } from './zebullDocs/addscrips/addscrips.component';
import { SortmarketwatchComponent } from './zebullDocs/sortmarketwatch/sortmarketwatch.component';
import { DeletescripsComponent } from './zebullDocs/deletescrips/deletescrips.component';
import { PositionbookComponent } from './zebullDocs/positionbook/positionbook.component';
import { PlaceorderComponent } from './zebullDocs/placeorder/placeorder.component';
import { BracketorderComponent } from './zebullDocs/bracketorder/bracketorder.component';
import { OrderbookComponent } from './zebullDocs/orderbook/orderbook.component';
import { ModifyorderComponent } from './zebullDocs/modifyorder/modifyorder.component';
import { CancelorderComponent } from './zebullDocs/cancelorder/cancelorder.component';
import { OrderhistoryComponent } from './zebullDocs/orderhistory/orderhistory.component';
import { TradebookComponent } from './zebullDocs/tradebook/tradebook.component';
import { ExitbracketorderComponent } from './zebullDocs/exitbracketorder/exitbracketorder.component';
import { PositionconvertionComponent } from './zebullDocs/positionconvertion/positionconvertion.component';
import { ScripsdetailsComponent } from './zebullDocs/scripsdetails/scripsdetails.component';
import { PostmanComponent } from './zebullDocs/postman/postman.component';
import { MarketorderComponent } from './zebullDocs/marketorder/marketorder.component';
import { SquareofpositionComponent } from './zebullDocs/squareofposition/squareofposition.component';
import { HoldingbookComponent } from './zebullDocs/holdingbook/holdingbook.component';
import { PostioninfoComponent } from './postioninfo/postioninfo.component';
import { MobileviewComponent } from './mobileview/mobileview.component';
import { BreakpointObserverService } from './services/breakpoint-observer.service';
import { MobileviewchartComponent } from './mobileviewchart/mobileviewchart.component';
import { ConformationGenerateApikeyComponent } from './conformation-generate-apikey/conformation-generate-apikey.component';
import { IqchartComponent } from './iqchart/iqchart.component';
import { EncryptionkeyComponent } from './zebullDocs/encryptionkey/encryptionkey.component';
import { SessionIdComponent } from './zebullDocs/session-id/session-id.component';
import { PublisherComponent } from './zebullDocs/publisher/publisher.component';
import { NgxCopyToClipboardModule } from 'ngx-copy-to-clipboard';

/* Feature Module */
import { ZebuLoginModule } from './zebu-login/zebu-login.module';

@NgModule({
  declarations: [
    AppComponent,
    ZebuodrGentrComponent,
    ZebuFauthenComponent,
    OrdersComponent,
    ZebuOrderBookComponent,
    MktwatchComponent,
    ShortcutDirective,
    PayoffComponent,
    UnblockUserComponent,
    OrderhistorydialogComponent,
    OrderCancelConfirmDialogBoxComponent,
    PasswordResetComponent,
    MarketstatusComponent,
    SecurityinfoComponent,
    IndexlistComponent,
    OrderPlacedConformationDialogBoxComponent,
    CounterComponent,
    HomeComponent,
    ChartsComponent,
    OrderComponent,
    PositionsComponent,
    HoldingsComponent,
    FundsComponent,
    ProfileComponent,
    SettingsComponent,
    OptionchainComponent,
    CustomersupportComponent,
    NotificationComponent,
    MainComponent,
    TradeAlertComponent,
    DialogLogoutComponent,
    ConversionDialogComponent,
    HoldingExitComponent,
    CancelOrderDialogComponent,
    CancelExitAllComponent,
    ZebulldocComponent,
    // //ZebullDocs
    IntroductionComponent,
    LoginComponent,
    Validate2faComponent,
    Save2faComponent,
    ForgotpasswordComponent,
    UnblockuserComponent,
    UserdetailsComponent,
    SearchComponent,
    GetlimitsComponent,
    MarketwatchlistComponent,
    MarketwatchscripsComponent,
    AddscripsComponent,
    SortmarketwatchComponent,
    DeletescripsComponent,
    PositionbookComponent,
    HoldingsComponent,
    PlaceorderComponent,
    BracketorderComponent,
    OrderbookComponent,
    ModifyorderComponent,
    CancelorderComponent,
    OrderhistoryComponent,
    TradebookComponent,
    ExitbracketorderComponent,
    PositionconvertionComponent,
    ScripsdetailsComponent,
    PostmanComponent,
    MarketorderComponent,
    SquareofpositionComponent,
    HoldingbookComponent,
    PostioninfoComponent,
    MobileviewComponent,
    MobileviewchartComponent,
    ConformationGenerateApikeyComponent,
    IqchartComponent,
    EncryptionkeyComponent,
    SessionIdComponent,
    PublisherComponent,
    // CustomTagComponent,
  ],
  imports: [
    BrowserModule,
    // ChartsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxCopyToClipboardModule,
    // FlexLayoutModule, 
    MatButtonToggleModule,
    NgxUiLoaderModule,
    DataTablesModule,
    AngularDraggableModule,
    DragDropModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatCheckboxModule,
    MatCarouselModule,
    ScrollingModule,
    // ChartsComponent,
    MatProgressBarModule, MatRadioModule, MatSliderModule, MatSlideToggleModule,
    ToastrModule.forRoot(),
    LayoutModule,
    MatSidenavModule,
    MatMenuModule,
    MatBadgeModule,
    ZebuLoginModule
  ],
  entryComponents: [
    CancelExitAllComponent,
    HoldingExitComponent,
    ConversionDialogComponent,
    DialogLogoutComponent,
    OrderhistorydialogComponent,
    // MarketstatusComponent,
    SecurityinfoComponent,
    IndexlistComponent,
    // CustomersupportComponent,
    OrderPlacedConformationDialogBoxComponent,
    TradeAlertComponent,
    CancelOrderDialogComponent,
    PostioninfoComponent,
    ConformationGenerateApikeyComponent
  ],
  exports: [MatIconModule],
  providers: [
    ZebuodrGentrService,
    CounterService,
    AuthguardGuard,
    MktwatchComponent,
    MatBottomSheetModule,
    SharedataserviceService,
    BreakpointObserverService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
