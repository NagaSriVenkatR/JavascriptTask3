window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const customerEmail = urlParams.get("Customer");
  if (customerEmail) {
    fetchCustomerInvoice(customerEmail);
  }
};

function fetchCustomerInvoice(email) {
  console.log(`Fetching data for email: ${email}`);
  fetch(`http://localhost:8080/api/invoice/getCustomer/${email}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("API Response:", data);
      if (data.data && data.data.Data && data.data.Data.customer) {
        const customer = data.data.Data.customer;
        const customerProducts = customer.customerProducts;
        const customerNameElement = document.getElementById("customerName");
        const emailElement = document.getElementById("email");
        const dateElement = document.getElementById("date");
        const mobileNoElement = document.getElementById("mobileNo");
        const addressElement = document.getElementById("address");
        const genderElement = document.getElementById("gender");
        const tbody = document.getElementById("tbody");
        const productPriceElement = document.getElementById("productPrice");
        const gstElement = document.getElementById("gst");
        const discountElement = document.getElementById("discount");
        const finalPriceElement = document.getElementById("finalPrice");
          console.log({
            customerNameElement,
            emailElement,
            dateElement,
            mobileNoElement,
            addressElement,
            genderElement,
            tbody,
            productPriceElement,
            gstElement,
            discountElement,
            finalPriceElement,
          });

        if (
          customerNameElement &&
          emailElement &&
          dateElement &&
          mobileNoElement &&
          addressElement &&
          genderElement &&
          tbody &&
          productPriceElement &&
          gstElement &&
          discountElement &&
          finalPriceElement
        ) {
          customerNameElement.innerText = customer.customerName;
          emailElement.innerText = customer.email;
          dateElement.innerText = customer.date;
          mobileNoElement.innerText = customer.mobileNo;
          addressElement.innerText = customer.address;
          genderElement.innerText = customer.gender;

          tbody.innerHTML = "";
          customerProducts.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = ` 
                          <td>${index + 1}</td>
                          <td>${product.productName}</td>
                          <td class="text-center"><i class="fa-solid fa-indian-rupee-sign"></i>
                          ${product.price}</td>
                          <td class="text-center">${product.quantity}</td>
                          <td class="text-end"><i class="fa-solid fa-indian-rupee-sign"></i>
                          ${product.totalAmount}</td>
                        `;
            tbody.appendChild(row);
          });

          productPriceElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${data.data.Data.totalprouctsAmount}`;
          gstElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${data.data.Data.gstAmount}`;
          discountElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${data.data.Data.discountAmount}`;
          finalPriceElement.innerHTML = `<i class="fa-solid fa-indian-rupee-sign"></i>${data.data.Data.grandTotalAmount}`;
        } else {
          console.error("One or more elements not found.");
        }
      } else {
        console.warn("No customer data found");
      }
    })
    .catch((error) => {
      console.error("Error fetching customer details :", error);
    });
}
