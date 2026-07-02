import { useEffect, useRef, useState } from "react";
import { getProducts } from "../../services/productService";
import { createSale } from "../../services/saleService";
import Layout from "../../components/Layout";

function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [search, setSearch] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiptItems, setReceiptItems] = useState([]);
  const receiptRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.filter((p) => p.isActive && p.currentStock > 0));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find((x) => x.productId === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.priceInPKR,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.productId === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.productId === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((x) => x.productId !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const printReceipt = () => {
    const printContents = receiptRef.current.innerHTML;
    const win = window.open("", "", "width=400,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2, h3, p { text-align: center; margin: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px dashed #999; padding: 8px; text-align: left; }
            .total { font-size: 20px; font-weight: bold; margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const cashierId = Number(localStorage.getItem("userId")) || 2;
      const dto = {
        branchId: 1,
        cashierId,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const result = await createSale(dto);

      setReceiptItems(cart);
      setInvoice(result);
      setCart([]);
      loadProducts();
    } catch (err) {
      console.log(err);
      alert("Sale Failed");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Point Of Sale</h1>
            <p className="text-gray-500">Create a new sale</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
              <input
                type="text"
                placeholder="Search Product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg p-3 mb-5"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products
                  .filter((product) =>
                    product.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-xl p-4 hover:shadow-lg transition"
                    >
                      <h4 className="font-bold text-lg">{product.name}</h4>
                      <p className="text-gray-500">{product.categoryName}</p>
                      <p className="mt-2 font-semibold">
                        Rs {Number(product.priceInPKR).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock : {product.currentStock}
                      </p>

                      <button
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                      >
                        Add To Cart
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cart */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-2xl font-bold mb-4">Cart</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.productId} className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <h5 className="font-semibold">{item.name}</h5>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600"
                          >
                            ✕
                          </button>
                        </div>

                        <p className="text-gray-500">
                          Rs {Number(item.price).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => decreaseQty(item.productId)}
                            className="bg-gray-200 px-3 py-1 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => increaseQty(item.productId)}
                            className="bg-gray-200 px-3 py-1 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-5" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>Rs {Number(total).toLocaleString()}</span>
                  </div>

                  <select
                    className="w-full border rounded-lg p-3 mt-5"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>

                  <button
                    onClick={handleSale}
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Complete Sale
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {invoice && (
          <div
            ref={receiptRef}
            className="bg-white rounded-xl shadow p-6 mt-6 max-w-lg"
          >
            <h2 className="text-center text-2xl font-bold">ABC STORE</h2>
            <p className="text-center text-gray-500">POS Receipt</p>

            <hr className="my-4" />

            <p>
              <strong>Invoice :</strong> {invoice.invoiceNumber}
            </p>
            <p>
              <strong>Date :</strong> {new Date().toLocaleString()}
            </p>
            <p>
              <strong>Cashier :</strong> {localStorage.getItem("fullName")}
            </p>

            <hr className="my-4" />

            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th>Qty</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {receiptItems.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>Rs {invoice.totalAmount.toLocaleString()}</span>
            </div>

            <p className="mt-4">
              <strong>Payment :</strong> {paymentMethod}
            </p>

            <p className="text-center mt-6 font-semibold">
              Thank you for shopping!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Sales;
