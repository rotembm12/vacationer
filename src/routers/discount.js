const express = require('express');
const Discount = require('../models/discount');
const router = new express.Router();

router.get('/api/discount', async (req, res) => {
    //TODO: return all discounts based on query params
    const params = req.params || {};

    try {
        const discounts = await Discount.find();
        res.send(discounts);
    } catch (err){
        res.send(err);
    }
});

router.post('/api/discount', async (req, res) => {
    //insert new discount 
    const discount = req.body;
    console.log(discount);
    try {
        const newDiscount = new Discount(req.body);
        await newDiscount.save();
        res.send(newDiscount);
    } catch(err) {
        res.send(err);
    }
});

router.put('/api/discount/:id', async (req, res) => {
    //edit existing discount
    console.log(req.params.id);
    try {
        const existingDiscount = await Discount.findByIdAndUpdate(req.params.id,{
            ...req.body
        }, {new: true});
        await existingDiscount.save();
        console.log(req.body);
        console.log(existingDiscount);
        res.send(existingDiscount);
    } catch(err){
        console.log(err);
        res.send(err);
    }
})
router.delete('/api/discount/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const deletedDiscount = await Discount.findOneAndDelete({ 
            _id: req.params.id
        });
        console.log(deletedDiscount);
        res.send(deletedDiscount);
    } catch(err) {
        res.send(err);
    }
    
})
module.exports = router;