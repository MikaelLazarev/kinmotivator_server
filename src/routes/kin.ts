import {GlobalServices} from "../services/services";
import { Router } from 'express';
import { KinController } from '../controllers/kin';

const express = require('express');

export function kinRouter(globalServices : GlobalServices): Router {

	const router = express.Router();
	const kinController = new KinController(globalServices.kinService)
	router
		.post('/pay', kinController.pay())
	return router;
}
