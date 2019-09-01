import {createApp} from "../../src/app";
import {KeyPair, KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import {getKinAccount} from "../../src/init";
import {AccountNotFoundError, TransactionNotFoundError} from "../../src/errors";
import {config, MEMO_TEMPLATE, MEMO_CAP, VERSION, INTEGRATION_ENVIRONMENT} from "../environment";

const request = require('supertest');

describe('Test routes', () => {
	let app: any;
	let account: KinAccount;

	const client = new KinClient(INTEGRATION_ENVIRONMENT);
	const configKeypair = KeyPair.fromSeed(config.SEED);
	const destination = 'GB26SXD5FXCGHZJKZQARJBYBG43YYSWB6LUBMSQ4JCA3W6QRV7KMBSTE';

	beforeEach(async () => {
		app = await createApp();
		account = await getKinAccount(client, config);
	}, 120000);

	test('Get status - successful', async () => {
		const publicAddress = KeyPair.addressFromSeed(config.SEED);
		const balance = await account.getBalance();

		const response = await request(app).get('/status');
		const text = JSON.parse(response.text);
		const data = text;

		expect(data.service_version).toBe(VERSION);
		expect(data.horizon).toBe(INTEGRATION_ENVIRONMENT.url);
		expect(data.public_address).toBe(publicAddress);
		expect(data.balance).toBe(balance);
		expect(data.channels.total_channels).toBe(config.CHANNEL_COUNT);
		expect(response.statusCode).toBe(200);
	}, 120000);

	test('Get Balance - successful', async () => {
		const balance = await account.getBalance();
		const response = await request(app).get(`/balance/${account.publicAddress}`);
		expect(response.body.balance).toBe(balance);
	}, 120000);

	test('Get Balance - account not found', async () => {
		const keypair = KeyPair.generate();
		const response = await request(app).get(`/balance/${keypair.publicAddress}`);
		expect(response.text).toEqual(JSON.stringify(AccountNotFoundError(keypair.publicAddress)));
	}, 120000);

	test('Get Payment - successful', async () => {
		const amount = 150;
		const memo = 'pay-successful';
		const payResponse = await request(app).post('/pay').send({
			destination: destination,
			amount: amount,
			memo: 'pay-successful'
		});
		const payData = JSON.parse(payResponse.text);
		const response = await request(app).get(`/payment/${payData.tx_id}`);
		const data = JSON.parse(response.text);
		expect(data.source).toEqual('GAJCKSF6YXOS52FIIP5MWQY2NGZLCG6RDEKYACETVRA7XV72QRHUKYBJ');
		expect(data.destination).toEqual(destination);
		expect(data.amount).toEqual(amount);
		expect(data.memo).toEqual(`${MEMO_TEMPLATE}${memo}`);
		expect(data.timestamp).toBeDefined();
	}, 120000);

	test('Get Payment - wrong transaction', async () => {
		const response = await request(app).get('/payment/5d68a90441be50285d24fcfcea7a93bd6a2fee97d3cf7a9d46c62a7c2b1ad350');
		expect(response.text).toEqual(JSON.stringify(TransactionNotFoundError('5d68a90441be50285d24fcfcea7a93bd6a2fee97d3cf7a9d46c62a7c2b1ad350')));
	}, 120000);

	test('Post Pay - successful', async () => {
		const amount = 150;
		const memo = 'pay-successful';
		const payResponse = await request(app).post('/pay').send({
			destination: destination,
			amount: amount,
			memo: 'pay-successful'
		});
		const payData = JSON.parse(payResponse.text);
		const paymentRequest = await request(app).get(`/payment/${payData.tx_id}`);
		const paymentData = JSON.parse(paymentRequest.text);

		expect(paymentData.source).toEqual(configKeypair.publicAddress);
		expect(paymentData.destination).toEqual(destination);
		expect(paymentData.amount).toEqual(amount);
		expect(paymentData.memo).toEqual(MEMO_TEMPLATE + memo);
	}, 120000);

	test('Post Pay - negative minimum amount', async () => {
		const response = await request(app).post('/pay').send({
			destination: destination,
			amount: -150,
			memo: 'pay-failed'
		});
		const data = JSON.parse(response.text);

		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4001);
		expect(data.title).toEqual('Bad Request');
		expect(data.http_code).toEqual(400);
		expect(data.status).toEqual(400);
		expect(data.message).toEqual('Amount for payment must be bigger than 0');
	}, 120000);

	test('Post Pay - wrong address', async () => {
		const response = await request(app).post('/pay').send({
			destination: destination + 'A',
			amount: 150,
			memo: 'pay-failed'
		});
		const data = JSON.parse(response.text);

		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4001);
		expect(data.title).toEqual('Bad Request');
		expect(data.http_code).toEqual(400);
		expect(data.status).toEqual(400);
		expect(data.message).toEqual(`Destination '${destination + 'A'}' is not a valid public address`);
	}, 120000);

	test('Post Pay - too long memo', async () => {
		const memo = 'pay-failed-due-to-a-very-long-message';
		const response = await request(app).post('/pay').send({
			destination: destination,
			amount: 150,
			memo: memo
		});
		const data = JSON.parse(response.text);

		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4001);
		expect(data.title).toEqual('Bad Request');
		expect(data.http_code).toEqual(400);
		expect(data.status).toEqual(400);
		expect(data.message).toEqual(`Memo: '${memo}' is longer than ${MEMO_CAP}`);
	}, 120000);

	test('Post Pay - balance too low', async () => {
		const balance = await account.getBalance();

		const response = await request(app).post('/pay').send({
			destination: destination,
			amount: balance * 2,
			memo: 'pay-successful'
		});

		const data = JSON.parse(response.text);
		expect(data).toEqual(data);
		expect(data.message).toEqual('The account does not have enough kin to perform this operation');
	}, 120000);

	test('Post Pay - missing param', async () => {
		const response = await request(app).post('/pay').send({
			destination: destination,
			memo: 'pay-successful'
		});

		const data = JSON.parse(response.text);
		expect(data).toEqual(data);
		expect(data.message).toEqual('The parameter \'amount\' was missing from the requests body');
	}, 120000);

	test('Post Create - successful', async () => {
		const startingBalance = 300;
		const keypair = KeyPair.generate();
		await request(app).post('/create').send({
			destination: keypair.publicAddress,
			starting_balance: startingBalance,
			memo: 'create-successful'
		});

		const response = await request(app).get(`/balance/${keypair.publicAddress}`);
		const data = JSON.parse(response.text);

		expect(data.balance).toEqual(startingBalance);
	}, 120000);

	test('Post Create - wrong address', async () => {
		const startingBalance = 300;
		const keypair = KeyPair.generate();
		const response = await request(app).post('/create').send({
			destination: keypair.publicAddress + 'A',
			starting_balance: startingBalance,
			memo: 'create-successful'
		});
		const data = JSON.parse(response.text);

		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4001);
		expect(data.title).toEqual('Bad Request');
		expect(data.http_code).toEqual(400);
		expect(data.status).toEqual(400);
		expect(data.message).toEqual(`Destination '${keypair.publicAddress + 'A'}' is not a valid public address`);
	}, 120000)

	test('Post Create - negative starting balance', async () => {
		const keypair = KeyPair.generate();
		const response = await request(app).post('/create').send({
			destination: keypair.publicAddress,
			starting_balance: -300,
			memo: 'create-successful'
		});
		const data = JSON.parse(response.text);

		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4001);
		expect(data.title).toEqual('Bad Request');
		expect(data.http_code).toEqual(400);
		expect(data.status).toEqual(400);
		expect(data.message).toEqual('Starting balance for account creation must not be negative');
	}, 120000);

	test('Post Create - too long memo', async () => {
		const memo = 'create-failed-due-to-a-very-long-message';
		const keypair = KeyPair.generate();
		const response = await request(app).post('/create').send({
			destination: keypair.publicAddress,
			starting_balance: 300,
			memo: memo
		});
		const data = JSON.parse(response.text);

		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4001);
		expect(data.title).toEqual('Bad Request');
		expect(data.http_code).toEqual(400);
		expect(data.status).toEqual(400);
		expect(data.message).toEqual(`Memo: '${memo}' is longer than ${MEMO_CAP}`);
	}, 120000);

	test('Post Whitelist - successful', async () => {
		const envelope = `AAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAA
			AAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAAAIkSdAIAAAAQDlwLj
			Xrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAAQICXI9dNj/rnP1JVjD
			YMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QA=`;
		const response = await request(app).post('/whitelist').send({
			envelope: envelope,
			network_id: INTEGRATION_ENVIRONMENT.passphrase
		});
		const data = JSON.parse(response.text);
		expect(data.tx_envelope).toEqual('AAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAA' +
			'AAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAA' +
			'AMkSdAIAAAAQDlwLjXrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAA' +
			'QICXI9dNj/rnP1JVjDYMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QD6hE9FAAAAQElek5+mPpU' +
			'ZWb4OPG/Hn00eOiRxEHjGY9N8hJvGnpsnOkHUt1a2As64E2ORnqgFtwTzz7aRii6NTxI1FFG1HAw=');
	}, 120000);

	test('Post Whitelist - envelope is not valid', async () => {
		const envelope = `BAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAA
			AAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAAAIkSdAIAAAAQDlwLj
			Xrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAAQICXI9dNj/rnP1JVjD
			YMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QA=`;
		const response = await request(app).post('/whitelist').send({
			envelope: envelope,
			network_id: INTEGRATION_ENVIRONMENT.passphrase
		});
		const data = JSON.parse(response.text);
		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4004);
		expect(data.title).toEqual('Bad Request');
		expect(data.status).toEqual(400);
		expect(data.message).toEqual('The service was unable to decode the received transaction envelope. ERROR: XDR Read Error: Unknown PublicKeyType member for value 67108864');
	}, 120000);

	test('Post Whitelist - network_id does not exist', async () => {
		const envelope = `BAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAZAAfJbkAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAA
			AAAAAAAQAAAAAAAAABAAAAAJalymXISxn6Cx+rKsuItEyoR+IoeCiUaSGy5yckSdAIAAAAAAAAAAAABhqAAAAAAAAAAAIkSdAIAAAAQDlwLj
			Xrjpa/FmtpxrnrRrYbRBtVkpqgaHgy9R0gG/PpLtcuces9LLB3B8WmhqS47AlFMPg80WSD2Rv+QbJNHwi23RThAAAAQICXI9dNj/rnP1JVjD
			YMSopUaxM/nUIYx36BmaeYuNIhTEfol6dF5G7ufWRE1OX3mWbcAt/cxCoUz6vBUCbl9QA=`;
		const response = await request(app).post('/whitelist').send({
			envelope: envelope
		});
		const data = JSON.parse(response.text);
		expect(data.http_code).toEqual(400);
		expect(data.code).toEqual(4006);
		expect(data.title).toEqual('Bad Request');
		expect(data.status).toEqual(400);
		expect(data.message).toEqual('The parameter \'network_id\' was missing from the requests body');
	}, 120000);
});
