function myfunction(event) {
  event.preventDefault();
  let productName = document.getElementById('productname').value;
  let productQuantity = document.getElementById('productquantity').value;
  let Price = document.getElementById('price').value;
  let productError = document.getElementById('producterror');
  let qtyError = document.getElementById('qtyerror');
  let priceError = document.getElementById('priceerror');
  if(productName === ""){
    productError.innerHTML="Product name is required";
  }
  if(productQuantity === ""){
    qtyError.innerHTML="Product quantiity is required";
  }
  if(Price === ""){
    priceError.innerHTML = "price is required";
    return;
  }
  let obj = {
    productName:productName,
    productQuantity:productQuantity,
    price:Price
  }
  fetch(
    `http://localhost:8080/api/product/add/product`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }
  )
    .then(response => {
      if(!response.ok) {
        return response.json()
        .then(data => {
          throw new Error(
            `API Error: ${data.error.code} - ${data.error.reason}`
          );
        });
      } 
    })
    .then((data) => console.log(data))
    .catch((Error) => console.error("Error", Error));
    document.getElementById('myform').reset();
  }