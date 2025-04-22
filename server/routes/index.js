const Router = require('express')
const router = new Router()
const furnitureRouter = require('./furnitureRouter')
const userRouter = require('./userRouter')
const manufacturerRouter = require('./manufacturerRouter')
const typeRouter = require('./typeRouter')
const subTypeRouter = require('./subtypeRouter');
const basketRouter = require('./basketRouter');
const favoritesRouter = require('./favoritesRouter');
const ratingRouter = require('./ratingRouter');


router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/subtype', subTypeRouter);
router.use('/manufacturer', manufacturerRouter)
router.use('/furniture', furnitureRouter)
router.use('/basket', basketRouter);
router.use('/favorites', favoritesRouter);
router.use('/rating', ratingRouter);


module.exports = router