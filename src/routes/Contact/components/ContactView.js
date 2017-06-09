import React from "react";
export const ContactView = (props) => (
  <div className="site-contact">
    <div className="row">
      <div className="col-lg-6">
        {props.children}
      </div>
    </div>
  </div>
)
export default ContactView
