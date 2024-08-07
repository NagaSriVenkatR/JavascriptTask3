document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("myform").addEventListener("submit", myfunction);
  document.getElementById("addtocart").addEventListener("click", addtocart);
  document.getElementById("clearcart").addEventListener("click", clearcart);
});
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
  let namePattern = /^[A-Za-z]+ [A-Za-z]+$/;
  let emailPattern =
    /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-zA-Z]+).([a-zA-Z]{2,20})$/;
  let phonenumberPattern = /^([0-9]{10})$/;
  let valid = true;
  if (customerName === "") {
    nameerr.innerHTML = "Name is required";
    valid = false;
  } else if (!namePattern.test(customerName)) {
    nameerr.innerHTML = "Name should have first name and last name";
    valid = false;
  } else {
    nameerr.innerHTML = "";
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
  if(!gender){
    gendererr.innerHTML = "gender is required";
    valid = false;
  }else{
    gendererr.innerHTML="";
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
  console.log({
    customerName,
    email,
    address,
    date,
    mobileNo,
    gender,
    valid,
  });
  if (valid) {
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
  const lastRow = tbody.querySelector("tr:last-child"); 
  if (lastRow && !validRow(lastRow)) {
    console.log(
      "Last row validation failed. Please correct it before adding a new row."
    );
    return;
  }
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
    console.log("Row added:", row.innerHTML);    
  });
}
function validRow(row) {
  let productSelect = row.querySelector('select[name="productname"]');
  let quantiityInput = row.querySelector('input[type = "number" ]');
  let productName = productSelect.value;
  let quantity = quantiityInput.value;
  let producterror = row.querySelector("#producterror");
  let quantiityerror = row.querySelector("#quantityerror");
  producterror.innerHTML = "";
  quantiityerror.innerHTML = "";
  let isValid = true;
  if (productName === "") {
    producterror.innerHTML = "Please select atleast 1 product";
    isValid = false;
  } else {
    producterror.innerHTML = " ";
  }
  if (quantity === "" || quantity <= 0) {
    quantiityerror.innerHTML = "Please select alteast 1 quantity";
    isValid = false;
  } else {
    quantiityerror.innerHTML = " ";
  }
  return isValid;
}
function fetchProductDetails(event) {
  const row = event.target.closest("tr");
  const productName = row.querySelector("select[name='productname']").value;
  const quantity = row.querySelector('input[type="number"]').value || 0;
  fetchProducts()
    .then(() => {
      const product = products.find((p) => p.productName === productName);
      if (product) {
        const price = product.price;
        const total = price * quantity;
        row.querySelector("#price").textContent = price;
        row.querySelector("#total").textContent = total;
        updateBill();
      } else {
        console.error("Product not found:", productName);
      }
    })
    .catch((error) => {
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
    productPriceElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${productPrice.toFixed(
      2
    )}`;
  }
  if (gstElement) {
    gstElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${gst.toFixed(
      2
    )}`;
  }
  if (shopDiscountElement) {
    shopDiscountElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${shopDiscount.toFixed(
      2
    )}`;
  }
  if (finalPriceElement) {
    finalPriceElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${finalPrice.toFixed(
      2
    )}`;
  }
}
let tableData = [];
function addtocart() {
  const rows = document.querySelectorAll("#tbody tr");
  tableData = []; // Clear tableData before adding new entries

  let formValid = true;
  let rowValid = true;

  // Validate form fields
  const customerName = document.getElementById("name").value;
  const email = document.getElementById("Email").value;
  const address = document.getElementById("Address").value;
  const date = document.getElementById("Date").value;
  const mobileNo = document.getElementById("phonenumber").value;
  const gender = document.getElementById("Gender").value;
  const nameerr = document.getElementById("nameerror");
  const emailerr = document.getElementById("emailerror");
  const addresserr = document.getElementById("addresserror");
  const dateerr = document.getElementById("dateerror");
  const phonenumbererr = document.getElementById("phonenumbererror");
  const gendererr = document.getElementById("gendererror");
  const namePattern = /^[A-Za-z]+ [A-Za-z]+$/;
  const emailPattern =
    /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-zA-Z]+).([a-zA-Z]{2,20})$/;
  const phonenumberPattern = /^([0-9]{10})$/;

  if (customerName === "") {
    nameerr.innerHTML = "Name is required";
    formValid = false;
  } else if (!namePattern.test(customerName)) {
    nameerr.innerHTML = "Name should have first name and last name";
    formValid = false;
  } else {
    nameerr.innerHTML = "";
  }

  if (email === "") {
    emailerr.innerHTML = "Email is required";
    formValid = false;
  } else if (!emailPattern.test(email)) {
    emailerr.innerHTML = "Invalid email format";
    formValid = false;
  } else {
    emailerr.innerHTML = "";
  }

  if (!gender) {
    gendererr.innerHTML = "Gender is required";
    formValid = false;
  } else {
    gendererr.innerHTML = "";
  }

  if (mobileNo === "") {
    phonenumbererr.innerHTML = "Phonenumber is required";
    formValid = false;
  } else if (!phonenumberPattern.test(mobileNo)) {
    phonenumbererr.innerHTML = "Invalid Phonenumber";
    formValid = false;
  } else {
    phonenumbererr.innerHTML = "";
  }

  // Validate each row
  rows.forEach((row) => {
    if (!validRow(row)) {
      rowValid = false;
    } else {
      const productName = row.querySelector('select[name="productname"]').value;
      const quantity = row.querySelector('input[type="number"]').value;
      const price = row.querySelector("#price").textContent;
      const total = row.querySelector("#total").textContent;

      if (productName && quantity && quantity > 0) {
        tableData.push({ productName, quantity, price, total });
      }
    }
  });

  if (formValid && rowValid) {
    const customerData = {
      customerName,
      email,
      address,
      date,
      mobileNo,
      gender,
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
        if (response.ok) {
          return response.json();
        } else {
          let error = response;
          error.info = new Error(
            `<i class="fa-solid fa-triangle-exclamation"></i> Please recheck the email, mobile number, and name`
          );
          throw error;
        }
      })
      .then((data) => {
        console.log(data);
        window.location.href = "customertable.html";
        document.getElementById("myform").reset();
        cleartable();
      })
      .catch((error) => {
        console.log(error);
        const errorMessageElement = document.getElementById("err-api");
        errorMessageElement.innerHTML = error.info.message;
      });
  } else {
    console.log(
      "Validation failed. Please correct all errors before adding to cart."
    );
  }
}


// function cleartable() {
//   const tbody = document.getElementById("tbody");
//   if (tbody) {
//     tbody.innerHTML = "";
//   }
//   updateBill();
// }
function cleartable() {
  const tbody = document.getElementById("tbody");
  if (tbody) {
    tbody.innerHTML = ""; // Remove all rows
  }

  // Reset the billing summary
  updateBill();
}
function clearcart() {
  // Reset the form fields
  document.getElementById("myform").reset();
  clearErrorMessages();
  // Clear the table rows
  cleartable();
  window.location.reload();
}
function clearErrorMessages() {
  const errorElements = [
    "nameerror",
    "emailerror",
    "addresserror",
    "dateerror",
    "phonenumbererror",
    "gendererror",
    "producterror",
    "quantityerror",
    "err-api",
  ];

  errorElements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = "";
    }
  });
}


function deleteData(id) {
  const row = document.querySelector(`#tbody tr:nth-child(${id})`);
  if (row) {
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
