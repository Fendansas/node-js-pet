import { BaseController } from './base.controller.js';
import {validationResult} from "express-validator";
import EventService from "../services/event.service.js";
import postService from "../services/post.service.js";
import AnomaliesService from "../services/anomaly.service.js";



class EventController extends BaseController {

    async index(req, res) {
        try {
            console.log('[EVENTS] Listing events');

            const events = await EventService.getAllEvents();
            console.log(events)

            return this.renderView(res, 'events/index', {events});

        } catch (err) {
            return this.handleError(res, err, 'Event error');

        }
    }

    async createPage(req, res) {
        console.log('[EVENT] Showing create page');
        return this.renderView(res, 'events/create');
    }

    async create(req, res) {
        console.log('[EVENT] Creating new event');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'products/create');
        }

        try {

            const { title, description, startTime, endTime, status } = req.body;

            console.log('[EVENT] event data:', { title, description, startTime, endTime, status });

            await EventService.createEvent({
                title,
                description,
                startTime,
                endTime,
                status
            });

            console.log('[EVENT] Event created successfully');
            return this.successRedirect(res, '/events', 'Event created');

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    async show(req, res) {
        console.log('[EVENT] Showing event');
        try{
            const event = await EventService.getEventById(req.params.id);
            console.log('[EVENT] Event found:', event);
            if (!event) {
                console.log('[EVENT] Event not found:', req.params.id);
                return res.status(404).send('Event not found');
            }

            return this.renderView(res, 'events/show', {event});


        } catch (error){

            return this.handleError(res, error, 'Server Error');
        }

    }
    async edit(req, res) {
        console.log('[EVENT] Edit event');
        try{
            const event = await EventService.getEventById(req.params.id);
            console.log('[EVENT] Event found:', event);
            if (!event) {
                console.log('[EVENT] Event not found:', req.params.id);
                return res.status(404).send('Event not found');
            }

            return this.renderView(res, 'events/edit', {event});


        } catch (error){

            return this.handleError(res, error, 'Server Error');
        }

    }

    async update (req,res){

        console.log('[EVENT] Update new event');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.sendValidationError(res, errors, 'products/edit');
        }

        try {

            const { title, description, startTime, endTime, status } = req.body;

            console.log('[EVENT] event data:', { title, description, startTime, endTime, status });

            await EventService.updateEvent(req.params.id,{
                title,
                description,
                startTime,
                endTime,
                status
            });

            console.log('[EVENT] Event created successfully');
            return this.successRedirect(res, '/events', 'Event created');

        } catch (error) {
            return this.handleError(res, error, 'Server Error');
        }
    }

    async delete (req, res){
        console.log('[EVENTS] Deleting event:', req.params.id);
        try {
            await EventService.delete(req.params.id);
            console.log('[EVENTS] Event deleted successfully');
            return this.successRedirect(res, '/events', 'Event deleted');

        } catch (error){
            return this.handleError(res, error, 'Delete event error');
        }
    }


}

export default new EventController();
