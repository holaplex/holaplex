import { showFirstAndLastFour } from '../utils/string';
import { IFeedItem, IProfile } from './feed.interfaces';

export function generateContent(fi: IFeedItem) {
  const from = (fi.from || fi.nft?.creator) as IProfile;

  const fromDisplay = from.handle || showFirstAndLastFour(from.pubkey);
  const toDisplay = fi.to ? fi.to.handle || showFirstAndLastFour(fi.to.pubkey) : '';

  switch (fi.type) {
    case 'OUTBID':
      return `${fromDisplay} outbid ${toDisplay} on ${fi.nft?.name} with a bid of SOL${fi.solAmount}`;

    case 'BID_MADE':
      return `${fromDisplay} placed a bid of SOL${fi.solAmount} on ${fi.nft?.name} `;

    case 'SALE_PRIMARY':
      return `${fromDisplay} sold ${fi.nft?.name} for SOL${fi.solAmount}`;
    default:
      return 'No content for this activity';
  }
}
