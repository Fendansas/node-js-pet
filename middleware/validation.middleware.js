import {validationResult} from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If the request accepts HTML (browser form submission), render the previous view with errors
        if (req.accepts('html')) {
            // Try to determine which view to re-render based on the route
            // Fall back to sending error messages as text for form submissions
            const errorMessages = errors.array().map(e => e.msg).join(', ');
            
            // Try to go back to the previous page with error info
            // We store errors in session flash and redirect back
            if (req.session) {
                req.session.validationErrors = errors.array();
                req.session.validationData = req.body;
            }
            
            return res.redirect('back');
        }
        
        return res.status(422).json({errors: errors.array()});
    }
    next();
}
