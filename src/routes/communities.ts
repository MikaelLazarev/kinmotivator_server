import * as core from "express-serve-static-core";
import {CommunityController} from "../controllers/communities";
import {GlobalServices} from "../services/services";
import { Router } from 'express';

const express = require('express');

export function communitiesRouter(globalServices : GlobalServices): Router {

	const router = express.Router();
	const communityController = new CommunityController(globalServices.communityService)
	router
		.get('/', communityController.list())
		.get('/:id/join', communityController.join())
		.get('/:id/leave', communityController.leave())
		.get('/:id', communityController.retrieve())
		.post('/', communityController.create())
	return router;
}
