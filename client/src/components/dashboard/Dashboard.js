import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import {Link} from 'react-router-dom';

class Dashboard extends Component {
  componentDidMount(){
    this.props.getCurrentProfile();
  }
  render() {
    const {user} = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if(profile === null || loading){
      dashboardContent = <Spinner />
    }else{
      //check if logged in user has profile
      if(Object.keys(profile).length > 0){
        dashboardContent = <h4>TODO: Display Profile</h4>
      }else{
        //user is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p className="lead">You have not setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">Create Profile</Link>
          </div>
        );
      }
    } 

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">
              {dashboardContent}
            </h1>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { getCurrentProfile }) (Dashboard);