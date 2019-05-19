import React from 'react';
import styled from "styled-components";

const propTypes = {};

const defaultProps = {};

const Container = styled.div`
    display:flex;
`;

export default class Home extends React.Component {
    render() {
        return (
            <Container>
                Hello
            </Container>
        );
    }
}

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;