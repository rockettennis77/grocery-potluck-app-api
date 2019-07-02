/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/', require('./home.js')(router));
    app.use('/api', require('./userRoute.js')(router));
    app.use('/api', require('./ingredientRoute.js')(router));
    app.use('/api', require('./recipeRoute.js')(router));
    app.use('/api', require('./userFriendRoute.js')(router));
    app.use('/api', require('./pantryListRoute.js')(router));
    app.use('/api', require('./groceryListRoute.js')(router));




};
