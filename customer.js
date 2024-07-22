document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  if(id){
    fetch("http://localhost:8080/api/product/add/product/${id}")
      .then((response) => response.json())
      .then((data) => {
        const select = document.getElementById("product");
        data.array.forEach((product) => {
          let option = document.createElement("option");
          option.value = product.productname;
          option.textContent = product.productname;
          select.appendChild(option);
        });
      })
      .catch((error) => console.log(error));
  }
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
  fetch('http://localhost:8080/api/invoice/buy/product', {
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
function addToTable(data) {
  let tbody = document.getElementById("tbody");

  // Check if data and products exist
  if (
    !data ||
    !data.products ||
    !Array.isArray(data.products) ||
    data.products.length === 0
  ) {
    console.error(
      "Unexpected API response format or empty products array:",
      data
    );
    return;
  }

  // Assume data.products is an array and use the first item if available
  let customerProduct = data.customerProduct[0]; // Ensure data.products[0] exists

  let options = `
    <option value="Samsung S20">Samsung S20</option>
    <option value="Lenovo">Lenovo</option>
    <option value="Samsung M31s">Samsung M31s</option>
    <option value="Hp laptop 15s">Hp laptop 15s</option>
    <option value="Dell Inspiron 15">Dell Inspiron 15</option>
    <option value="Iphone 15 Pro Max">Iphone 15 Pro Max</option>
    <option value="Acer aspire 5">Acer aspire 5</option>
    <option value="Iphone 15">Iphone 15</option>
  `;

  // Create a new row and set its inner HTML
  let newRow = tbody.insertRow();
  newRow.innerHTML = `
    <tr class='data'>
      <td>
        <select name="productname" class="form-select">
          <option value="">select a product</option>
          ${options}
        </select>
      </td>
      <td><input type='number' class='productquantity' value='${
        customerProduct.productquantity || 0
      }' /></td>
      <td>${customerProduct.price || 0}</td>
      <td>${(customerProduct.productquantity || 0) * (customerProduct.price || 0)}</td>
      <td class='cont'>
        <button class="btn btn-success me-3" onclick='editData(${
          data.id
        })'>Edit</button>
        <button class="btn btn-danger" onclick='deleteData(${
          data.id
        })'>Delete</button>
      </td>
    </tr>
  `;
}

function editData(id) {
  console.log(`Edit product with ID: ${id}`);
  
}

function deleteData(id) {
  console.log(`Delete product with ID: ${id}`);

}
