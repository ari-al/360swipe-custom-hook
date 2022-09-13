import styled from "styled-components";
const ProductInfo = () => {
  return (
    <Container className="product-info">
      <Container className="head">
        <div className="product-code">1AAMM0</div>
        <div className="product-name">GOLD TWEED PEPLUM TOP</div>
      </Container>
      <Container className="button-area">
        <button className="purchase-button">Notify Me</button>
        <button className="locate-in-store-button">Find in Store</button>
      </Container>
      {/* <Container className="contact">
        For further inquiries on this piece, please contact our concierge
        service at concierge@contact.louisvuitton.com.
      </Container> */}
      <Container className="detail">Product details</Container>
    </Container>
  );
};
const Container = styled.div`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  margin: auto;
  max-width: 22.5rem;
  &.head {
    border-bottom: 1px solid #eae8e4;
    .product-code {
      font-size: 0.875rem;
      letter-spacing: 0.075rem;
      line-height: 1rem;
      font-weight: 500;
      color: inherit;
      margin: 0 0 0.5rem;
    }
    .product-name {
      font-size: 1.75rem;
      letter-spacing: 0;
      line-height: 2rem;
      color: inherit;
      text-transform: uppercase;
      font-weight: 500;
    }
  }
  &.button-area {
    width: 100%;
    font-size: 16px;
    button {
      padding: 1rem 1.5rem;
      width: 100%;
    }
    .purchase-button {
      background: black;
      color: white;
    }
    .locate-in-store-button {
      background: transparent;
      border: 1px solid black;
      margin: 0.5rem 0 1rem;
    }
  }
  &.contact {
    font-size: 14px;
    padding: 0;
  }
  &.detail {
    font-size: 1rem;
    letter-spacing: 0.025rem;
    line-height: 1.25rem;
    font-weight: 400;
    color: inherit;
  }

  @media screen and (max-width: 64rem) {
    max-width: unset;
    padding-top: unset;
    margin-bottom: 1rem;
    &.product-info {
      padding-top: 1rem;
      padding-left: 3.125vw;
      padding-right: 3.125vw;
    }
    &.detail {
      text-align: center;
      border-top: 1px solid #eae8e4;
      border-bottom: 1px solid #eae8e4;
      margin-top: -1px;
      padding: 1rem 1.5rem;
    }
  }
`;
ProductInfo.propTypes = {};

export default ProductInfo;
