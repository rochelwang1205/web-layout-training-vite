// 請代入自己的網址路徑
const api_path = "rochel";
//產品 DOM
const productWrap = document.querySelector(".productWrap");
const cartList = document.querySelector(".shoppingCart-tableList");
const productSelect = document.querySelector(".productSelect");
let productData = [];
let cartData = [];

function init() {
  getProductList();
  getCartList();
}
init();
// 取得產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productData = response.data.products;
      renderProductWrap();
    });
}
// 重構
function combineProducHTMLItem(item) {
  return `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="js-addCart" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`;
}
function renderProductWrap() {
  let str = "";
  productData.forEach(function (item) {
    str += combineProducHTMLItem(item);
  });
  productWrap.innerHTML = str;
}
//種類篩選
productSelect.addEventListener("change", function (e) {
  let category = e.target.value;
  if (category == "全部") {
    renderProductWrap();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (item.category == category) {
      str += combineProducHTMLItem(item);
    }
  });
  productWrap.innerHTML = str;
});
productWrap.addEventListener("click", function (e) {
  e.preventDefault();
  let addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "js-addCart") {
    return;
  }
  let productId = e.target.getAttribute("data-id");
  addCartItem(productId);
});
// 取得購物車列表
function getCartList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      document.querySelector(".js-total").textContent =
        response.data.finalTotal;
      cartData = response.data.carts;

      let str = "";
      cartData.forEach(function (item) {
        str += `
                <tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>${item.product.price * item.quantity}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${
                          item.id
                        }" value="移除購物車">
                            clear
                        </a>
                    </td>
                </tr>`;
      });
      cartList.innerHTML = str;
    });
}
// 加入購物車
function addCartItem(id) {
  let numCheck = 1;
  cartData.forEach(function (item) {
    if (item.product.id === id) {
      numCheck = item.quantity += 1;
    }
  });
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: id,
          quantity: numCheck
        }
      }
    )
    .then(function (response) {
      alert("加入購物車成功");
      getCartList();
    });
}

// 刪除購物車內特定產品
cartList.addEventListener("click", function (e) {
  e.preventDefault(); //取消預設彈回
  let cartId = e.target.getAttribute("data-id");
  if (cartId == null) {
    return;
  }
  deleteCartItem(cartId);
});
function deleteCartItem(cartId) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then(function (response) {
      alert("刪除單筆購物車成功！");
      getCartList();
    });
}

// 清除購物車內全部產品
const discardAllBtn = document.querySelector(".discardAllBtn");
function deleteAllCartList() {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      alert("刪除全部購物車成功！");
      getCartList();
    })
    .catch(function (response) {
      alert("購物車已清空，請勿重複點擊！");
    });
}
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  deleteAllCartList();
});
// 建立訂單
const orderInfoBtn = document.querySelector(".orderInfoBtn");
orderInfoBtn.addEventListener("click",function(e){
  e.preventDefault();
  if(cartData.length ==0){
    alert("請加入購物車");
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;
  if (customerName==""|| customerPhone==""|| customerEmail==""|| customerAddress==""|| customerTradeWay==""){
    alert("請勿輸入空資訊");
    return;
  }
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": customerTradeWay
      }
    }
  }).then(function(response){
    alert("訂單建立成功");
     document.querySelector("#customerName").value="";
     document.querySelector("#customerPhone").value="";
     document.querySelector("#customerEmail").value="";
     document.querySelector("#customerAddress").value="";
     document.querySelector("#tradeWay").value="ATM";
    getCartList();
  })
  .catch(function(error) {
  console.error(error); // 檢查錯誤
  alert("訂單建立失敗");})
})