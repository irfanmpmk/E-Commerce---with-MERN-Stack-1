import React from "react";
import Layout from "../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="images/about.jpeg"
            alt="aboutus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">ABOUT US</h1>
          <p className="text-justify mt-2">
            any query and info about the products please feel free to contact us
            anytime 24x7 available
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
