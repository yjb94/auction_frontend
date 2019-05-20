import React from 'react';
import styled from "styled-components";

const propTypes = {};

const defaultProps = {};

const Container = styled.div`
    display:flex;
`;

class AuctionList extends React.Component {
    render() {
        return (
            <Container>
                Hello
            </Container>
        );
    }
}

AuctionList.propTypes = propTypes;
AuctionList.defaultProps = defaultProps;

export default AuctionList