import {
	LibrarySymbolInfo,
	SubscribeBarsCallback,
	Bar,
	HistoryMetadata
} from '../../assets/charting_library/datafeed-api';

import {
	GetBarsResult,
	HistoryProvider,
} from './history-provider';

import {
	getErrorMessage,
	logMessage,
	RequestParams,
	UdfErrorResponse,
	UdfOkResponse,
	UdfResponse,
} from './helpers';

interface DataSubscriber {
	symbolInfo: LibrarySymbolInfo;
	resolution: string;
	lastBarTime: number | null;
	listener: SubscribeBarsCallback;
}

interface DataSubscribers {
	[guid: string]: DataSubscriber;
}

interface HistoryPartialDataResponse extends UdfOkResponse {
	t: number[];
	c: number[];
	o?: never;
	h?: never;
	l?: never;
	v?: never;
}

interface HistoryFullDataResponse extends UdfOkResponse {
	t: number[];
	c: number[];
	o: number[];
	h: number[];
	l: number[];
	v: number[];
}

interface HistoryNoDataResponse extends UdfResponse {
	s: 'no_data';
	nextTime?: number;
}

type HistoryResponse = HistoryFullDataResponse | HistoryPartialDataResponse | HistoryNoDataResponse;

import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { WebsocketService } from '../services/websocket.service';

import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

export class DataPulseProvider {
	private readonly _subscribers: DataSubscribers = {};
	private _requestsPending: number = 0;
	private readonly _historyProvider: HistoryProvider;
	private commonServ: ZebuodrGentrService;
	private websocketServ: WebsocketService;
	public chartFeed: Subject<any>;
	isSubscribed: boolean = false;
	prevBar: any;
	lastSubMin = 0;
	lastUpdatedVolume = 0;
	tradedVolume = 0;
	lotSize = 0;
	open = false;
	high = 0;
	low = 0;
	close = 0;
	_ifonsecall: Boolean = false;
	public ignoreList = ["W", "M", "6M"];
	prevRes: any = "";
	currBarVol = 0;
	hbCounter = 0;
	chartlist: any;
	_previous_res: any;
	_res: any = 'D';
	brackTime: Number = 0;
	lastbarbracktime: any;
	public constructor(historyProvider: HistoryProvider, updateFrequency: number, service: ZebuodrGentrService, websocket: WebsocketService) {
		this._historyProvider = historyProvider;
		this.commonServ = service;
		this.websocketServ = websocket;
		this.chartlist = JSON.parse(localStorage.getItem('currentGraph'));
		// console.log("chartlist" + this.chartlist)
		if (this.chartlist != undefined || this.chartlist != null) {
			this.tradedVolume = Number(this.chartlist['volume']);
			this.lotSize = Number(this.chartlist['lot']);
		}
		setInterval(this._updateData.bind(this), 500);
	}

