import { inject } from '@adonisjs/core';
import {HttpContext} from "@adonisjs/core/http";
import {PageObject} from "@adonisjs/inertia/types";

@inject()
export default class HomeController {
    public async renderHome({ inertia }: HttpContext): Promise<string | PageObject<{}> > {
        return inertia.render('home', { test: 'coutou' });
    }
}
