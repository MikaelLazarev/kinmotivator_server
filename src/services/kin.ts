import { KinAccount, KinClient } from '@kinecosystem/kin-sdk-node';
import { createAccountService } from './create';
import { add } from 'winston';
import { Create } from '../controllers/create';
import { getBalanceService } from './balance';
import { payService } from './pay';
import { Pay } from '../controllers/pay';

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

  pay(to: string, amount: number, memo: string) : Promise<string> {
    return payService(this.client, this.account, <Pay>{
      destination: to,
      amount,
      memo
    })
  }

}
