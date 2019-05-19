import React from 'react';
import styled from "styled-components";
import { observer, inject } from 'mobx-react';
import { getQueryParameter } from '../../utils/utils';
import DropLoader from '../../components/Feedback/DropLoader';

const Container = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`;
const DetailContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`;

@inject(store => {
    const pid = getQueryParameter('id');

    return {
        product:store.product.products[pid],
        getProduct:store.product.get,
    }
})
@observer
class Detail extends React.Component {
    componentDidMount = () => {
        const { product, getProduct } = this.props;
        if(!product) {
            const pid = getQueryParameter('id');
            getProduct(pid);
        }
    }

    renderDetail = () => {
        const { product } = this.props;
        console.log(product);
        
        return (
            <DetailContainer>

            </DetailContainer>
        )
    }

    render() {
        const { product } = this.props;

        const details = product ? this.renderDetail() : <DropLoader loading={true}/>

        return (
            <Container>
                {details}
            </Container>
        );
    }
}

Detail.defaultProps = {
};

export default Detail;