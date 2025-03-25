class Selectors {
  getUserCartItems = (users) => {
    const hasCartItems =
      users &&
      users[0] &&
      users[0].data &&
      users[0].data.carts &&
      users[0].data.carts.length > 0;

    return hasCartItems ? users[0].data.carts : [];
  };
}
export const selectors = new Selectors();
