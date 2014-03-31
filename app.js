
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , stripe = require('stripe')('sk_test_BWyv4n2NQe2DDyj6PEIG7QI9');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/buy',function(request, res){
  var stripeToken = request.body.token;

  var charge = stripe.charges.create({
      amount: parseInt(request.body.amount),
      currency: "usd",
      card: stripeToken,
      description: request.body.description
  }).then(function() {
    console.log("Processed");
    res.json(200, { message: 'Your order has been processed' })
  }, function(err) { 
    if (err && err.type === 'StripeCardError') {
      res.json(200, { message: 'Card has been declined' })
    } else if(err) {
      res.json(200, { message: err  });
    }
  });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
