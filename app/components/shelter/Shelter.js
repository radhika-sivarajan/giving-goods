var React = require("react");
var createReactClass = require("create-react-class");
var helpers = require("./../../utils/helper");
import Login from "./Login";
import { browserHistory } from 'react-router';

var Shelter = createReactClass({
    getInitialState: function () {
        return {
            ifLoggedIn: undefined
        }
    },
    componentDidMount: function () {
        helpers.default.getMyInfo().then(function (userInfo) {
            if (userInfo.data) {
                this.setState({ ifLoggedIn: true });
                browserHistory.push('/profile');
            } else {
                this.setState({ ifLoggedIn: false });
            }
        }.bind(this));
    },
    render: function () {
        return (
            <div className="container" id="login-container">
                <Login />
            </div>
        );
    }
});
module.exports = Shelter;