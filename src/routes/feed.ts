import {FeedController} from "../controllers/feed";
import {GlobalServices} from "../services/services";
import { Router } from 'express';

const express = require('express');

export function feedRouter(globalServices : GlobalServices): Router {

	const router = express.Router();
	const feedController = new FeedController(globalServices.feedService)
	router
		.get('/', feedController.list())
		.get('/:id', feedController.retrieve())
		.post('/', feedController.create())
	return router;
}