	public subscribeToMapData(listenerGuid) {
		const subscriptionRecord = this._subscribers[listenerGuid];
		// console.log(subscriptionRecord)
		this.hbCounter = Number(Date.now());
		this._res = subscriptionRecord['resolution'];
		// console.log(this._res, subscriptionRecord['resolution'])
		this._previous_res = subscriptionRecord['resolution'];
		let ticker: any = "";
		if (subscriptionRecord['symbolInfo']['exchange'].includes("::index")) {
			ticker = subscriptionRecord['symbolInfo']['description'];
			// console.log(ticker)
		} else {
			ticker = subscriptionRecord['symbolInfo']['ticker'];
		}
		if (this.ignoreList.indexOf(this._res) >= 0) {
			return;
		}

		if (!this.isSubscribed && this.prevRes != this._res) {
			// this.getShowQuotes(subscriptionRecord['symbolInfo']['exchange'], ticker);
		}
		this.prevRes = this._res;
		/** Get the current market information for the scrip */
		// this.getShowQuotes(subscriptionRecord['symbolInfo']['exchange'], ticker)

		this.commonServ.getNavChangeEmitter().subscribe(resultData => {
			let res = JSON.parse(resultData);
			for (let tik in res) {
				if (res[tik]['name'] == 'sf') {
					if (res[tik]['ltt'] != undefined && res[tik]['ltt'] != 'NA' &&
						res[tik]['tk'] != undefined && res[tik]['tk'] != 'NA' && res[tik]['tk'] == ticker) {
						
						let tempDate = res[tik]['ltt'].split(" ");
						const [day, month, year] = tempDate[0].split("/")
						var date = new Date(month + "/" + day + "/" + year + " " + tempDate[1]);
						var milliseconds = date.getTime() + (330 * 60 * 1000);
						const bars: Bar[] = [];
						const meta: HistoryMetadata = {
							noData: false,
						}
						this.isSubscribed = true;
						const volumePresent = res[tik]['v'] !== undefined;
						const ohlPresent = res[tik]['op'] !== undefined;


						if (localStorage.getItem("finalBarTime") != undefined || localStorage.getItem("finalBarTime") != null) {
							bars.push(JSON.parse(localStorage.getItem("finalBarTime")));
							this.lastbarbracktime = bars[bars.length - 1]['time'];
							if (this._res == 'D' || this._res == '1D') {

							} else if (this._res == '1') {
								this.brackTime = this.lastbarbracktime + Number(1) * 1000;
							} else if (this._res == '5') {
								this.brackTime = this.lastbarbracktime + (Number(5) * (60 * 1000));
							} else if (this._res == '10') {
								this.brackTime = this.lastbarbracktime + (Number(10) * (60 * 1000));
							} else if (this._res == '15') {
								this.brackTime = this.lastbarbracktime + (Number(15) * (60 * 1000));
							} else if (this._res == '30') {
								this.brackTime = this.lastbarbracktime + (Number(30) * (60 * 1000));
							} else if (this._res == '60') {
								this.brackTime = this.lastbarbracktime + (Number(60) * (60 * 1000));
							} else {
								this.brackTime = this.lastbarbracktime + (Number(this._res) * (60 * 1000));
							}
						}
						let barValue: Bar = null;
						// console.log(milliseconds, this.lastbarbracktime, this.brackTime)
						if (this._res == 'D' || this._res == '1D') {
							barValue = {
								time: milliseconds,
								close: Number(this.chartlist['close']),
								open: Number(this.chartlist['open']),
								high: Number(this.chartlist['high']),
								low: Number(this.chartlist['low']),
							};
						} else {
							if (milliseconds <= this.brackTime) {
								barValue = {
									time: this.lastbarbracktime,
									close: Number(res[tik]['ltp']),
									open: Number(res[tik]['ltp']),
									high: Number(res[tik]['ltp']),
									low: Number(res[tik]['ltp']),
								};
							} else {
								barValue = {
									time: Number(this.brackTime),
									close: Number(res[tik]['ltp']),
									open: Number(res[tik]['ltp']),
									high: Number(res[tik]['ltp']),
									low: Number(res[tik]['ltp']),
								};
							}
						}

						if (ohlPresent) {
							barValue.open = Number(((res[tik] as HistoryFullDataResponse)['op']));
							barValue.high = Number(((res[tik] as HistoryFullDataResponse)['h']));
							barValue.low = Number(((res[tik] as HistoryFullDataResponse)['lo']));
						}

						if (volumePresent) {
							let vol = Number(((res[tik] as HistoryFullDataResponse)['v']));
							this.currBarVol = vol - this.tradedVolume;
							barValue.volume = Number(this.currBarVol) * this.lotSize;
						}

						if (this.lastSubMin == 0) {
							bars.push(JSON.parse(localStorage.getItem("finalBarTime")));
							this._subscribers[listenerGuid].lastBarTime = bars[bars.length - 1]['time'];
						}

						if (this.prevBar) {
							if (!this.open) {
								this.prevBar.open = Number(res[tik]['ltp'])
								this.open = true;
							}
							if (Number(res[tik]['ltp']) > this.prevBar.high) {
								this.prevBar.high = Number(res[tik]['ltp'])
							}
							if (Number(res[tik]['ltp']) < this.prevBar.low) {
								this.prevBar.low = Number(res[tik]['ltp'])
							}
							this.prevBar.close = Number(res[tik]['ltp'])
							this.prevBar.volume = Number(this.currBarVol) * this.lotSize;
							bars.push(this.prevBar);
						}
						bars.push(barValue);
						var result = {
							bars: bars,
							meta: meta,
						};
						this._onSubscriberDataReceived(listenerGuid, result);
					}
				} else if (res[tik]['name'] == 'if') {
					if (res[tik]['tvalue'] != undefined && res[tik]['tvalue'] != 'NA' &&
						res[tik]['tk'] != undefined && res[tik]['tk'] != 'NA' && res[tik]['tk'] == ticker) {
						// console.log(res[tik]['tvalue'])
						let tempDate = res[tik]['tvalue'].split(" ");
						const [day, month, year] = tempDate[0].split("-");
						var date = new Date(month + "/" + day + "/" + year + " " + tempDate[1]);
						var milliseconds = date.getTime() + (330 * 60 * 1000);
						
						const bars: Bar[] = [];
						const meta: HistoryMetadata = {
							noData: false,
						}
						this.isSubscribed = true;
						const volumePresent = res[tik]['iv'] !== undefined;
						const ohlPresent = res[tik]['iov'] !== undefined;
						var current_milliseconds: any;
						if (localStorage.getItem("finalBarTime") != undefined || localStorage.getItem("finalBarTime") != null) {
							bars.push(JSON.parse(localStorage.getItem("finalBarTime")));
							this.lastbarbracktime = bars[bars.length - 1]['time'];
							if (this._res == 'D' || this._res == '1D') {

							} else if (this._res == '1') {
								this.brackTime = this.lastbarbracktime + Number(1) * 1000;
								current_milliseconds = milliseconds;
							} else if (this._res == '5') {
								this.brackTime = this.lastbarbracktime + (Number(5) * (60 * 1000));
								if (milliseconds <= this.brackTime) {
									current_milliseconds = this.lastbarbracktime;
								} else {
									current_milliseconds = milliseconds;
								}
							} else if (this._res == '10') {
								this.brackTime = this.lastbarbracktime + (Number(10) * (60 * 1000));
								if (milliseconds <= this.brackTime) {
									current_milliseconds = this.lastbarbracktime;
								} else {
									current_milliseconds = milliseconds;
								}
							} else if (this._res == '15') {
								this.brackTime = this.lastbarbracktime + (Number(15) * (60 * 1000));
								if (milliseconds <= this.brackTime) {
									current_milliseconds = this.lastbarbracktime;
								} else {
									current_milliseconds = milliseconds;
								}
							} else if (this._res == '30') {
								this.brackTime = this.lastbarbracktime + (Number(30) * (60 * 1000));
								if (milliseconds <= this.brackTime) {
									current_milliseconds = this.lastbarbracktime;
								} else {
									current_milliseconds = milliseconds;
								}
							} else if (this._res == '60') {
								this.brackTime = this.lastbarbracktime + (Number(60) * (60 * 1000));
								if (milliseconds <= this.brackTime) {
									current_milliseconds = this.lastbarbracktime;
								} else {
									current_milliseconds = milliseconds;
								}
							} else {
								this.brackTime = this.lastbarbracktime + (Number(this._res) * (60 * 1000));
							}
						}

						let barValue: Bar = null;
						if (this._res == 'D' || this._res == '1D') {
							barValue = {
								time: milliseconds,
								close: Number(res[tik]['iv']),
								open: Number(res[tik]['iov']),
								high: Number(res[tik]['ihv']),
								low: Number(res[tik]['ilv']),
							};
						} else {
							barValue = {
								time: current_milliseconds,
								close: Number(res[tik]['iv']),
								open: Number(res[tik]['iv']),
								high: Number(res[tik]['iv']),
								low: Number(res[tik]['iv']),
							};
						}

						if (ohlPresent) {
							barValue.open = Number(((res[tik] as HistoryFullDataResponse)['iov']));
							barValue.high = Number(((res[tik] as HistoryFullDataResponse)['ihv']));
							barValue.low = Number(((res[tik] as HistoryFullDataResponse)['ilv']));
						}

						if (volumePresent) {
							let vol = Number(((res[tik] as HistoryFullDataResponse)['iv']));
							this.currBarVol = vol - this.tradedVolume;
							barValue.volume = Number(this.currBarVol) * this.lotSize;
						}

						if (this.lastSubMin == 0) {
							bars.push(JSON.parse(localStorage.getItem("finalBarTime")));
							// console.log(this._subscribers[listenerGuid])
							if (this._subscribers[listenerGuid] != undefined || this._subscribers[listenerGuid] != null) {
								if (this._subscribers[listenerGuid]['lastBarTime'] != undefined) {
									this._subscribers[listenerGuid]['lastBarTime'] = bars[bars.length - 1]['time'];
								}
							}
						}
						if (this._res == 'D' || this._res == '1D') {
							if (this.prevBar) {
								if (!this.open) {
									this.prevBar.open = Number(res[tik]['iov'])
									this.open = true;
								}
								if (Number(res[tik]['iv']) > this.prevBar.high) {
									this.prevBar.high = Number(res[tik]['iv'])
								}
								if (Number(res[tik]['iv']) < this.prevBar.low) {
									this.prevBar.low = Number(res[tik]['iv'])
								}
								this.prevBar.close = Number(res[tik]['iv'])
								this.prevBar.volume = Number(this.currBarVol) * this.lotSize;
								bars.push(this.prevBar);
							}
						} else {
							if (this.prevBar) {
								if (!this.open) {
									this.prevBar.open = Number(res[tik]['iv'])
									this.open = true;
								}
								if (Number(res[tik]['iv']) > this.prevBar.high) {
									this.prevBar.high = Number(res[tik]['iv'])
								}
								if (Number(res[tik]['iv']) < this.prevBar.low) {
									this.prevBar.low = Number(res[tik]['iv'])
								}
								this.prevBar.close = Number(res[tik]['iv'])
								this.prevBar.volume = Number(this.currBarVol) * this.lotSize;
								bars.push(this.prevBar);
							}
						}
						var count = 1; 
						// console.log(count++,barValue)
						bars.push(barValue);
						var result = {
							bars: bars,
							meta: meta,
						};
						this._onSubscriberDataReceived(listenerGuid, result);
						// const subscriptionRecord = this._subscribers[listenerGuid];
						// subscriptionRecord.listener(bars[0]);
					}
				}
			}
		})
	}

