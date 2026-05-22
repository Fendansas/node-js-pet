export class BaseController {
    handleError(res, error, castomMessage = 'Server error'){
        console.log('=== ERROR ===');
        console.log('Error message:', error.message);
        console.log('Error stack', error.stack);
        console.log('=== END ERROR ===');

        const message = error.message || castomMessage;
        res.status(500).send(message);
    }

    sendValidationError(res, errors, renderView = null, viewData = {}) {
        console.log('=== VALIDATION ERROR ===');
        console.log('Errors:', JSON.stringify(errors.array(), null, 2));
        console.log('=== END VALIDATION ERROR ===');

        if (renderView){
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
        return res.locals.user;
    }

    successRedirect(res, url, message) {
        console.log(`[SUCCESS] Redirecting to ${url} with message: ${message}`)
        res.status(200).redirect(url);
    }

    renderView(res, view, data = {}) {
        console.log(`[RENDER] View: ${view}`);
        res.render(view, data);
    }
}