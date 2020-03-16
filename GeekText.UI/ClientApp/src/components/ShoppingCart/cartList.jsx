import React, { Component } from "react";
import Cart from "./cart";
import CartBar from "./CartBar";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { render } from "@testing-library/react";
import SaveForLater from "./saveForLater";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import NumberFormat from "react-number-format";
import Button from "@material-ui/core/Button";

const StyledBadge = withStyles(theme => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px"
  }
}))(Badge);

const Tablestyle = {
  maxWidth: "50%"
};

var cellStyle = {
  borderBottom: "none",
  width: "100%"
};

const margingStyle = {
  marginLeft: 20,
  marginTop: 40
};

const margingStyleTop = {
  marginTop: 50
};

const verticalDividerStyle = {
  borderRight: "0.1em solid black",
  padding: "0.5em"
};

const summaryOrderStyle = {
  position: "absolute",
  top: "3.5em",
  left: "50em",
  maxWidth: "30%"
};

const orderDetailStyle = {
  position: "absolute",
  top: "6em",
  left: "-2em"
};
class CartList extends Component {
  state = {
    books: [
      {
        id: 1,
        name: "How to Win Friends & Influence People   ",
        price: 14,
        orderQTY: 2,
        itemSubtotal: 2 * 14 // this will come from the add to cart
      },
      {
        id: 2,
        name: "The 7 Habits of Highly Effective People",
        price: 17,
        orderQTY: 1,
        itemSubtotal: 17 // this will come from the add to cart
      },
      {
        id: 3,
        name: "Principles: Life and Work. Better Habbit",
        price: 18,
        orderQTY: 2,
        itemSubtotal: 2 * 18 // this will come from the add to cart
      },
      {
        id: 4,
        name: "Never Split the Difference. Negotiate it instead",
        price: 4.5,
        orderQTY: 3,
        itemSubtotal: 3 * 4.5 // this will come from the add to cart
      }
    ],
    saveForLater: []
  };

  handleIncrement = book => {
    const books = [...this.state.books];
    const index = books.indexOf(book);
    books[index] = { ...book };
    books[index].orderQTY++;
    books[index].itemSubtotal = books[index].price * books[index].orderQTY;
    this.setState({ books });

    this.setState({ itemTotal: this.state.itemTotal + 1 });

    this.setState({
      subtotal: this.state.books.reduce((acc, b) => acc + b.itemSubtotal, 0)
    });
  };

  handleDecrement = book => {
    const books = [...this.state.books];
    const index = books.indexOf(book);
    books[index] = { ...book };

    if (books[index].orderQTY - 1 <= 0) {
      // remove from cart
      this.setState({ books: this.state.books.filter(b => b.id !== book.id) });
    } else {
      books[index].orderQTY--;
      books[index].itemSubtotal = books[index].price * books[index].orderQTY;
      this.setState({ books });
    }

    this.setState({ itemTotal: this.state.itemTotal - 1 });
    this.setState({
      subtotal: this.state.books.reduce((acc, b) => acc + b.itemSubtotal, 0)
    });
  };

  handleDelete = book => {
    const deletedQTY = book.orderQTY;
    this.setState({ books: this.state.books.filter(b => b.id !== book.id) });

    this.setState({ itemTotal: this.state.itemTotal - deletedQTY });
    this.setState({
      subtotal: this.state.books.reduce((acc, b) => acc + b.itemSubtotal, 0)
    });
  };

  handleSave = book => {
    this.setState({ saveForLater: this.state.saveForLater.concat(book) });

    this.handleDelete(book);

    this.renderSave();

    this.setState({
      subtotal: this.state.books.reduce((acc, b) => acc + b.itemSubtotal, 0)
    });
    this.forceUpdate();
  };

  renderSave() {
    if (this.state.saveForLater.length > 0) {
      return this.state.saveForLater.map(b => (
        <SaveForLater
          onIncrementSave={this.handleIncrementSave}
          onDecrementSave={this.handleDecrementSave}
          onDeleteSave={this.handleDeleteSave}
          onMoveToCart={this.handleMoveToCart}
          key={b.id}
          book={b}
        ></SaveForLater>
      ));
    }
  }

  renderSaveHeader() {
    if (this.state.saveForLater.length > 0) {
      return (
        <>
          <div style={margingStyleTop}>
            <h1 style={margingStyle}>Save for Later</h1>
          </div>
        </>
      );
    }
  }

