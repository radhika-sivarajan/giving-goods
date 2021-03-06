var React = require("react");
var createReactClass = require("create-react-class");
var NotificationSystem = require('react-notification-system');
var helpers = require("./../../utils/helper");
import { browserHistory } from 'react-router';

var Login = createReactClass({
    _notificationSystem: null,
    componentDidMount: function () {
        this._notificationSystem = this.refs.notificationSystem;
    },
    handleChange: function (event) {
        var newState = {};
        newState[event.target.id] = event.target.value;
        this.setState(newState);
    },
    handleSubmit: function (event) {
        event.preventDefault();
        helpers.default.loginUser({
            username: this.state.username,
            password: this.state.password,
        }).then((user) => {
            if (!user) {
                this._notificationSystem.addNotification({
                    message: 'Incorrect Email/Password',
                    level: 'error',
                    position: 'tr'
                });
                browserHistory.push('/shelter');
            } else {
                browserHistory.push('/profile');
            }
        });
    },
    render: function () {
        return (
            <div className="row" id="login">
                <NotificationSystem ref="notificationSystem" />
                <div className="col-md-6 col-md-offset-3">
                    <h2>Login</h2>
                    <div className=" panel panel-default">
                        <div className="panel-body">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input type="text" placeholder="Email" className="form-control" id="username" onChange={this.handleChange} required />
                                </div>
                                <div className="form-group">
                                    <input type="password" placeholder="Password" className="form-control" id="password" onChange={this.handleChange} required />
                                </div>
                                <button type="submit" className="btn btn-default btn-sm button-signin">Sign In</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = Login;