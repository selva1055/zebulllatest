import { Component, OnInit, Input } from '@angular/core';
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, widget } from 'src/assets/charting_library/charting_library.min';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Datafeed } from '../chart/datafeed';
import { WebsocketService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { SharedataserviceService } from '../services/sharedataservice.service';
@Component({
  selector: 'app-mobileviewchart',
  templateUrl: './mobileviewchart.component.html',
  styleUrls: ['./mobileviewchart.component.scss']
})
export class MobileviewchartComponent implements OnInit {
  private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'NIFTY 50::NSE::Index';
  private _interval: ChartingLibraryWidgetOptions['interval'] = 'D';
  // BEWARE: no trailing slash is expected in feed URL
  private _datafeedUrl = ZebuodrGentrService.chartURL;
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  
  @Input()
  set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
    this._symbol = symbol || this._symbol;
  }

  @Input()
  set intervalChart(interval1: ChartingLibraryWidgetOptions['interval']) {
    this._interval = interval1 || this._interval;
  }

  @Input()
  set datafeedUrl(datafeedUrl: string) {
    this._datafeedUrl = datafeedUrl || this._datafeedUrl;
  }

  @Input()
  set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
    this._libraryPath = libraryPath || this._libraryPath;
  }

  @Input()
  set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
    this._fullscreen = fullscreen || this._fullscreen;
  }

  @Input()
  set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
    this._autosize = autosize || this._autosize;
  }

  @Input()
  set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
    this._containerId = containerId || this._containerId;
  }
  constructor(public odgenserv: ZebuodrGentrService,
    public websocket: WebsocketService,
    public dataService: SharedataserviceService,
    public routeTo: Router) { }

  ngOnInit() {
    this.renderChart();
  }

   /**
   * @method Method to set trading view chart
   * @params na
   * @return na
   * @author Babin 
   * @on 26-06-2019
   */
  renderChart() {
    if (localStorage.getItem("mobileindexGraph") != null || localStorage.getItem("mobileindexGraph") != undefined) {
      this._symbol = localStorage.getItem("mobileindexGraph");
      localStorage.removeItem("mobileindexGraph")
    }
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this._symbol,
      datafeed: new Datafeed(this._datafeedUrl, 10000, this.odgenserv, this.websocket),
      interval: this._interval,
      container_id: this._containerId,
      library_path: this._libraryPath,
      locale: 'en',
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      disabled_features: ['timezone_menu', 'left_toolbar', 'timeframes_toolbar', 'header_compare', 'header_symbol_search'],
      charts_storage_url: this._chartsStorageUrl
    };
    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;
    tvWidget.onChartReady(() => {
    });
  }

  backToHome(){
    this.dataService.goToBackHomePageMobileView(true);
    this.routeTo.navigate(['/homes']);
  }

}
