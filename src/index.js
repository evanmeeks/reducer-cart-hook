import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import API from "./mockAPI";
import "./styles.css";

const appState = API;

const cartReducer = (state, action) => {
  switch (action.type) {
    case "INCREASE_QUANTITY":
      return state.map(item => {
        if (item.name === action.name && item.inCart) {
          if (item.count > 9) {
            return item;
          } else return { ...item, count: item.count + 1 };
        } else if (item.name === action.name) {
          if (item.counterVal > 9) {
            return item;
          } else return { ...item, counterVal: item.counterVal + 1 };
        }
        return item;
      });
    case "DECREASE_QUANTITY":
      return state.map(item => {
        if (item.name === action.name && item.inCart) {
          if (item.count > 1) {
            return { ...item, count: item.count - 1 };
          } else {
            return item;
          }
        } else if (item.name === action.name && item.counterVal > 1) {
          return {
            ...item,
            counterVal: item.counterVal - 1
          };
        }
        return item;
      });
    case "ADD_TO_CART":
      return state.map(item => {
        if (item.name === action.name) {
          return {
            ...item,
            inCart: true,
            count: item.counterVal
          };
        }
        return item;
      });
    case "REMOVE_FROM_CART":
      return state.map(item => {
        if (item.name === action.name) {
          return {
            ...item,
            count: 0,
            counterVal: 1,
            inCart: false
          };
        }
        return item;
      });
    default:
      return state;
  }
};

function App() {
  const [cart, dispatch] = useReducer(cartReducer, appState);

  const onCartAdd = item => {
    dispatch({ type: "ADD_TO_CART", name: item.name });
  };

  const onIncrement = item => {
    dispatch({ type: "INCREASE_QUANTITY", name: item.name });
  };

  const onDecrement = item => {
    dispatch({ type: "DECREASE_QUANTITY", name: item.name });
  };
  const onCartRemove = item => {
    dispatch({ type: "REMOVE_FROM_CART", name: item.name });
  };

  const cartCountTotal = cart.reduce((acc, item) => acc + item.count, 0);
  const cartPriceTotal = cart.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  const cartTotals = () =>
    cartCountTotal === 0 ? (
      <b>Cart is empty</b>
    ) : (
      <>
        <b>
          <p>Items in Cart: {cartCountTotal}</p>
          <p>
            Total Price: $
            {Number.isInteger(cartPriceTotal)
              ? cartPriceTotal
              : cartPriceTotal.toFixed(2)}
          </p>
        </b>
      </>
    );

  const cartItems = cart.map(item => (
    <div key={item.name}>
      {item.inCart && (
        <>
          <p> Item Name: {item.name}</p>
          <p>
            Item Count: <button onClick={() => onDecrement(item)}>-</button>{" "}
            {item.count} <button onClick={() => onIncrement(item)}>+</button>
          </p>
          <p>
            Item Subtotal: $
            {Number.isInteger(item.count * item.price)
              ? item.count * item.price
              : `${(item.count * item.price).toFixed(2)}`}
          </p>
          <button onClick={() => onCartRemove(item)}>Remove From Cart</button>
          <hr />
        </>
      )}
    </div>
  ));

  const cartProducts = () => (
    <div className="flexParent">
      {cart.map(item => (
        <div key={item.name}>
          <p>{item.name}</p>
          <p>Price: ${item.price}</p>
          {!item.inCart ? (
            <>
              <button onClick={() => onDecrement(item)}>-</button>
              <input readOnly type="text" value={item.counterVal} />
              <button onClick={() => onIncrement(item)}>+</button>
              <br />
              <button onClick={() => onCartAdd(item)}>add</button>
            </>
          ) : (
            <p>
              <b>Item added!</b>
            </p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <h1>useReducer() Cart</h1>
      {cartItems}
      {cartTotals()}
      {cartProducts()}
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
