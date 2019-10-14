import * as core from "express-serve-static-core";
import {ProfileController} from "../controllers/profile";
import {GlobalServices} from "../services/services";
import * as express from 'express';


export function profileRouter(globalServices : GlobalServices): express.Router {

	const router = express.Router();
	const profileController = new ProfileController(globalServices.userService)
	router
		.get('/', profileController.getProfile())
		.post('/', profileController.updateProfile())

	return router;
}
