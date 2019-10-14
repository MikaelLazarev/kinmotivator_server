import {getStatus} from "../../controllers/_old/status";
import {KinAccount, KinClient} from "@kinecosystem/kin-sdk-node";
import * as core from "express-serve-static-core";
import {GetBalance, getBalance} from "../../controllers/_old/balance";
import {GetPayment, getPayment} from "../../controllers/_old/payment";
import {Pay, pay} from "../../controllers/_old/pay";
import {Create, create} from "../../controllers/_old/create";
import {Whitelist, whitelist} from "../../controllers/_old/whitelist";
import {PaymentRequest, paymentValidator} from "../../middlewares/_old/payment";
import {balanceRequest, balanceValidator} from "../../middlewares/_old/balance";
import {createRequest, createValidator} from "../../middlewares/_old/create";
import {payRequest, payValidator} from "../../middlewares/_old/pay";
import {WhitelistRequest, whitelistValidator} from "../../middlewares/_old/whitelist";
import {logger} from "../../app";
import { apiRouter } from "../api";
import * as express from 'express';
import { Router } from 'express';

// const express = require('express');
/**
 * Handles controller execution and responds to user (API Express version).
 * @param promise Controller Promise.
 * @param params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [req.params.username, ...].
 */
export const routerHandler = (promise: any, params: any) => async (req: any, res: any, next: any) => {
	const boundParams = params ? params(req, res, next) : [];
	try {
		logger.info(`Got request ${req.method} ${req.path}, body: ${JSON.stringify(req.body)}`);
		const result = await promise(...boundParams);
		return res.json(result || { message: 'OK' });
	} catch (error) {
		next(error);
	}
};

export function kinRouter(client: KinClient, account: KinAccount): Router {
	const router = express.Router();
	router
		.get('/status', routerHandler(getStatus,(req: any, res: any, next: any) => [client, account]))
		.get('/payment/:hash', PaymentRequest, paymentValidator, routerHandler(getPayment, (req: GetPayment, res: any, next: any) => [client, req.params.hash]))
		.get('/balance/:address', balanceRequest, balanceValidator, routerHandler(getBalance, (req: GetBalance, res: any, next: any) => [client, req.params.address]))
		.post('/create', createRequest, createValidator, routerHandler(create, (req: Create, res: any, next: any) => [client, account, (req as any).body]))
		.post('/pay', payRequest, payValidator, routerHandler(pay, (req: Pay, res: any, next: any) => [client, account, (req as any).body]))
		.post('/whitelist',
			// (req: any, res: any) => console.log(req.body),
			// WhitelistRequest, whitelistValidator,
			routerHandler(whitelist, (req: Whitelist, res: any, next: any) => [account, (req as any).body]))
	return router;
}