  handleIncrementSave = book => {
    const saveForLater = [...this.state.saveForLater];
    const index = saveForLater.indexOf(book);
    saveForLater[index] = { ...book };
    saveForLater[index].orderQTY++;
    saveForLater[index].itemSubtotal =
      saveForLater[index].price * saveForLater[index].orderQTY;
    this.setState({ saveForLater });
  };

  handleDecrementSave = book => {
    const saveForLater = [...this.state.saveForLater];
    const index = saveForLater.indexOf(book);
    saveForLater[index] = { ...book };

    if (saveForLater[index].orderQTY - 1 <= 0) {
      // remove from cart
      this.setState({
        saveForLater: this.state.saveForLater.filter(b => b.id !== book.id)
      });
    } else {
      saveForLater[index].orderQTY--;
      saveForLater[index].itemSubtotal =
        saveForLater[index].price * saveForLater[index].orderQTY;
      this.setState({ saveForLater });
    }
  };

  handleDeleteSave = book => {
    this.setState({
      saveForLater: this.state.saveForLater.filter(b => b.id !== book.id)
    });
  };

  handleMoveToCart = book => {
    this.setState({ books: this.state.books.concat(book) });

    this.handleDeleteSave(book);
  };

  renderCarts() {
    if (this.state.books.reduce((acc, b) => acc + b.orderQTY, 0) <= 0) {
      return <div style={margingStyle}>Your cart is empty</div>;
    } else {
      return this.state.books.map(b => (
        <>
          <Cart
            onIncrement={this.handleIncrement}
            onDecrement={this.handleDecrement}
            onDelete={this.handleDelete}
            onSave={this.handleSave}
            key={b.id}
            book={b}
          ></Cart>
        </>
      ));
    }
  }

  renderBadge() {
    if (this.state.books.reduce((acc, b) => acc + b.orderQTY, 0) >= 0) {
      return this.state.books.reduce((acc, b) => acc + b.orderQTY, 0);
    }

    return 0;
  }

  renderSubtotal() {
    if (this.state.books.reduce((acc, b) => acc + b.itemSubtotal, 0) >= 0) {
      return this.state.books.reduce((acc, b) => acc + b.itemSubtotal, 0);
    }

    return 0;
  }

  renderOrderSummary() {
    if (this.state.books.reduce((acc, b) => acc + b.orderQTY, 0) > 0) {
      return (
        <div style={summaryOrderStyle}>
          <h1>Order Summary</h1>
          <div style={{ backgroundColor: "#f2f2f1" }}>
            <TableContainer>
              <Table aria-label="simple table" style={{ maxWidth: "100%" }}>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" style={cellStyle}>
                      <span>Subtotal </span>
                      <span>({this.renderBadge()} items)</span>
                    </TableCell>
                    <TableCell align="right" style={cellStyle}>
                      <NumberFormat
                        value={this.renderSubtotal()}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" style={cellStyle}>
                      <span>Estimated Shipping</span>
                    </TableCell>
                    <TableCell align="right" style={cellStyle}>
                      <span>Free</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" style={cellStyle}>
                      <span>Estimated Tax</span>
                    </TableCell>
                    <TableCell align="right" style={cellStyle}>
                      <span>$0.00</span>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="left" style={cellStyle}>
                      <h2>Order Total: </h2>
                    </TableCell>
                    <TableCell align="right" style={cellStyle}>
                      <h2>
                        <NumberFormat
                          value={this.renderSubtotal()}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </h2>
                    </TableCell>
                  </TableRow>
                  <TableRow></TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              style={{ height: "4em" }}
              onClick={() => this.props.onCheckout(this.state.books)}
            >
              Place Order
            </Button>
          </div>
        </div>
      );
    }
  }
  render() {
    return (
      <>
        <IconButton
          aria-label="cart"
          style={{ textAlign: "right", marginLeft: "50em" }}
        >
          <StyledBadge badgeContent={this.renderBadge()} color="secondary">
            <ShoppingCartIcon fontSize="large" />
          </StyledBadge>
        </IconButton>
        <div></div>
        <div>
          <TableContainer style={orderDetailStyle}>
            <Table aria-label="simple table" style={Tablestyle}>
              <TableBody>
                <TableRow>
                  <TableCell aligh="center" style={cellStyle}>
                    <div
                      style={{
                        padding: "0.5em",
                        marginLeft: "5em"
                      }}
                    >
                      <div>{this.renderCarts()}</div>
                      <div>{this.renderSaveHeader()}</div>
                      <div>{this.renderSave()}</div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div>{this.renderOrderSummary()}</div>
        </div>
      </>
    );
  }
}

export default CartList;