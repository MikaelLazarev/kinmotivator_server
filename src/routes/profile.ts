import * as core from "express-serve-static-core";
import {CommunityController} from "../controllers/communities";
import {GlobalServices} from "../services/services";

const express = require('express');

export function userRouter(globalServices : GlobalServices): Promise<core.Router> {

	const router = express.Router();
	const communityController = new CommunityController(globalServices.communityService)
	router
		.get('/', communityController.list())
		.get('/:id', communityController.retrieve())
		.post('/', communityController.create())
	return router;
}
