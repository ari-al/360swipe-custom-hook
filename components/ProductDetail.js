import styled from "styled-components";

const ProductDetail = () => {
  return (
    <>
      <Container>
        <Container className="intro">
          <pre></pre>
        </Container>
      </Container>
    </>
  );
};
const Container = styled.section`
  &.intro {
    font-size: 1.125rem;
    letter-spacing: 0.025rem;
    line-height: 1.5rem;
    font-weight: 300;
    padding: 0 8.3333333333%;
    padding-top: 5rem;
    padding-bottom: 5rem;
    width: 66.6666666667%;
  }

  @media screen and (max-width: 64rem) {
    &.intro {
      padding-top: 2.5rem;
      padding-left: 6.4vw;
      padding-right: 6.4vw;
      width: 100%;
      font-size: 1rem;
    }
  }
`;

export default ProductDetail;
