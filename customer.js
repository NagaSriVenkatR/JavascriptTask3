document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("myform").addEventListener("submit", myfunction);
});
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
  let valid = true;
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
  }
  if (address === "") {
    addresserr.innerHTML = "Address required";
    valid = false;
  }
  if (date === "") {
    dateerr.innerHTML = "Date is required";
    valid = false;
  }
  if (mobileNo === "") {
    phonenumbererr.innerHTML = "Phonenumber required";
    valid = false;
  } else if (!phonenumberPattern.test(mobileNo)) {
    phonenumbererr.innerHTML = "Invalid Phonenumber";
    valid = false;
  }
  if (!gender) {
    gendererr.innerHTML = "Gender is required";
    valid = false;
  }
  let obj = {
    customerName: customerName,
    email: email,
    mobileNo: mobileNo,
    address: address,
    date: date,
    gender: gender,
    customerProduct: [],
  };
  console.log(obj);
  fetch("http://localhost:8080/api/invoice/buy/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
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
      addToTable(data);
      document.getElementById("myform").reset();
    })
    .catch((Error) => console.error("Error", Error));
}
let counter = 1;
function addToTable(data) {
  let tbody = document.getElementById("tbody");
  let row = tbody.insertRow();

  row.innerHTML = `
    <td>${counter++}</td>
    <td colspan="2">
      <select class="form-select select" name="productname">
        <option value="">please select any product</option>
        <option value="Samsung S20">Samsung S20</option>
        <option value="Lenovo">Lenovo</option>
        <option value="Samsung M31s">Samsung M31s</option>
        <option value="Hp laptop 15s">Hp laptop 15s</option>
        <option value="Dell Inspiron 15">Dell Inspiron 15</option>
        <option value="Iphone 15 Pro Max">Iphone 15 Pro Max</option>
        <option value="Acer aspire 5">Acer aspire 5</option>
        <option value="Iphone 15">Iphone 15</option>
      </select>
    </td>
    <td>
      <input class="" type="number">
    </td>
    <td class='price'></td>
    <td class='total'></td>
    <td>
      <button class="btn btn-warning" onclick="editData(${
        counter - 1
      })">Edit</button>
      <button class="btn btn-danger" onclick="deleteData(${
        counter - 1
      })">Delete</button>
    </td>
  `;
    row
      .querySelector('select[name="productname"]')
      .addEventListener("change", fetchProductDetails);
    row
      .querySelector('input[type="number"]')
      .addEventListener("input", fetchProductDetails);
}
const productData = {
  "Samsung S20": { price: 80000 },
  "Lenovo": { price: 50000 },
  "Samsung M31s": { price: 18000 },
  "Hp laptop 15s": { price: 60000 },
  "Dell Inspiron 15": { price: 55000 },
  "Iphone 15 Pro Max": { price: 150000 },
  "Acer aspire 5": { price: 54999 },
  "Iphone 15": { price: 100000 }
};
function fetchProductDetails(event) {
  const row = event.target.closest("tr");
  const productName = row.querySelector("select[name='productname']").value;
  const quantity = row.querySelector('input[type="number"]').value || 0;

  if (productName && quantity) {
    const product = productData[productName];
    if (product) {
      const price = product.price;
      const total = price * quantity;

      const priceCost = row.querySelector(".price");
      const totalCost = row.querySelector(".total");

      priceCost.textContent = price;
      totalCost.textContent = total;
    } else {
      console.error("Product not found:", productName);
    }
  }
}
function editData(id) {
  console.log(`Edit product with ID: ${id}`);
}

function deleteData(id) {
  console.log(`Delete product with ID: ${id}`);
}
