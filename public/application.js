// Write our base functions
function showProduct(productId) {

  var product = Robots[productId];

  $(".overlay").fadeIn();
  $("#detail-title").text(product.title);
  $("#detail-image").attr("src",product.image);
  $("#detail-description").text(product.description);
  $("#detail-price").text("$" + product.price);

  $(".details").show();

  $("#add-to-cart").click(function() {
    var quantity = $("#detail-quantity").val();
    addToCart(productId,quantity);
    hideProduct();
  });
}

function hideProduct() {
  $(".overlay").fadeOut();
  $(".details").hide();

  $("#add-to-cart").off("click");
}

var Cart = {};

function addToCart(productId, quantity) {
  if(!Cart[productId]) { Cart[productId] = 0; }
  Cart[productId] += parseInt(quantity);
  totalCart();
}

function totalCart() {
  var items = 0;
  var total = 0;

  for(var productId in Cart) {
    var product = Robots[productId]

    var unitPrice = product.price;
    var quantity = Cart[productId];

    items += quantity;
    total += unitPrice * quantity;
  }

  if(items > 0) {
    $("#cart").text(items + " items: $" + total.toFixed(2));
  } else {
    $("#cart").text("Cart Empty");
  }

  return total;
}

function showItem(name, quantity, price) {
  var item = $("<div class='item'>");

  item.append( $("<div class='name'>").text(name) );
  item.append( $("<div class='price'>").text(quantity + " X $" + price + "=") );
  item.append( $("<div class='subtotal''>").text("$" + (quantity * price).toFixed(2)) );    

  $("#cart-content").append(item);
}


function showCart() {
  $("#cart-content").empty();

  for(var productId in Cart) {
    var product = Robots[productId]

    var unitPrice = product.price;
    var quantity = Cart[productId];

    showItem(product.title, quantity, unitPrice);
  }

  $("#cart-content").append("Total: $" + totalCart().toFixed(2));

  $("#cart-details").show();
}

function hideCart() {
  $("#cart-details").hide();
}

function checkOut() {
  hideCart();

  var description = $("#cart").text();
  var amount = totalCart() * 100;

  var handler = StripeCheckout.configure({
    key: 'pk_test_V0SJ6QOh3rXO9s6Ysw0eHzzE',
    image: 'images/bird_bot.png',
    token: function(token, args) {
      $.post("/buy", {
        token: token.id,
        amount: amount,
        description: description
      },function(data) {
        alert(data.message);
      });
    }
  });


  handler.open({
    name: 'Evil Genius Robot Supply',
    description: description,
    amount: amount
  });

}


// When the page loads, add in our event handlers
$(function() {

  $(".overlay").click(function() { hideProduct(); hideCart(); });

  $(".product").click(function() {
    var productId = $(this).data("product-id");
    showProduct(productId);
  });

  $("#cart").click(function() {
    showCart();
  });

  $("#checkout").click(function() {
    checkOut();
  });
});
