import * as core from "express-serve-static-core";
import {CommunityController} from "../controllers/communities";
import {GlobalServices} from "../services/services";
import { Router } from 'express';
import { ActivityController } from '../controllers/activity';

const express = require('express');

export function activityRouter(globalServices : GlobalServices): Router {

	const router = express.Router();
	const activityController = new ActivityController(globalServices.likesService)
	router
		.get('/', activityController.list())
		.post('/', activityController.create())
	return router;
}
