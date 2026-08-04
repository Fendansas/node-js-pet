import { BaseController } from "./base.controller.js";
import PersonService from "../services/person.service.js";
import GalleryService from "../services/gallery.service.js";

class PersonController extends BaseController {
    async index(req, res) {
        console.log('[PERSON] Listing persons');

        try {
            const persons = await PersonService.getAll();
            return this.renderView(res, 'admin/persons/index', { persons });
        } catch (error) {
            console.error('[PERSON] Index error:', error);
            return this.handleError(res, error, 'Persons list error');
        }
    }

    async show(req, res) {
        console.log('[PERSON] Showing person:', req.params.id);

        try {
            const person = await PersonService.getById(req.params.id);
            if (!person) {
                return this.handleError(res, { code: 'PERSON_NOT_FOUND', message: 'Эталон не найден' }, 'Person not found');
            }
            return this.renderView(res, 'admin/persons/show', { person });
        } catch (error) {
            console.error('[PERSON] Show error:', error);
            return this.handleError(res, error, 'Show person error');
        }
    }

    async createPage(req, res) {
        return this.renderView(res, 'admin/persons/form', { person: null });
    }

    async create(req, res) {
        console.log('[PERSON] Creating person');

        try {
            if (!req.file) {
                req.session.validationErrors = [{ msg: 'Загрузите фото эталона' }];
                return res.redirect('/admin/persons/create');
            }

            const imageUrl = '/uploads/persons/' + req.file.filename;
            const person = await PersonService.create({
                name: req.body.name || '',
                imageUrl,
                createdBy: req.user._id
            });

            GalleryService.reMatchFaces().catch(error => {
                console.error('[PERSON] re-match error:', error.message);
            });

            return this.successRedirect(req, res, '/admin/persons', 'Эталон добавлен: ' + person.name);
        } catch (error) {
            console.error('[PERSON] Create error:', error);

            if (error.code === 'NO_FACE_FOUND') {
                req.session.validationErrors = [{ msg: 'Лицо не найдено на фото — загрузите фото с чётким лицом' }];
                return res.redirect('/admin/persons/create');
            }

            if (error.code === 'FACE_SERVICE_ERROR') {
                req.session.validationErrors = [{ msg: 'Сервис распознавания недоступен. Запустите: npm run face' }];
                return res.redirect('/admin/persons/create');
            }

            return this.handleError(res, error, 'Create person error');
        }
    }

    async addPhoto(req, res) {
        console.log('[PERSON] Adding photo:', req.params.id);

        try {
            if (!req.file) {
                req.session.validationErrors = [{ msg: 'Загрузите фото эталона' }];
                return res.redirect('/admin/persons/' + req.params.id);
            }

            const imageUrl = '/uploads/persons/' + req.file.filename;
            await PersonService.addPhoto(req.params.id, imageUrl);

            GalleryService.reMatchFaces().catch(error => {
                console.error('[PERSON] re-match error:', error.message);
            });

            return this.successRedirect(req, res, '/admin/persons/' + req.params.id, 'Фото добавлено');
        } catch (error) {
            console.error('[PERSON] Add photo error:', error);

            if (error.code === 'NO_FACE_FOUND') {
                req.session.validationErrors = [{ msg: 'Лицо не найдено на фото — загрузите фото с чётким лицом' }];
                return res.redirect('/admin/persons/' + req.params.id);
            }

            if (error.code === 'FACE_SERVICE_ERROR') {
                req.session.validationErrors = [{ msg: 'Сервис распознавания недоступен. Запустите: npm run face' }];
                return res.redirect('/admin/persons/' + req.params.id);
            }

            return this.handleError(res, error, 'Add person photo error');
        }
    }

    async deletePhoto(req, res) {
        console.log('[PERSON] Deleting photo:', req.params.photoIndex);

        try {
            const photoIndex = parseInt(req.params.photoIndex, 10);
            await PersonService.deletePhoto(req.params.id, photoIndex);
            return this.successRedirect(req, res, '/admin/persons/' + req.params.id, 'Фото удалено');
        } catch (error) {
            console.error('[PERSON] Delete photo error:', error);
            return this.handleError(res, error, 'Delete person photo error');
        }
    }

    async delete(req, res) {
        console.log('[PERSON] Deleting person:', req.params.id);

        try {
            await PersonService.delete(req.params.id);
            return this.successRedirect(req, res, '/admin/persons', 'Эталон удалён');
        } catch (error) {
            console.error('[PERSON] Delete error:', error);
            return this.handleError(res, error, 'Delete person error');
        }
    }

    async rescan(req, res) {
        console.log('[PERSON] Starting faces rescan');

        try {
            GalleryService.rescanFaces().catch(error => {
                console.error('[PERSON] Rescan error:', error.message);
            });
            return this.successRedirect(req, res, '/admin/persons', 'Ресканирование фото запущено в фоне');
        } catch (error) {
            console.error('[PERSON] Rescan error:', error);
            return this.handleError(res, error, 'Rescan error');
        }
    }
}

export default new PersonController();