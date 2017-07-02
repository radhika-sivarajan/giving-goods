var React = require("react");
var Link = require("react-router").Link;
var helpers = require("./../../utils/helper");
import AdminNavTab from "./AdminNavTab";
import ShelterNavTab from "./ShelterNavTab";
import MyProfile from "./admin/MyProfile";
import AddUser from "./admin/AddUser";
import ManageUsers from "./admin/ManageUsers";
import ShelterProfile from "./client/ShelterProfile";
import AddPeople from "./client/AddPeople";
import ManagePeople from "./client/ManagePeople";
import { browserHistory } from 'react-router';

var Profile = React.createClass({
    getInitialState: function () {
        return {
            loggedInUser: "",
            passwordMessage: ""
        }
    },
    componentDidMount: function () {
        helpers.default.getMyInfo().then(function (myInfo) {
            this.setState({ loggedInUser: myInfo.data });
        }.bind(this));
    },
    handleClick: function (event) {
        helpers.default.logoutUser();
    },
    handlePasswordChange: function (event) {
        var newState = {};
        newState[event.target.id] = event.target.value;
        this.setState(newState);
        if (newState.updateRepeatPassword) {
            if (newState.updateRepeatPassword !== this.state.updatePassword) {
                this.setState({ passwordMessage: " Password does NOT match" });
            } else if (newState.updateRepeatPassword === this.state.updatePassword) {
                this.setState({ passwordMessage: " Password match" });
            }
        }
    },
    handlePasswordSubmit: function (event) {
        event.preventDefault();
        if (this.state.updatePassword === this.state.updateRepeatPassword) {
            helpers.default.updateMyPassword({
                password: this.state.updatePassword
            }).then((user) => {
                if(!user.data){
                    this.setState({ passwordMessage: "Password NOT updated" });
                }else{
                    this.setState({ passwordMessage: "Password updated" });
                    window.location = "/profile";
                }
            });
        } else {
            this.setState({ passwordMessage: "Password NOT updated" });
        }
    },
    renderSettings: function () {
        return (
            <div className="dropdown">
                <button className="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-cog"></span> Settings
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    <li> <Link to="/home" onClick={this.handleClick}>Logout</Link></li>
                    <li> <Link data-toggle="modal" data-target="#my-password-edit">Change password</Link></li>
                </ul>
            </div>
        );
    },
    renderEditPasswordModal: function () {
        return (
            <div id="my-password-edit" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Change Password</h4>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.handlePasswordSubmit}>
                                <div className="form-group">
                                    <label htmlFor="updatePassword">New password</label>
                                    <input type="text" className="form-control" id="updatePassword" onChange={this.handlePasswordChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="updateRepeatPassword">Repeat password </label>
                                    <input type="text" className="form-control" id="updateRepeatPassword" onChange={this.handlePasswordChange} required />
                                    <small>{this.state.passwordMessage}</small>
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    renderWarning: function () {
        return (
            <div className="container">
                Please login
                <button><Link to="/shelter">Login</Link></button>
            </div>
        );
    },
    renderAdminPanel: function () {
        return (
            <div className="container" id="admin-container">
                {this.renderSettings()}
                {this.renderEditPasswordModal()}
                <AdminNavTab />
                <div className="tab-content">
                    <MyProfile myInfo={this.state.loggedInUser} />
                    <AddUser />
                    <ManageUsers myData={this.state.loggedInUser} />
                </div>
            </div>
        );
    },
    renderShelterPanel: function () {
        return (
            <div className="container" id="shelter-container">
                {this.renderSettings()}
                {this.renderEditPasswordModal()}
                <ShelterNavTab />
                <div className="tab-content">
                    <ShelterProfile shelterInfo={this.state.loggedInUser} />
                    <AddPeople />
                    <ManagePeople />
                </div>
            </div>
        );
    },
    render: function () {
        if (this.state.loggedInUser) {
            if (this.state.loggedInUser.privilege === 1 && this.state.loggedInUser.role === "admin") {
                return this.renderAdminPanel();
            } else if (this.state.loggedInUser.privilege === 2 && this.state.loggedInUser.role === "shelter") {
                return this.renderShelterPanel();
            }
        }
        else {
            return this.renderWarning();
        }
    }
});
module.exports = Profile;