
import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const API_URL = "http://localhost:3000/api/products";
const AUTH_URL = "http://localhost:3000/user";
const categories = ["All"];

function App() {
  // Products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Storefront
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authFullname, setAuthFullname] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Fetch products from Express
  async function fetchProducts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid product data received from server.");
      }

      setProducts(
        data.map((product) => ({
          ...product,
          name: product.name || "Unnamed product",
          price: Number(product.price) || 0,
          discount: Number(product.discount) || 0,
          image: product.image || null,
        }))
      );
    } catch (err) {
      console.error("Product fetch error:", err);
      setError(
        "Could not connect to the store. Check that your backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Login and registration
  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);

    const isRegister = authMode === "register";

    try {
      const response = await fetch(
        `${AUTH_URL}/${isRegister ? "register" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: authEmail.trim(),
            password: authPassword,
            ...(isRegister
              ? { fullname: authFullname.trim() }
              : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (!data.user) {
        throw new Error("Authentication succeeded, but user data was not returned.");
      }

      // Start with a clean cart when an account logs in
      setCart([]);
      setFavorites([]);

      setCurrentUser(data.user);
      setAuthPassword("");
      setAuthEmail("");
      setAuthFullname("");
      setAuthOpen(false);
      setAuthError("");
      setAuthMessage("");
      setCartOpen(false);
    } catch (err) {
      console.error("Authentication error:", err);
      setAuthError(
        err.message || "Could not connect to the server."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  // Logout
  async function handleLogout() {
    setAuthError("");

    try {
      const response = await fetch(`${AUTH_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed.");
      }

      setCurrentUser(null);
      setCart([]);
      setFavorites([]);

      setAuthOpen(false);
      setCartOpen(false);
      setSelectedProduct(null);
      setAuthEmail("");
      setAuthPassword("");
      setAuthFullname("");
      setAuthError("");
      setAuthMessage("");
    } catch (err) {
      console.error("Logout error:", err);
      setAuthError(
        err.message || "Could not log out. Please try again."
      );
      setAuthOpen(true);
    }
  }

  // Product filtering
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCategory =
          category === "All" || product.category === category;

        return matchesSearch && matchesCategory;
      }),
    [products, search, category]
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Cart actions
  function addToCart(product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setSelectedProduct(null);
    setCartOpen(true);
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function openAuth(mode = "login") {
    setAuthMode(mode);
    setAuthError("");
    setAuthMessage("");
    setAuthOpen(true);
    setMenuOpen(false);
  }

  return (
    <>
      <div className="announcement">
        Thoughtful finds for everyday living <span>✳</span> Discover CarryOn
      </div>

      <header className="header wrap">
        <button
          className="icon-btn mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <a className="wordmark" href="#home">
          Carry<span>On</span><i>.</i>
        </a>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop all</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
        </nav>

        <div className="header-actions">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Find something..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                document.getElementById("shop")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          {currentUser ? (
            <div className="auth-header-actions">
              <span className="user-greeting">
                Hi, {currentUser.fullname?.split(" ")[0] || "there"}
              </span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="auth-header-btn"
              onClick={() => openAuth("login")}
            >
              Login
            </button>
          )}

          <button
            className="bag-btn"
            onClick={() => setCartOpen(true)}
          >
            <span>Your bag</span><b>{cartCount}</b>
          </button>
        </div>
      </header>

      <main>
        <section className="hero wrap" id="home">
          <div className="hero-copy">
            <span className="eyebrow">✳ THE EVERYDAY EDIT</span>
            <h1>Less, but<br /><em>better.</em></h1>
            <p>
              Useful little things. Thoughtfully chosen.
              Made for the everyday moments that make life.
            </p>
            <a className="button-dark" href="#shop">
              Explore the collection <span>↗</span>
            </a>
            <div className="hero-note">
              <div className="avatar-stack">
                <span>✳</span><span>◌</span><span>✦</span>
              </div>
              <span>Good things for your everyday.</span>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="/carryOn-hero.png"
              alt="CarryOn lifestyle collection"
            />
            <div className="floating-stamp">
              <span>THOUGHTFULLY</span>
              <strong>picked<br />for you</strong>
              <span>✳ CARRYON</span>
            </div>
            <div className="image-caption">
              <span>THE EVERYDAY COLLECTION</span><span>01 / 06</span>
            </div>
            <span className="hero-side-note">
              A LITTLE LESS ORDINARY — SINCE ALWAYS
            </span>
          </div>
        </section>

        <div className="ticker">
          <div>
            GOOD THINGS, MADE SIMPLE <span>✳</span>
            EVERYDAY FAVOURITES <span>✳</span>
            THOUGHTFULLY PICKED <span>✳</span>
            GOOD THINGS, MADE SIMPLE <span>✳</span>
            EVERYDAY FAVOURITES <span>✳</span>
            THOUGHTFULLY PICKED <span>✳</span>
          </div>
        </div>

        <section className="shop-section wrap" id="shop">
          <div className="section-top">
            <div>
              <span className="eyebrow">A FEW GOOD THINGS</span>
              <h2>Popular <em>picks.</em></h2>
            </div>
            <p>Everyday essentials.<br />Nothing you don't need.</p>
          </div>

          <div className="shop-controls">
            <div className="category-tabs">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="result-count">
              SHOWING {filteredProducts.length} ITEMS
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading products...</h3>
              <p>Please wait while we fetch the CarryOn collection.</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h3>Could not load products.</h3>
              <p>{error}</p>
              <button className="button-dark" onClick={fetchProducts}>
                Try again ↗
              </button>
            </div>
          ) : filteredProducts.length ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product._id}>
                  <button
                    className="product-image"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      src={product.image || undefined}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />

                    <span className="product-tag">
                      {product.discount > 0
                        ? `${product.discount}% OFF`
                        : "EVERYDAY"}
                    </span>
                    <span className="quick-add">
                      Quick view <span>↗</span>
                    </span>
                  </button>

                  <div className="product-info">
                    <div>
                      <button
                        className="product-name"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.name}
                      </button>
                      <p>Everyday essentials</p>
                    </div>

                    <button
                      className={`heart ${
                        favorites.includes(product._id) ? "liked" : ""
                      }`}
                      onClick={() => toggleFavorite(product._id)}
                      aria-label="Toggle favourite"
                    >
                      {favorites.includes(product._id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="price-row">
                    <strong>
                      ₹{product.price.toLocaleString("en-IN")}
                    </strong>
                    <button
                      className="add-round"
                      onClick={() => addToCart(product)}
                      aria-label={`Add ${product.name} to bag`}
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Nothing here just yet.</h3>
              <p>Try a different search or category.</p>
              <button
                className="button-dark"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                See all products ↗
              </button>
            </div>
          )}

          <div className="center-link">
            <a
              href="#shop"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Explore everything <span>↗</span>
            </a>
          </div>
        </section>

        <section className="manifesto" id="story">
          <div className="manifesto-image">
            <img
              src="/carryOn-hero.png"
              alt="A calm, considered retail space"
              loading="lazy"
            />
          </div>
          <div className="manifesto-copy">
            <span className="eyebrow">OUR LITTLE PHILOSOPHY</span>
            <h2>Buy less.<br />Choose <em>well.</em></h2>
            <p>
              We believe the best things aren't always the loudest.
              They're the things you reach for every day, that work
              beautifully and simply make life a little easier.
            </p>
            <a className="text-link" href="#shop">
              Find your everyday favourites ↗
            </a>
            <span className="scribble">the good stuff, always.</span>
          </div>
        </section>

        <section className="perks wrap">
          <div>
            <span aria-hidden="true">♧</span>
            <h3>Thoughtfully picked</h3>
            <p>Everyday things, chosen with care.</p>
          </div>
          <div>
            <span aria-hidden="true">↗</span>
            <h3>Simple by design</h3>
            <p>Useful, timeless, uncomplicated.</p>
          </div>
          <div>
            <span aria-hidden="true">♡</span>
            <h3>Made for your routine</h3>
            <p>Little upgrades to everyday life.</p>
          </div>
        </section>

        <section className="newsletter">
          <div className="newsletter-icon">✳</div>
          <span className="eyebrow">A NOTE FROM US</span>
          <h2>A little <em>something</em><br />good.</h2>
          <p>Occasional updates, new finds, and things worth sharing.</p>
          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (email.trim()) setSubscribed(true);
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">↗</button>
            {subscribed && (
              <span className="form-success">Thanks for joining us!</span>
            )}
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main wrap">
          <div>
            <a className="wordmark footer-logo" href="#home">
              Carry<span>On</span><i>.</i>
            </a>
            <p>
              Everyday things. Chosen with care.<br />
              A little less ordinary.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <b>EXPLORE</b>
              <a href="#shop">Shop all</a>
              <a href="#story">Our story</a>
              <a href="#home">Back home</a>
            </div>
            <div>
              <b>NEED HELP?</b>
              <a href="mailto:hello@carryon.example">Contact us</a>
              <a href="#shop">Shipping info</a>
              <a href="#shop">FAQs</a>
            </div>
          </div>

          <a className="back-top" href="#home">BACK TO TOP ↑</a>
        </div>

        <div className="footer-bottom wrap">
          <span>© {new Date().getFullYear()} CARRYON</span>
          <span>THOUGHTFULLY PICKED. EVERY DAY.</span>
          <span>MADE WITH CARE ♡</span>
        </div>
      </footer>

      {/* Shopping bag drawer */}
      <div
        className={`drawer-backdrop ${cartOpen ? "show" : ""}`}
        onClick={() => setCartOpen(false)}
      >
        <aside
          className={`drawer ${cartOpen ? "show" : ""}`}
          onClick={(event) => event.stopPropagation()}
          aria-label="Shopping bag"
        >
          <div className="drawer-head">
            <div>
              <span className="eyebrow">YOUR EVERYDAY FINDS</span>
              <h2>Your bag <span>({cartCount})</span></h2>
            </div>
            <button
              className="icon-btn"
              onClick={() => setCartOpen(false)}
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-bag">♡</div>
              <h3>A little empty here.</h3>
              <p>Your next everyday favourite is waiting.</p>
              <button
                className="button-dark"
                onClick={() => setCartOpen(false)}
              >
                Explore the collection ↗
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <img
                      src={item.image || undefined}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />

                    <div className="cart-item-details">
                      <strong>{item.name}</strong>
                      <span>Everyday essentials</span>
                      <b>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </b>
                      <div className="qty-control">
                        <button onClick={() => changeQuantity(item._id, -1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeQuantity(item._id, 1)}>
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="remove"
                      onClick={() =>
                        changeQuantity(item._id, -item.quantity)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-bottom">
                <div className="shipping-note">
                  ✳ You're browsing the CarryOn collection.
                </div>
                <div className="subtotal">
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>
                <p>
                  Shipping and any applicable taxes are calculated at checkout.
                </p>
                <button
                  className="checkout-btn"
                  onClick={() =>
                    alert("Checkout will be connected to your backend next.")
                  }
                >
                  Continue to checkout{" "}
                  <span>₹{subtotal.toLocaleString("en-IN")} ↗</span>
                </button>
                <button
                  className="continue"
                  onClick={() => setCartOpen(false)}
                >
                  Continue shopping
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Product details modal */}
      {selectedProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <section
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
            aria-label={selectedProduct.name}
          >
            <button
              className="modal-close icon-btn"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              ✕
            </button>

            <img
              src={selectedProduct.image || undefined}
              alt={selectedProduct.name}
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />

            <div className="modal-copy">
              <span className="eyebrow">
                {selectedProduct.discount > 0
                  ? `${selectedProduct.discount}% OFF`
                  : "EVERYDAY"}
              </span>
              <h2>{selectedProduct.name}</h2>
              <p className="modal-color">Everyday essentials</p>
              <strong className="modal-price">
                ₹{selectedProduct.price.toLocaleString("en-IN")}
              </strong>
              <p>
                {selectedProduct.description ||
                  "A thoughtfully chosen everyday essential."}
              </p>
              <div className="modal-perk">
                ✳ A thoughtful everyday essential.
              </div>
              <button
                className="button-dark full"
                onClick={() => addToCart(selectedProduct)}
              >
                Add to bag <span>↗</span>
              </button>
              <span className="small-note">
                Live product details from the CarryOn store.
              </span>
            </div>
          </section>
        </div>
      )}

      {/* Login and registration modal */}
      {authOpen && (
        <div
          className="auth-backdrop"
          onClick={() => {
            if (!authLoading) setAuthOpen(false);
          }}
        >
          <section
            className="auth-modal"
            onClick={(event) => event.stopPropagation()}
            aria-label={authMode === "login" ? "Login" : "Register"}
          >
            <button
              type="button"
              className="auth-close"
              onClick={() => setAuthOpen(false)}
              aria-label="Close authentication form"
            >
              ×
            </button>

            <p className="eyebrow">WELCOME TO CARRYON</p>

            <h2>
              {authMode === "login" ? "Welcome back." : "Join us."}
            </h2>

            <p>
              {authMode === "login"
                ? "Log in to your account."
                : "Create your CarryOn account."}
            </p>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={authFullname}
                  onChange={(event) => setAuthFullname(event.target.value)}
                  autoComplete="name"
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                autoComplete="email"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                autoComplete={
                  authMode === "login"
                    ? "current-password"
                    : "new-password"
                }
                minLength={authMode === "register" ? 8 : undefined}
                required
              />

              {authError && (
                <p className="auth-error" role="alert">
                  {authError}
                </p>
              )}

              {authMessage && (
                <p className="auth-success" role="status">
                  {authMessage}
                </p>
              )}

              <button
                type="submit"
                className="button-dark auth-submit"
                disabled={authLoading}
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Login ↗"
                    : "Create account ↗"}
              </button>
            </form>

            <p className="auth-switch">
              {authMode === "login"
                ? "New to CarryOn? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(
                    authMode === "login" ? "register" : "login"
                  );
                  setAuthError("");
                  setAuthMessage("");
                }}
              >
                {authMode === "login" ? "Register" : "Login"}
              </button>
            </p>
          </section>
        </div>
      )}
    </>
  );
}

export default App;
