import styled from "styled-components";
import ProductInfo from "./ProductInfo";
import FittingViewerSwipeable from "./FittingViewerSwipeable";

const Product = (props) => {
  return (
    <section>
      <Container className="product">
        <Container className="product-left">
          <FittingViewerSwipeable />
        </Container>
        <Container className="product-right">
          <ProductInfo />
        </Container>
      </Container>
    </section>
  );
};
const Container = styled.div`
  &.product {
    width: 100%;
    display: flex;
    background-color: #f6f5f3;
    flex-flow: row wrap;
    align-items: center;
  }
  &.product-left {
    position: relative;
    flex: 1 0 0;
  }
  &.product-left:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 100%;
  }
  &.product-right {
    flex: 1 0 0;
  }
  @media screen and (max-width: 64rem) {
    &.product {
      display: block;
    }
    &.product-right {
      background: white;
    }
  }
`;
export default Product;
