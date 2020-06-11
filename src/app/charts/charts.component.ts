
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AfterViewInit, ElementRef } from '@angular/core';
import * as alertify from 'alertifyjs'
import 'rxjs/add/operator/map';
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, widget } from 'src/assets/charting_library/charting_library.min';
import { ZebuodrGentrService } from 'src/app/services/zebuodr-gentr.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Datafeed } from 'src/app/chart/datafeed';
// import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
// import { WebsocketService } from '../services/websocket.service';
// import { Datafeed } from '../chart/datafeed';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements  OnInit {
  private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'INFY::NSE';
  private _interval: ChartingLibraryWidgetOptions['interval'] = 'D';
  // BEWARE: no trailing slash is expected in feed URL
  private _datafeedUrl = ZebuodrGentrService.chartURL;
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;
  tValue: any;
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  router: any;

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
  constructor(public odgenserv: ZebuodrGentrService,public websocket: WebsocketService) {
  }

  ngOnInit() {
    this.renderChart();
  }

  loadChart(val) {
    let exchange = val['Exchange'];
    if (exchange.toLowerCase() === 'mcx'
      || exchange.toLowerCase() === 'cds'
      || exchange.toLowerCase() === 'nfo') {
      this._symbol = val['TradSym'] + "::" + val['Exchange'];
    } else {
      this._symbol = val['symbolname'] + "::" + val['Exchange'];
    }
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
      // debugger;
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
}