document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("myform").addEventListener("submit", myfunction);
  document.getElementById("addtocart").addEventListener("click", addtocart);
  document.getElementById("clearcart").addEventListener("click", clearcart);
});
let valid = true;
let products = [];
function fetchProducts() {
  return fetch("http://localhost:8080/api/product/get/All/product")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((result) => {
      products = result.data; 
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      products = []; 
    });
}
function myfunction(event) {
  event.preventDefault();
  let customerName = document.getElementById("name").value;
  let email = document.getElementById("Email").value;
  let address = document.getElementById("Address").value;
  let date = document.getElementById("Date").value;
  let mobileNo = document.getElementById("phonenumber").value;
  let gender = document.getElementById("Gender").value;
  let nameerr = document.getElementById("nameerror");
  let emailerr = document.getElementById("emailerror");
  let addresserr = document.getElementById("addresserror");
  let dateerr = document.getElementById("dateerror");
  let phonenumbererr = document.getElementById("phonenumbererror");
  let gendererr = document.getElementById("gendererror");
  let namePattern = /^([a-zA-Z]+) ([a-zA-Z]{3})$/;
  let emailPattern =
    /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-zA-Z]+).([a-zA-Z]{2,20})$/;
  let phonenumberPattern = /^([0-9]{10})$/;
  if (customerName === "") {
    nameerr.innerHTML = "Name is required";
    valid = false;
  } else if (!namePattern.test(customerName)) {
    nameerr.innerHTML = "";
    valid = false;
  }
  if (email === "") {
    emailerr.innerHTML = "Email is required";
    valid = false;
  } else if (!emailPattern.test(email)) {
    emailerr.innerHTML = "Invalid email format";
    valid = false;
  } else {
    emailerr.innerHTML = "";
  }
  if (address === "") {
    addresserr.innerHTML = "Address required";
    valid = false;
  } else {
    addresserr.innerHTML = "";
  }
  if (date === "") {
    dateerr.innerHTML = "Date is required";
    valid = false;
  } else {
    dateerr.innerHTML = "";
  }
  if (mobileNo === "") {
    phonenumbererr.innerHTML = "Phonenumber required";
    valid = false;
  } else if (!phonenumberPattern.test(mobileNo)) {
    phonenumbererr.innerHTML = "Invalid Phonenumber";
    valid = false;
  } else {
    phonenumbererr.innerHTML = "";
  }
  if (!gender) {
    gendererr.innerHTML = "Gender is required";
    valid = false;
  } else {
    gendererr.innerHTML = "";
  }
  if (customerName && email && address && date && mobileNo && gender) {
    addToTable({
      customerName,
      email,
      address,
      date,
      mobileNo,
      gender,
    });
  } else {
    console.log("Validation failed. Please fill in all fields.");
  }
}
let counter = 1;
function addToTable(data) {
  let tbody = document.getElementById("tbody");
 fetchProducts().then(() => {
   const row = document.createElement("tr");
   row.innerHTML = `
        <td>${counter++}</td>
        <td colspan="2">
          <select name="productname" class="form-select select">
            <option value="">Please select any product</option>
            ${
              products.length > 0
                ? products
                    .map(
                      (product) =>
                        `<option value='${product.productName}' data-price='${product.price}'>${product.productName}</option>`
                    )
                    .join("")
                : "<option value=''>No products available</option>"
            }
          </select>
          <span class="span" id="producterror"></span>
        </td>
        <td>
          <input type='number'>
          <span class="span" id="quantityerror"></span>
        </td>
        <td id="price"></td>
        <td id="total"></td>
        <td class="d-flex">
          <button class="btn btn-danger ms-3" onclick="deleteData(${
            counter - 1
          })">Delete</button>
        </td>
      `;
   tbody.appendChild(row);
   row
     .querySelector('select[name="productname"]')
     .addEventListener("change", fetchProductDetails);
   row
     .querySelector('input[type="number"]')
     .addEventListener("input", fetchProductDetails);
   validRow(row);
   console.log("Row added:", row.innerHTML);
 });
}
function validRow(row) {
  let productSelect = row.querySelector('select[name="productname"]');
  let quantiityInput = row.querySelector('input[type = "number" ]');
  let productName = productSelect.value;
  let quantity = quantiityInput.value;
  let producterror = document.getElementById("producterror");
  let quantiityerror = document.getElementById("quantityerror");
  producterror.innerHTML = "";
  quantiityerror.innerHTML = "";
  if (productName=="") {
    producterror.innerHTML = "Please select atleast 1 product";
  }else{
    producterror.innerHTML=" ";
    
  }
  if (quantity == "" || quantity <= 0) {
    quantiityerror.innerHTML = "Please select alteast 1 quantity";
    return;
  }else{
    quantiityerror.innerHTML = " "; 
  }
}
function fetchProductDetails(event) {
  const row = event.target.closest("tr");
  const productName = row.querySelector("select[name='productname']").value;
  const quantity = row.querySelector('input[type="number"]').value || 0;
  fetchProducts().then(() => {
    const product = products.find(p => p.productName === productName);
    if (product) {
      const price = product.price;
      const total = price * quantity;
      row.querySelector("#price").textContent = price;
      row.querySelector("#total").textContent = total;
      updateBill();
    } else {
      console.error("Product not found:", productName);
    }
  }).catch(error => {
    console.error("Error fetching products in fetchProductDetails:", error);
  });
}
function updateBill() {
  const rows = document.querySelectorAll("#tbody tr");
  let productPrice = 0;
  rows.forEach((row) => {
    const total = parseFloat(row.querySelector("#total").textContent || 0);
    productPrice += total;
  });
  const gst = productPrice * 0.05;
  const shopDiscount = productPrice * 0.02;
  const finalPrice = productPrice + gst - shopDiscount;
  const productPriceElement = document.querySelector("#productPrice");
  const gstElement = document.querySelector("#gst");
  const shopDiscountElement = document.querySelector("#discount");
  const finalPriceElement = document.querySelector("#finalPrice");
  if (productPriceElement) {
    productPriceElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${productPrice.toFixed(2)}`;
  }
  if (gstElement) {
    gstElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${gst.toFixed(2)}`;
  }
  if (shopDiscountElement) {
    shopDiscountElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${shopDiscount.toFixed(2)}`;
  }
  if (finalPriceElement) {
    finalPriceElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${finalPrice.toFixed(2)}`;
  }
}
let tableData = [];
function addtocart() {
  const rows = document.querySelectorAll("#tbody tr");
  rows.forEach((row) => {
    const productName = row.querySelector('select[name="productname"]').value;
    const quantity = row.querySelector('input[type= "number"]').value;
    const price = row.querySelector("#price").textContent;
    const total = row.querySelector("#total").textContent;
    if (productName && quantity) {
      tableData.push({ productName, quantity, price, total });
    }
  });
  const customerData = {
    customerName: document.getElementById("name").value,
    email: document.getElementById("Email").value,
    mobileNo: document.getElementById("phonenumber").value,
    address: document.getElementById("Address").value,
    date: document.getElementById("Date").value,
    gender: document.getElementById("Gender").value,
    customerProduct: tableData,
  };
  console.log(customerData);
  fetch("http://localhost:8080/api/invoice/buy/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(
            `API Error: ${data.error.code} - ${data.error.reason}`
          );
        });
      }
    })
    .then((data) => {
      console.log(data);
      window.location.href = "customertable.html";
      document.getElementById("myform").reset();
      cleartable();
    })
    .catch((Error) => console.error("Error", Error));
}
function cleartable() {
  const tbody = document.getElementById('tbody');
  if(tbody){
    tbody.innerHTML = "";
  } 
  updateBill();
}
function cancel() {
  document.getElementById("tbody").innerHTML = "";
  updateBill();
}
function deleteData(id) {
  const row = document.querySelector(`#tbody tr:nth-child(${id})`);
  if(row){
    row.remove();
    updateBill();
  }
  const rows = document.querySelectorAll("#tbody tr");
  rows.forEach((row, index) => {
    row.dataset.id = index + 1;
    row.querySelector("td:first-child").textContent = index + 1;
    row
      .querySelector("button.btn-danger")
      .setAttribute("onclick", `deleteData(${index + 1})`);
  });
  counter = rows.length + 1;
}