	//Method to get show quotes
	getShowQuotes(exch, scrip) {
		var jsonSendObj = {
			'Exchange': exch,
			'Symbol': scrip,
		}
		// console.log("here")
		// var uid = this.commonServ.encryptBlock(JSON.stringify(jsonSendObj), this.commonServ.sPubKey4, this.commonServ.keySize);
		// var hashData = this.commonServ.crypto(this.commonServ.sPubKey4); //Hash the key used for encryption
		// var pUrl = this.commonServ.baseUrl + this.commonServ.showQuote + "?jsessionid=." + this.commonServ.jSessionId + "&jData=" + uid + "&jKey=" + hashData;
		// this.commonServ.ajaxCallService(pUrl, this.commonServ.post, "").then(result => {
		// 	if (result['Emsg'] != "Session Expired") {

		// 	}
		// })

		var jsonData = {
			"exch": exch,
			"symbol": scrip,
			"userId": this.commonServ.getUserId(),
			"userSessionID": this.commonServ.getSessionToken()
		}
		this.commonServ.sendScriptTokenDepth(jsonData).subscribe(res => {
			// console.log(res);
			this.tradedVolume = Number(res['TradeVolume']);
			this.lotSize = Number(res['BodLotQty']);
		}, (err) => {
			console.log(err.error)
		});
	}

