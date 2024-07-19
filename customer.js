document.addEventListener("DOMContentLoaded",function () {
    fetch(`http://localhost:8080/api/product/add/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
  document.getElementById("myform").addEventListener("submit",myfunction);
})
function loadproducts() {

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
    };
    console.log(obj);
    fetch(`http://localhost:8080/api/invoice/buy/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json()
          .then((data) => {
            throw new Error(
              `API Error: ${data.error.code} - ${data.error.reason}`
            );
          });
        }
        
      })
      .then((data) => console.log(data))
      .catch((Error) => console.error("Error", Error));
    document.getElementById("myform").reset();
  }
  

