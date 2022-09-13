import styled from "styled-components";

const ProductDetail = () => {
  return (
    <>
      <Container>
        <Container className="intro">
          <p>
            Extravagant and elegant in equal parts, this peplum top is crafted
            in the runway’s most striking silhouette comprising a chic fitted
            body trimmed with a sculptural insert around the waist. The lustrous
            look of the richly textured gold tweed is complemented by the
            collection’s playfully scaled-up pearly buttons. A statement style
            in every sense.
          </p>
        </Container>
        <Container className="otherview">
          <div>
            <img srcset="https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-gold-tweed-peplum-top-ready-to-wear--FNTO78RH3450_PM2_Front%20view.png?wid=2048&hei=2048" />
          </div>
          <div>
            <img srcset="https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-gold-tweed-peplum-top-ready-to-wear--FNTO78RH3450_PM1_Cropped%20view.jpg?wid=2048" />
          </div>
        </Container>
        <Container className="detail-description">
          <div className="title">Product details</div>
          <div>
            <ul>
              <li>Main Material : 59% Polyamide, 41% Metallized Polyester</li>
              <li>Gold</li>
              <li>Regular fit</li>
              <li>Model wears size 36</li>
              <li>
                Model measurements : Bust 30'' / 76 cm, Height 5' 10" / 176 cm,
                Waist 23,2" / 59 cm, Hips 34'' / 86 cm
              </li>
              <li>Made in Italy</li>
            </ul>
          </div>
        </Container>
        <Container className="immersion">
          <div>
            <img srcset="https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-gold-tweed-peplum-top-ready-to-wear--FNTO78RH3450_PM1_Cropped%20worn%20view.png?wid=1240&hei=1240" />
          </div>
          <div>
            <img srcset="https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-gold-tweed-peplum-top-ready-to-wear--FNTO78RH3450_PM1_Ambiance%20view.png?wid=1240&hei=1240" />
          </div>
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
    width: 66.6666666667%;
  }
  &.otherview {
    margin-top: 5rem;
    padding: 0 8.3333333333vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
    column-gap: 2rem;
    img {
      width: 100%;
    }
  }
  &.detail-description {
    max-width: 60%;
    padding: 0 8.3333333333vw;
    .title {
      border-bottom: 1px solid #e1dfd8;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      font-size: 1.125rem;
      letter-spacing: 0.025rem;
      line-height: 1.25rem;
      font-weight: 500;
    }
    ul {
      column-count: 2;
      li {
        list-style: disc inside;
      }
    }
  }
  &.immersion {
    margin-top: 5rem;
    margin-bottom: 3rem;

    padding: 0.25rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
    column-gap: 0.25rem;
    img {
      width: 100%;
    }
  }

  @media screen and (max-width: 64rem) {
    &.intro {
      padding-top: 2.5rem;
      padding-left: 6.4vw;
      padding-right: 6.4vw;
      width: 100%;
      font-size: 1rem;
    }
    &.otherview {
      padding: 0;
      grid-template-columns: 1fr;
      & > div:nth-child(1) {
        display: none;
      }
      img {
        width: 100%;
      }
    }
    &.detail-description {
      margin-top: 2rem;
      max-width: 100%;
      padding-left: 6.4vw;
      padding-right: 6.4vw;
      .title {
        border-bottom: none;
      }
      ul {
        column-count: 1;
        li {
        }
      }
    }
    &.immersion {
      grid-template-columns: 1fr;
      img {
        width: 100%;
      }
    }
  }
`;

export default ProductDetail;