	public subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: string, newDataCallback: SubscribeBarsCallback, listenerGuid: string): void {
		if (this._subscribers.hasOwnProperty(listenerGuid)) {
			logMessage(`DataPulseProvider: already has subscriber with id=${listenerGuid}`);
			return;
		}

		this._subscribers[listenerGuid] = {
			lastBarTime: null,
			listener: newDataCallback,
			resolution: resolution,
			symbolInfo: symbolInfo,
		};
		logMessage(`DataPulseProvider: subscribed for #${listenerGuid} - {${symbolInfo.name}, ${resolution}}`);
	}

	public unsubscribeBars(listenerGuid: string): void {
		delete this._subscribers[listenerGuid];
		logMessage(`DataPulseProvider: unsubscribed for #${listenerGuid}`);
	}

	private _updateData(): void {
		this._requestsPending = 0;

		for (const listenerGuid in this._subscribers) { // tslint:disable-line:forin
			this._requestsPending += 1;
			const subscriptionRecord = this._subscribers[listenerGuid];
			let _res = subscriptionRecord['resolution'];

			this.subscribeToMapData(listenerGuid);

			// this._updateDataForSubscriber(listenerGuid)
			// 	.then(() => {
			// 		this._requestsPending -= 1;
			// 		logMessage(`DataPulseProvider: data for #${listenerGuid} updated successfully, pending=${this._requestsPending}`);
			// 	})
			// 	.catch((reason?: string | Error) => {
			// 		this._requestsPending -= 1;
			// 		logMessage(`DataPulseProvider: data for #${listenerGuid} updated with error=${getErrorMessage(reason)}, pending=${this._requestsPending}`);
			// 	});
		}
	}

	// private _updateData(): void {
	// 	// debugger;
	// 	this._requestsPending = 0;
	// 	for (const listenerGuid in this._subscribers) { // tslint:disable-line:forin
	// 		this._requestsPending += 1;
	// 		if (!this.isSubscribed) {
	// 			this.subscribeToMapData(listenerGuid);
	// 		}

	// 		// this._updateDataForSubscriber(listenerGuid)
	// 		// 	.then(() => {
	// 		// 		this._requestsPending -= 1;
	// 		// 		logMessage(`DataPulseProvider: data for #${listenerGuid} updated successfully, pending=${this._requestsPending}`);
	// 		// 	})
	// 		// 	.catch((reason?: string | Error) => {
	// 		// 		this._requestsPending -= 1;
	// 		// 		logMessage(`DataPulseProvider: data for #${listenerGuid} updated with error=${getErrorMessage(reason)}, pending=${this._requestsPending}`);
	// 		// 	});
	// 	}
	// }

	private _updateDataForSubscriber(listenerGuid: string): Promise<void> {
		const subscriptionRecord = this._subscribers[listenerGuid];
		const rangeEndTime = parseInt((Date.now() / 1000).toString());
		// BEWARE: please note we really need 2 bars, not the only last one
		// see the explanation below. `10` is the `large enough` value to work around holidays
		const rangeStartTime = rangeEndTime - periodLengthSeconds(subscriptionRecord.resolution, 10);
		// console.log("rangeStartTime - ", rangeStartTime + " rangeEndTime-" + rangeEndTime)
		return this._historyProvider.getBars(subscriptionRecord.symbolInfo, subscriptionRecord.resolution, rangeStartTime, rangeEndTime)
			.then((result: GetBarsResult) => {
				this._onSubscriberDataReceived(listenerGuid, result);
			});
	}

	private _onSubscriberDataReceived(listenerGuid: string, result: GetBarsResult): void {
		// means the subscription was cancelled while waiting for data
		if (!this._subscribers.hasOwnProperty(listenerGuid)) {
			logMessage(`DataPulseProvider: Data comes for already unsubscribed subscription #${listenerGuid}`);
			return;
		}

		const bars = result.bars;
		if (bars.length === 0) {
			return;
		}

		const lastBar = bars[bars.length - 1];
		const subscriptionRecord = this._subscribers[listenerGuid];
		// console.log(subscriptionRecord)
		let minutesValue = 60000;//1000*60
		if (subscriptionRecord['resolution'] == 'D' || subscriptionRecord['resolution'] == '1D') {
			minutesValue = minutesValue * 24 * 60;
		} else {
			minutesValue = minutesValue * Number(subscriptionRecord['resolution']);
		}
		let lastBarDate = new Date(lastBar.time);
		// console.log(lastBarDate.getTime() , minutesValue)
		let lastBarMin = Math.ceil(lastBarDate.getTime() / minutesValue);
		// console.log(lastBarMin)
		if (subscriptionRecord.lastBarTime != null) {
			var subscribedDate = new Date(subscriptionRecord.lastBarTime);
			this.lastSubMin = Math.ceil(subscribedDate.getTime() / minutesValue);
		}
		// console.log(lastBarMin, this.lastSubMin)
		if (lastBarMin <= this.lastSubMin) {
			subscriptionRecord.lastBarTime = lastBar.time;
			const previousBar = bars[bars.length - 2];
			this.prevBar = previousBar;
			subscriptionRecord.listener(previousBar);
			// this.tradedVolume = this.tradedVolume + this.currBarVol;
		} else {
			subscriptionRecord.lastBarTime = lastBar.time;
			this.prevBar = lastBar;
			this.tradedVolume = this.tradedVolume + this.currBarVol;
			this.currBarVol = 0;
			this.open = false;
			subscriptionRecord.listener(lastBar);
		}
	}
	// private _onSubscriberDataReceived(listenerGuid: string, result: GetBarsResult): void {
	// 	// means the subscription was cancelled while waiting for data
	// 	if (!this._subscribers.hasOwnProperty(listenerGuid)) {
	// 		logMessage(`DataPulseProvider: Data comes for already unsubscribed subscription #${listenerGuid}`);
	// 		return;
	// 	}

	// 	const bars = result.bars;
	// 	if (bars.length === 0) {
	// 		return;
	// 	}

	// 	const lastBar = bars[bars.length - 1];
	// 	const subscriptionRecord = this._subscribers[listenerGuid];
	// 	let lastBarDate = new Date(lastBar.time);
	// 	let lastBarMin = Math.ceil(lastBarDate.getTime() / 60000);

	// 	if (subscriptionRecord.lastBarTime != null) {
	// 		var subscribedDate = new Date(subscriptionRecord.lastBarTime);
	// 		this.lastSubMin = Math.ceil(subscribedDate.getTime() / 60000);
	// 	}
	// 	if (lastBarMin <= this.lastSubMin) {
	// 		subscriptionRecord.lastBarTime = lastBar.time;
	// 		const previousBar = bars[bars.length - 2];
	// 		this.prevBar = previousBar;
	// 		subscriptionRecord.listener(previousBar);
	// 		// this.tradedVolume = this.tradedVolume + this.currBarVol;
	// 	} else {
	// 		subscriptionRecord.lastBarTime = lastBar.time;
	// 		this.prevBar = lastBar;
	// 		this.tradedVolume = this.tradedVolume + this.currBarVol;
	// 		this.currBarVol = 0;
	// 		this.open = false;
	// 		subscriptionRecord.listener(lastBar);
	// 	}
	// }
}

