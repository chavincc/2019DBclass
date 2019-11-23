import React, { Component } from 'react';

export default class TutorProfile extends Component {
  constructor() {
    super();
    this.state = {
      tutor: [],
      test: [],
      video: [],
      comment: []
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    fetch(`http://localhost:5000/api/tutor?id=${id}`)
      .then(value => value.json())
      .then(value => this.setState({ ...this.state, tutor: value[0] }));
    fetch(`http://localhost:5000/api/test?id=${id}`)
      .then(value => value.json())
      .then(value => this.setState({ ...this.state, test: value }));
    fetch(`http://localhost:5000/api/video?id=${id}`)
      .then(value => value.json())
      .then(value => this.setState({ ...this.state, video: value }));
    fetch(`http://localhost:5000/api/comment?id=${id}`)
      .then(value => value.json())
      .then(value => this.setState({ ...this.state, comment: value }));
  }

  getAge = date => {
    const d = new Date(date);
    const now = new Date();
    return now.getFullYear() - d.getFullYear();
  };

  render() {
    const { tutor } = this.state;
    return (
      <div className="tutor-profile-body">
        <div className="user-profile">
          <div className="card-header" id="profile-header">
            <h2>
              {tutor.FIRSTNAME} {tutor.LASTNAME}
            </h2>
          </div>
          <ul className="card-item" id="profile-item">
            <li>
              <i className="fas fa-phone"></i>
              <p>{tutor.PHONENUMBER}</p>
            </li>
            <li>
              <i className="fas fa-birthday-cake"></i>
              <p>{this.getAge(tutor.BIRTHDAY)} years old</p>
            </li>
            <li>
              <i className="fas fa-user"></i>
              <p>{tutor.BIO}</p>
            </li>
          </ul>
        </div>
        <div className="test-item-container">
          <div className="card-header">
            <h2>My Test Score</h2>
          </div>
          <ul className="card-item">
            {this.state.test.map(item => {
              return (
                <li className="test-item">
                  <h3>{item.TESTNAME}</h3>
                  <p>score: {item.SCORE}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="video-item-container">
          <div className="card-header ">
            <h2>My Video</h2>
          </div>
          <ul className="card-item">
            {this.state.video.map(item => {
              const videoLink = item.VIDEOHYPERLINK.substring(
                1,
                item.VIDEOHYPERLINK.length - 1
              );
              return (
                <li>
                  <a href={videoLink} target="_">
                    {videoLink}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="comment-item-container">
          <div className="card-header ">
            <h2>User's Comment About Me</h2>
          </div>
          <ul className="card-item">
            {this.state.comment.map(item => {
              const date = new Date(item.CREATETIME);
              return (
                <li className="comment-item">
                  <div className="comment-item-row">
                    {item.ISLIKED ? <i className="fas fa-thumbs-up"></i> : null}
                    <p className="comment-detail">{item.DETAIL}</p>
                  </div>
                  <p className="comment-date">{`${date.getDate()}/${date.getMonth() +
                    1}/${date.getFullYear()}`}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
