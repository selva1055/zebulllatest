import {
	Bar,
	HistoryMetadata,
	LibrarySymbolInfo,
} from '../../assets/charting_library/datafeed-api';

import {
	getErrorMessage,
	RequestParams,
	UdfErrorResponse,
	UdfOkResponse,
	UdfResponse,
} from './helpers';

import { Requester } from './requester';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';



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

export interface GetBarsResult {
	bars: Bar[];
	meta: HistoryMetadata;
}

export class HistoryProvider {
	private _datafeedUrl: string;
	private readonly _requester: Requester;
	private commonServ: ZebuodrGentrService;
	NSE: any = {
		from: "09:15:00",
		to: "15:30:00"
	};

	CDS: any = {
		from: "09:00:00",
		to: "17:30:00"
	};

	MCX: any = {
		from: "09:00:00",
		to: "23:30:00"
	};
	todayData = { o: [], h: [], l: [], c: [], v: [], t: [] };
	public constructor(datafeedUrl: string, requester: Requester, service: ZebuodrGentrService) {
		this._datafeedUrl = datafeedUrl;
		this._requester = requester;
		this.commonServ = service;
	}

	public getBars(symbolInfo: LibrarySymbolInfo, resolution: string, rangeStartDate: number, rangeEndDate: number): Promise<GetBarsResult> {

		let userData = { "userId": this.commonServ.getUserId() };
		const requestParams: RequestParams = {
			symbol: symbolInfo.ticker || '',
			resolution: resolution,
			from: rangeStartDate,
			to: rangeEndDate,
			exchange: symbolInfo.exchange,
			user: JSON.stringify(userData)
		};
		return new Promise((resolve: (result: GetBarsResult) => void, reject: (reason: string) => void) => {
			this._requester.sendRequest<HistoryResponse>(this._datafeedUrl, 'history', requestParams)
				.then((response: HistoryResponse | UdfErrorResponse) => {
					if (response.s !== 'ok' && response.s !== 'no_data') {
						reject(response.errmsg);
						return;
					} else {
						this.todayData['o'].map(item => {
							response['o'].push(item);
						})
						this.todayData['h'].map(item => {
							response['h'].push(item);
						})
						this.todayData['l'].map(item => {
							response['l'].push(item);
						})
						this.todayData['c'].map(item => {
							response['c'].push(item);
						})
						this.todayData['v'].map(item => {
							response['v'].push(item);
						})
						this.todayData['t'].map(item => {
							response['t'].push(item);
						})
					}

					const bars: Bar[] = [];
					const meta: HistoryMetadata = {
						noData: false,
					};
					
					if (response.s === 'no_data') {
						meta.noData = true;
						meta.nextTime = response.nextTime;
					} else {
						
						const volumePresent = response.v !== undefined;
						const ohlPresent = response.o !== undefined;
						for (let i = 0; i < response.t.length; ++i) {
							const barValue: Bar = {
								time: response.t[i] * 1000,
								close: Number(response.c[i]),
								open: Number(response.c[i]),
								high: Number(response.c[i]),
								low: Number(response.c[i]),
							};
							if (ohlPresent) {
								barValue.open = Number((response as HistoryFullDataResponse).o[i]);
								barValue.high = Number((response as HistoryFullDataResponse).h[i]);
								barValue.low = Number((response as HistoryFullDataResponse).l[i]);
							}

							if (volumePresent) {
								barValue.volume = Number((response as HistoryFullDataResponse).v[i]);
							}

							bars.push(barValue);
						}
						const finalBar = bars[bars.length-1];
						localStorage.setItem("finalBarTime", JSON.stringify(finalBar));
					}

					resolve({
						bars: bars,
						meta: meta,
					});
				})
				.catch((reason?: string | Error) => {
					const reasonString = getErrorMessage(reason);
					console.warn(`HistoryProvider: getBars() failed, error=${reasonString}`);
					reject(reasonString);
				});
		});
	}



}
