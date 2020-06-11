import { Datafeedbase } from './datafeedbase';
import { QuotesProvider } from './quotes-provider';
import { Requester } from './requester';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { WebsocketService } from '../services/websocket.service';



export class Datafeed extends Datafeedbase{

	public constructor(datafeedURL: string, updateFrequency: number = 10 * 1000,sharedata :ZebuodrGentrService,websocket:WebsocketService) {
		const requester = new Requester();
		const quotesProvider = new QuotesProvider(datafeedURL, requester);		
		super(datafeedURL, quotesProvider, requester, updateFrequency,sharedata,websocket);
	}

}
