import styled from "styled-components";
//import FittingViewer from "./CanvasSwipeableFittingViewer";
import FittingViewer from "./FittingViewer";

const Product = (props) => {
  return (
    <section>
      <Container className="product">
        <Container className="product-left">
          <FittingViewer />
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
    width: 50%;
    margin: auto;
    overflow: hidden;
  }
  &.product-left:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 100%;
  }
  @media screen and (max-width: 64rem) {
    &.product {
      display: block;
    }
    &.product-left {
      width: 100%;
    }
  }
`;
export default Product;
