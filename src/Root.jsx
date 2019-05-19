import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './pages/App';

class Root extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" component={App}/>
            </Router>
        );
    }
}

 export default Root;