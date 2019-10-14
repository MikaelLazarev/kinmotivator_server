import { KinAccount, KinClient } from '@kinecosystem/kin-sdk-node';
import { createAccountService } from './kin/create';
import { Create } from '../controllers/_old/create';
import { getBalanceService } from './kin/balance';
import { whitelistService } from './kin/whitelist';
import { Whitelist } from '../controllers/_old/whitelist';

export class KinService {
  account : KinAccount
  client: KinClient

  constructor(client : KinClient, account : KinAccount) {
    this.account = account
    this.client = client
  }

  createAccount(address: string) : Promise<string> {
    return createAccountService(this.client, this.account, <Create>{ destination: address, starting_balance: 100, memo: "KinMotivator"})
  }


  getBalance(address: string) : Promise<number> {

    return getBalanceService(this.client, address)

  }

  pay(envelope: string, networkId: string) : Promise<string> {
    return whitelistService(this.account, <Whitelist>{
      envelope,
      network_id: networkId
    })
  }

}
