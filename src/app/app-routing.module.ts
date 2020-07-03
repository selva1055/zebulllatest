import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZebuodrGentrComponent } from './zebuodr-gentr/zebuodr-gentr.component';
import { ZebuFauthenComponent } from './zebu-fauthen/zebu-fauthen.component';
import { ZebuOrderBookComponent } from './zebu-order-book/zebu-order-book.component';
import { OrdersComponent } from './orders/orders.component';
import { MktwatchComponent } from './mktwatch/mktwatch.component';
import { AuthguardGuard } from './guard/authguard.guard';
import { PayoffComponent } from './payoff/payoff.component';
import { UnblockUserComponent } from './unblock-user/unblock-user.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { HomeComponent } from './home/home.component';
import { ChartsComponent } from './charts/charts.component';
import { OrderComponent } from './order/order.component';
import { PositionsComponent } from './positions/positions.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { FundsComponent } from './funds/funds.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { OptionchainComponent } from './optionchain/optionchain.component';
import { MainComponent } from './main/main.component';
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
import { ModifyorderComponent } from './zebullDocs/modifyorder/modifyorder.component';
import { OrderbookComponent } from './zebullDocs/orderbook/orderbook.component';
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
import { MobileviewComponent } from './mobileview/mobileview.component';
import { MobileviewchartComponent } from './mobileviewchart/mobileviewchart.component';
import { IqchartComponent } from './iqchart/iqchart.component';
import { EncryptionkeyComponent } from './zebullDocs/encryptionkey/encryptionkey.component';
import { SessionIdComponent } from './zebullDocs/session-id/session-id.component';
import { MarketstatusComponent } from './marketstatus/marketstatus.component';
import { CustomersupportComponent } from './customersupport/customersupport.component';
import { PublisherComponent } from './zebullDocs/publisher/publisher.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import(
      './zebu-login/zebu-login.module'
    ).then(m => m.ZebuLoginModule)
  },
  { path: 'iqchart', component: IqchartComponent },
  { path: 'fauthen', component: ZebuFauthenComponent },
  { path: 'ordergen', component: ZebuodrGentrComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthguardGuard] },
  { path: 'zebuorderbk', component: ZebuOrderBookComponent, canActivate: [AuthguardGuard] },
  // { path: 'zebuMWLst', component: MktwatchComponent, canActivate: [AuthguardGuard] },
  { path: 'payoff', component: PayoffComponent, canActivate: [AuthguardGuard] },
  { path: 'unblock', component: UnblockUserComponent },
  // { path: 'passReset', component: PasswordResetComponent },
  {
    path: 'homes', component: MobileviewComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'marketstatus', component: MarketstatusComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'mwchart', component: MobileviewchartComponent },
      { path: 'customersupport', component: CustomersupportComponent },
      { path: 'passReset', component: PasswordResetComponent },
    ]
  },
  { path: 'optionchain', component: OptionchainComponent },
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'iqchart', component: IqchartComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'orders', component: OrderComponent },
      { path: 'positions', component: PositionsComponent },
      { path: 'positions', component: PositionsComponent },
      { path: 'holdings', component: HoldingsComponent },
      { path: 'funds', component: FundsComponent },
      { path: 'marketstatus', component: MarketstatusComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'main', component: MainComponent },
      { path: 'customersupport', component: CustomersupportComponent },
      { path: 'passReset', component: PasswordResetComponent },
    ]
  },
  {
    path: 'zebullDoc', component: ZebulldocComponent,
    children: [
      { path: '', redirectTo: 'intro', pathMatch: 'full' },
      { path: 'intro', component: IntroductionComponent },
      { path: 'login', component: LoginComponent },
      { path: 'validate2fa', component: Validate2faComponent },
      { path: 'save2fa', component: Save2faComponent },
      { path: 'forgotpassword', component: ForgotpasswordComponent },
      { path: 'unblockuser', component: UnblockuserComponent },
      { path: 'userdetails', component: UserdetailsComponent },
      { path: 'search', component: SearchComponent },
      { path: 'getlimits', component: GetlimitsComponent },
      { path: 'marketwatchList', component: MarketwatchlistComponent },
      { path: 'marketwatchScrips', component: MarketwatchscripsComponent },
      { path: 'addScrips', component: AddscripsComponent },
      { path: 'sortmarketwatch', component: SortmarketwatchComponent },
      { path: 'deleteScrips', component: DeletescripsComponent },
      { path: 'positionBook', component: PositionbookComponent },
      { path: 'holdingBook', component: HoldingbookComponent },
      { path: 'placeOrder', component: PlaceorderComponent },
      { path: 'bracketOrder', component: BracketorderComponent },
      { path: 'orderBook', component: OrderbookComponent },
      { path: 'modifyOrder', component: ModifyorderComponent },
      { path: 'cancelOrder', component: CancelorderComponent },
      { path: 'orderHistory', component: OrderhistoryComponent },
      { path: 'tradebook', component: TradebookComponent },
      { path: 'exitBracketorder', component: ExitbracketorderComponent },
      { path: 'positionconvertion', component: PositionconvertionComponent },
      { path: 'scripsdetails', component: ScripsdetailsComponent },
      { path: 'postman', component: PostmanComponent },
      { path: 'marketorder', component: MarketorderComponent },
      { path: 'squareofposition', component: SquareofpositionComponent },
      { path: 'encryptionkey', component: EncryptionkeyComponent },
      { path: 'session-id', component: SessionIdComponent },
      { path: 'publisher', component: PublisherComponent },


    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        // enableTracing: true,
        useHash: true
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
