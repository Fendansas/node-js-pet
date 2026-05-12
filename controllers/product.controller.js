import productService from "../services/product.service.js";
import {validationResult} from "express-validator";
import User from "../models/user.js";


class ProductController {


    async index(req, res){

        try {

            const user =
                await User.findById(
                    res.locals.user._id
                ).populate('role');

            const category =
                req.query.category;

            const products =
                await productService.getAll(
                    category
                );

            const categories =
                await productService.getCategories();

            res.render(
                'products/index',
                {
                    products,
                    user,
                    categories,
                    selectedCategory:
                        category || ""
                }
            );

        } catch (error) {

            console.log(error);

            res.status(500)
                .send('Server Error');
        }
    }

    createPage(req, res){
        return res.render('products/create');
    }

    async create(req, res){

        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).render('products/create', {errors: errors.array()});
            }
            const {
                title,
                description,
                price,
                category
            } = req.body;

            await productService.create({
                title,
                description,
                price,
                category,
                image: '/uploads/'+ req.file.filename,
            });

            return res.redirect('/products');

        }  catch (error){

            console.log(error);

            return res.status(500).send('Server Error');
        }
    }

    async show(req, res){
        try {
            const product = await productService.getById(req.params.id);
            if (!product){
                return res.status(404).send('Product not found');
            }

            return res.render('products/show', {product});
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    async delete (req, res){
        try {
            await productService.delete(req.params.id);
            return res.redirect('/products');
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    async editPage(req, res) {

        try {

            const product =
                await productService.getById(
                    req.params.id
                );

            if (!product) {
                return res
                    .status(404)
                    .send("Product not found");
            }

            return res.render(
                "products/edit",
                {
                    product,
                    errors: [],
                }
            );

        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .send("Server Error");
        }
    }

    async update(req, res) {

        try {

            const errors =
                validationResult(req);

            const product =
                await productService.getById(
                    req.params.id
                );

            if (!product) {

                return res
                    .status(404)
                    .send("Product not found");
            }

            if (!errors.isEmpty()) {

                return res.status(400).render(
                    "products/edit",
                    {
                        product,
                        errors: errors.array(),
                    }
                );
            }

            const {
                title,
                description,
                price,
                category,
            } = req.body;

            const updateData = {

                title,
                description,
                price,
                category,
            };

            if (req.file) {

                updateData.image =
                    "/uploads/" +
                    req.file.filename;
            }

            await productService.update(
                req.params.id,
                updateData
            );

            return res.redirect(
                "/products"
            );

        } catch (error) {

            console.log(error);

            return res
                .status(500)
                .send("Server Error");
        }
    }


}

export default new ProductController();