// 	private _onSubscriberDataReceived(listenerGuid: string, result: GetBarsResult): void {
// 		// means the subscription was cancelled while waiting for data
// 		if (!this._subscribers.hasOwnProperty(listenerGuid)) {
// 			logMessage(`DataPulseProvider: Data comes for already unsubscribed subscription #${listenerGuid}`);
// 			return;
// 		}

// 		console.log("result", result);

// 		const bars = result.bars;
// 		if (bars.length === 0) {
// 			return;
// 		}

// 		const lastBar = bars[bars.length - 1];
// 		const subscriptionRecord = this._subscribers[listenerGuid];

// 		if (subscriptionRecord.lastBarTime !== null && lastBar.time < subscriptionRecord.lastBarTime) {
// 			return;
// 		}
// 	console.log("subscriptionRecord.lastBarTime ::::::::::: " + subscriptionRecord.lastBarTime);
// 	console.log("lastBar.time ------------- ::::::::" + lastBar.time);
// 		const isNewBar = subscriptionRecord.lastBarTime !== null && lastBar.time > subscriptionRecord.lastBarTime;

// 		// Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
// 		// old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
// 		if (isNewBar) {
// 			if (bars.length < 2) {
// 				throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
// 			}
// 			const previousBar = bars[bars.length - 2];
// 			subscriptionRecord.listener(previousBar);
// 		}		
// 		subscriptionRecord.lastBarTime = lastBar.time;
// 		subscriptionRecord.listener(lastBar);
// 	}
// }

function periodLengthSeconds(resolution: string, requiredPeriodsCount: number): number {
	let daysCount = 0;
	// debugger;
	// console.log("Resolution" + resolution);
	if (resolution === 'D' || resolution === '1D') {
		daysCount = requiredPeriodsCount;
	} else if (resolution === 'M' || resolution === '1M') {
		daysCount = 31 * requiredPeriodsCount;
	} else if (resolution === 'W' || resolution === '1W') {
		daysCount = 7 * requiredPeriodsCount;
	} else {
		daysCount = requiredPeriodsCount * parseInt(resolution) / (24 * 60);
	}

	return daysCount * 24 * 60 * 60;
}
