window.onload = () => {
  tableAdd();
};
function tableAdd() {
  fetch('http://localhost:8080/api/invoice/getAllCustomerAndBuyedProduct')
  .then((res)=>{
    return res.json();
  })
  .then((response)=>{
    const data = response.data;
    // Sort data by date to ensure newly added data is at the bottom
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    let table = "";
    for(let i=0;i<data.length;i++){
      let customer = data[i];
      // for(let j=0;j<customer.customerProducts.length;j++){
      //   const product = customer.customerProducts[j];
        let sno = i + 1;
        table += "<tr class = 'data'>";
        table += "<td class=''>" + sno + "</td>";
        // table += "<td class=''>" + customer.id + "</td>";
        table += "<td class=''>" + customer.customerName + "</td>";
        table += "<td class=''>" + customer.email + "</td>";
        table += "<td class=''>" + customer.mobileNo + "</td>";
        table += "<td class=''>" + customer.address + "</td>";
        table += "<td class=''>" + customer.date + "</td>";
        table += "<td class=''>" + customer.gender + "</td>";
        // table += "<td class=''>" + product.id + "</td>";
        // table += "<td class=''>" + product.productName + "</td>";
        // table += "<td class=''>" + product.quantity + "</td>";
        // table += "<td class=''>" + product.price + "</td>";
        // table += "<td class=''>" + product.totalAmount + "</td>";
        table += `<td class=''>
                  <button class="btn btn-primary" onclick="customerEmail('${customer.email}')">View</button>
                 
                </td>`;
        table += "</tr>";
      // } 
    }
    document.getElementById("tbody").innerHTML = table;
  })
  .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
function customerEmail(email) {
  window.location.href = `customerinvoice.html?Customer=${email}`;
}