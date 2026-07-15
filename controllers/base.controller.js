export class BaseController {
    handleError(res, error, castomMessage = 'Server error') {
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== END ERROR ===');

        // Определяем код ошибки
        const errorCode = error.code || 'UNKNOWN';
        let statusCode = 500;

        // Маппинг кодов ошибок на статусы HTTP
        switch (errorCode) {
            case 'USER_NOT_FOUND':
            case 'PRODUCT_NOT_FOUND':
            case 'ANOMALY_NOT_FOUND':
            case 'EVENT_NOT_FOUND':
            case 'POST_NOT_FOUND':
            case 'TASK_NOT_FOUND':
                statusCode = 404;
                break;
            case 'EMAIL_ALREADY_EXISTS':
            case 'USER_ALREADY_ASSIGNED':
            case 'INSUFFICIENT_FUNDS':
            case 'EVENT_ID_REQUIRED':
            case 'ASSIGNMENT_NOT_FOUND':
                statusCode = 400;
                break;
            case 'USER_BANNED':
                statusCode = 403;
                break;
            case 'COMMENT_NOT_FOUND':
                statusCode = 404;
                break;
            default:
                statusCode = 500;
        }

        const message = error.message || castomMessage;
        return res.status(statusCode).send(message);
    }

    sendValidationError(res, errors, renderView = null, viewData = {}) {
        console.error('=== VALIDATION ERROR ===');
        console.error('Errors:', JSON.stringify(errors.array(), null, 2));
        console.error('=== END VALIDATION ERROR ===');

        if (renderView) {
            return res.status(400).render(renderView, {
                ...viewData,
                errors: errors.array(),
            });
        }

        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    getCurrentUser(req, res) {
        return req.user || res.locals.user;
    }

    successRedirect(req, res, url, message) {
        console.log(`[SUCCESS] Redirecting to ${url} with message: ${message}`);
        
        // Если поддерживается flash-сообщения
        if (req.session) {
            req.session.successMessage = message;
        }
        
        return res.status(200).redirect(url);
    }

    renderView(res, view, data = {}) {
        console.log(`[RENDER] View: ${view}`);
        return res.render(view, data);
    }
}