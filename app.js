  let dotenv = require('dotenv');
  const createError = require('http-errors');
  const express = require('express');
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');
  const cors = require('cors');

  const session = require('express-session');
  const userRegisterRouter = require('./routes/user/register');
  const userLoginRouter = require('./routes/user/login');
  const userLogoutRouter = require('./routes/user/logout');
  const deleteUserRouter = require('./routes/user/deleteUser');
  const comicsRouter = require('./routes/comics');
  const getFavoritesRouter = require('./routes/comics/getFavorites');
  const addFavoriteRouter = require('./routes/comics/addFavorite');
  const deleteFavoriteRouter = require('./routes/comics/deleteFavorite');
  const charactersRouter = require('./routes/characters');
  const isFavoriteRouter = require('./routes/comics/isFavorite');

 


  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors()) 
  // Rutas
  app.use('/api/user/',userRegisterRouter); 
  app.use('/api/user/',userLoginRouter); 
  app.use('/api/user/',userLogoutRouter);
  app.use('/api/user/',deleteUserRouter);
  app.use('/api/comics/',comicsRouter);
  app.use('/api/comics/',getFavoritesRouter); 
  app.use('/api/comics/',addFavoriteRouter); 
  app.use('/api/comics/',deleteFavoriteRouter);
  app.use('/api/characters/',charactersRouter);
  app.use('/api/comics/',isFavoriteRouter);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  console.log("Server running");
  dotenv.config({ path: './.env' });
  module.exports = app;