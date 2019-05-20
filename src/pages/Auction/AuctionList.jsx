import React from 'react';
import styled from "styled-components";
import { observer, inject } from 'mobx-react';
import Card from '../../components/DataDisplay/Card';
import Masonry from '../../components/DataDisplay/Masonry';
import { withRouter } from "react-router-dom";
import DropLoader from '../../components/Feedback/DropLoader';
import Banner from '../../components/DataDisplay/Banner';
import _ from 'lodash';

const Container = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const MasonryContainer = styled.div`
    padding: 100px 50px;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 1024px) {
        padding: 60px 30px;
    }
    @media (max-width: 764px) {
        padding: 40px 20px;
    }
    @media (max-width: 480px) {
        padding: 10px;
    }
`;
const LoaderContainer = styled.div`
    margin-top:60px;
`;

@inject(store => ({
    products:store.product.products,
    loadProducts:store.product.load,
    isFetching:store.product.isFetching,

    shouldLoad:store.scroll.shouldLoad
}))
@observer
class AuctionList extends React.Component {
    componentDidMount = () => {
        // TODO category items loading logic
        this.load();
    }
    
    componentWillReceiveProps(nextProps) {
        const { shouldLoad, isFetching } = this.props;
        if(nextProps.shouldLoad && !shouldLoad && !isFetching) {
            this.load();
        }
    }

    onClickItem = (data) => {
        const { history } = this.props;
        // history.push(`${DETAIL.route}?id=${data.id}`)
    }

    load = () => {
        const { loadProducts } = this.props;
        loadProducts();
    }

    render() {
        const { products, isFetching } = this.props;

        let cardViews = Object.keys(products).map((each, idx) => {
            const product = products[each];
            return (
                <Card 
                    key={idx} 
                    onClick={this.onClickItem.bind(this, product)} 
                    {..._.omit(product, 'price')}
                />
            )
        })

        return (
            <Container>
                <Banner
                    title={'Capstone art gallery'} 
                    subtitle={''}
                    image={'https://www.castlefineart.com/assets/img/resized/fullscreen/galleries-icc.jpg'}
                    style={{
                        justifyContent:'flex-end',
                        alignItems:'flex-start',
                    }}
                />
                {cardViews && cardViews.length > 0 &&
                    <MasonryContainer>
                        <Masonry views={cardViews}/>
                    </MasonryContainer>
                }
                <LoaderContainer>
                    <DropLoader loading={isFetching}/>
                </LoaderContainer>
            </Container>
        );
    }
}

AuctionList.defaultProps = {
};

export default withRouter(AuctionList);