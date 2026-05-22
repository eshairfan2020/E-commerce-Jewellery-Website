import { useState, createContext, useContext } from "react";

/* ---------------- CONTEXT ---------------- */

const AppContext = createContext();

const products = [
  {
    id: 1,
    name: "Gold Necklace",
    price: 120,
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a",
    category: "necklace",
  },
  {
    id: 2,
    name: "Diamond Ring",
    price: 250,
    image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
    category: "ring",
  },
  {
    id: 3,
    name: "Pearl Earrings",
    price: 90,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
    category: "earrings",
  },
  {
    id: 4,
    name: "Bracelet",
    price: 90,
    image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6",
    category: "bracelet",
  },
  {
    id: 5,
    name: "Heart Necklace",
    price: 200,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    category: "necklace",
  },
  {
    id: 6,
    name: "Clove Bracelet",
    price: 100,
    image: "",
    category: "bracelet",
  },
  {
    id: 7,
    name:"Titanium Stainless Steel",
    price: 600,
    image:"",
    category: "bracelet"

  },
 {
    id: 8,
    name: "Heart Necklace",
    price: 200,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    category: "necklace",
  }, 
    {
    id: 9,
    name: "Heart Necklace",
    price: 200,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    category: "necklace",
  },
  {
    id: 10,
    name: "Heart Necklace",
    price: 200,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    category: "necklace",
  }, 
];

/* ---------------- CONTEXT PROVIDER ---------------- */

function Provider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <AppContext.Provider value={{ cart, wishlist, addToCart, toggleWishlist }}>
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => useContext(AppContext);

/* ---------------- MAIN APP ---------------- */

export default function App() {
  const [step, setStep] = useState("shop");
  const [cart, setCart] = useState([]);

  const clearCart = () => setCart([]);

  return (
    <Provider>
      <Navbar cart={cart} />

      {step === "shop" && (
        <Products
          setStep={setStep}
          cart={cart}
          setCart={setCart}
        />
      )}

      {step === "checkout" && (
        <Checkout
          cart={cart}
          setStep={setStep}
          clearCart={clearCart}
        />
      )}

      {step === "success" && (
        <Success setStep={setStep} />
      )}

      <Footer />
    </Provider>
  );
}

/* ---------------- NAVBAR ---------------- */

function Navbar({ cart }) {
  return (
    <div className="navbar">
      <h2>Luxury Jewels</h2>
      <div>Cart ({cart.length})</div>
    </div>
  );
}

/* ---------------- PRODUCTS ---------------- */

function Products({ setStep, cart, setCart }) {
  const { toggleWishlist, wishlist } = useApp();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openModal = (p) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <div className="section">
      <h2>Collection</h2>

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <img src={p.image} />

            <button onClick={() => toggleWishlist(p)}>
              {wishlist.find((i) => i.id === p.id) ? "♥" : "♡"}
            </button>

            <h3>{p.name}</h3>
            <p>${p.price}</p>

            <button onClick={() => openModal(p)}>Quick View</button>

            <button onClick={() => {
              setCart([...cart, { ...p, qty: 1 }]);
            }}>
              Add
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => setStep("checkout")}>
        Proceed to Checkout
      </button>

      {open && (
        <Modal product={selected} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

/* ---------------- MODAL ---------------- */

function Modal({ product, onClose }) {
  const { addToCart } = useApp();

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img src={product.image} />

        <div>
          <h2>{product.name}</h2>
          <p>${product.price}</p>

          <button onClick={() => addToCart(product)}>
            Add to Cart
          </button>

          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CHECKOUT ---------------- */

function Checkout({ cart, setStep, clearCart }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = () => {
    clearCart();
    setStep("success");
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      {cart.map((i) => (
        <p key={i.id}>
          {i.name} x {i.qty}
        </p>
      ))}

      <h3>Total: ${total}</h3>

      <button onClick={placeOrder}>Place Order</button>
      <button onClick={() => setStep("shop")}>Back</button>
    </div>
  );
}

/* ---------------- SUCCESS ---------------- */

function Success({ setStep }) {
  return (
    <div className="success">
      <h1>🎉 Order Placed</h1>
      <button onClick={() => setStep("shop")}>
        Back to Store
      </button>
    </div>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return <div className="footer">Luxury Jewels © 2026</div>;
}
