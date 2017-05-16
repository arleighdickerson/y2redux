import React from "react";
import "./HomeView.scss";

export const HomeView = (props) => {
  return (
    <div className="site-index">

      <div className="jumbotron">
        <h1>Congratulations!</h1>
        <p className="lead">You have successfully bootstrapped the application.</p>
        <p><a className="btn btn-lg btn-primary-outline" href="http://arleighdickerson.us">Hire me for side work</a></p>
      </div>

      <div className="body-content">

        <div className="row">
          <div className="col-lg-4">
            <h2>Heading</h2>

            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur.</p>

            <p><a className="btn btn-default" href="http://arleighdickerson.us">Arls was here</a></p>
          </div>
          <div className="col-lg-4">
            <h2>Heading</h2>

            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur.</p>

            <p><a className="btn btn-default" href="http://arleighdickerson.us">and here</a></p>
          </div>
          <div className="col-lg-4">
            <h2>Heading</h2>

            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur.</p>

            <p><a className="btn btn-default" href="http://arleighdickerson.us">here too</a></p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomeView
