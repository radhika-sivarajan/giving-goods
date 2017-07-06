var React = require("react");
var NotificationSystem = require("react-notification-system");
var helper = require("./../../utils/helper");

var ListPeople = React.createClass({
    _notificationSystem: null,
    getInitialState: function () {
        return {
            allPeopleList: [],
            currentPerson: [],
            currentPersonItems: [],
            contactCurrentShelter: null
        }
    },
    componentDidMount: function () {
        this._notificationSystem = this.refs.notificationSystem;
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({ allPeopleList: nextProps.peopleList });
    },
    handleChange: function (event) {
        var newState = {};
        newState[event.target.id] = event.target.value;
        this.setState(newState);
    },
    handleSubmit: function (event) {
        event.preventDefault();
        helper.default.contactShelter({
            donorEmail: this.state.donorEmail,
            donorSubject: this.state.donorSubject,
            donorMessage: this.state.donorMessage,
            shelterMail: this.state.contactCurrentShelter
        }).then((mailStatus) => {
            if (mailStatus.data) {
                this._notificationSystem.addNotification({
                    message: 'Mail sent',
                    level: 'success',
                    position: 'tr'
                });
            } else {
                this._notificationSystem.addNotification({
                    message: 'Mail NOT sent. Please try again later',
                    level: 'error',
                    position: 'tr'
                });
            }
        });
    },
    setPersonItems: function (person) {
        this.setState({ currentPerson: person });
        this.setState({ currentPersonItems: person.items });
    },
    contactShelter: function (shelter) {
        this.setState({ contactCurrentShelter: shelter.emailId });
    },
    renderPersonModal: function () {
        var itemRows = "";
        if (this.state.currentPersonItems.length !== 0) {
            itemRows = this.state.currentPersonItems.map((item, index) => {
                if (item.item_status === 0) {
                    return (
                        <tr key={index}>
                            <td>{item.item_name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.description}</td>
                        </tr>
                    );
                }
            });
        }
        return (
            <div id="personModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="text-capitalize modal-title">{this.state.currentPerson.person_first_name}</h4>
                            <p className="text-capitalize">{this.state.currentPerson.gender + ", " + this.state.currentPerson.age_group + " years old"}</p>
                        </div>
                        <div className="modal-body">
                            <p>{this.state.currentPerson.notes}</p><br/>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemRows}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-sm" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    renderContactShelterModal: function () {
        var shelterForm = "";
        if (this.state.contactCurrentShelter !== null) {
            shelterForm =
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="email" placeholder="Your Email Address" className="form-control" id="donorEmail" onChange={this.handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Subject" className="form-control" id="donorSubject" onChange={this.handleChange} required />
                    </div>
                    <div className="form-group">
                        <textarea className="form-control" rows="5" id="donorMessage" placeholder="Message to Shelter" onChange={this.handleChange} required ></textarea>
                    </div>
                    <button type="submit" className="btn btn-default btn-sm">Submit</button>
                </form>
        }
        return (
            <div id="contactModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Contact Shelter</h4>
                        </div>
                        <div className="modal-body">
                            {shelterForm}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    renderPeople: function () {
        if (this.state.allPeopleList.length !== 0) {
            return this.state.allPeopleList.map((person, index) => {
                if (person.items.length) {
                    return (
                        <div className="col-md-3 col-sm-4" key={index}>
                            <div className="people-block clearfix">
                                <p className="people-name capitalize-name"><b>{person.person_first_name}</b></p>
                                <p><b>Location: </b>{person.shelter_id.location}</p>
                                <p><b>Age: </b>{person.age_group}</p>
                                <p><b>Gender: </b>{person.gender}</p>
                                
                                <p><button type="button" className="btn btn-default btn-sm" data-toggle="modal" data-target="#personModal" onClick={this.setPersonItems.bind(this, person)}>More</button>
                                <button type="button" className="btn btn-default btn-sm" data-toggle="modal" data-target="#contactModal" onClick={this.contactShelter.bind(this, person.shelter_id)}>Contact Shelter</button></p>

                                <p><b>Bio: </b>{person.notes}</p>
                            </div>
                        </div>
                    );
                }
            });
        } else {
            return (
                <div >
                    No Results
                </div>
            );
        }
    },
    render: function () {
        return (
            <div>
                <NotificationSystem ref="notificationSystem" />
                {this.renderPeople()}
                {this.renderPersonModal()}
                {this.renderContactShelterModal()}
            </div>
        );
    }
});
module.exports = ListPeople;