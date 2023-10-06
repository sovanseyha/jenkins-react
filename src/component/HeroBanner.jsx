import React from "react";

export default function HeroBanner() {
  return (
    // aside is a main container and background image
    <aside
      class="h-screen sticky top-0 flex-9 bg-no-repeat bg-cover w-80 "
      id="grid_three"
    >
      {/* content container  */}
      <div className="flex flex-col pr-6 pt-5">
        {/* item  */}
        <div className="flex justify-end">
          <img
            src={require("../images/notification.png")}
            alt="random stuff"
            className="w-8 h-8 mx-3"
          />
          <img
            src={require("../images/comment.png")}
            alt="random stuff"
            className="w-8 h-8 mx-3"
          />
          <img
            src={require("../images/lachlan.jpg")}
            alt="random stuff"
            className="w-8 h-8 mx-3 rounded-full"
          />
        </div>

        {/* item  */}
        <div className="flex justify-end pr-2 mt-4">
          <button className="bg-yellow-200 text-base text text-center rounded-md font-medium w-32 h-10 ">
            My amazing trip
          </button>
        </div>

        {/* item  */}
        <div className="flex justify-end pl-3 mt-4">
          <p className="text-white font-normal text-2xl">
            I like laying down on the sand and look at the moon. i love you hahahha
          </p>
        </div>

        {/* item  */}
        <div className="flex flex-col px-3 mt-16">
          <p className="text-white ">27 people are going to this trip</p>

          {/* profile image row  */}
          <div className="flex items-start mt-2">
            <img
              src={require("../images/lachlan.jpg")}
              alt="random stuff"
              className="w-10 h-10 mr-3 rounded-full"
            />
            <img
              src={require("../images/lachlan.jpg")}
              alt="random stuff"
              className="w-10 h-10 mx-2 rounded-full border-2 border-white"
            />
            <img
              src={require("../images/lachlan.jpg")}
              alt="random stuff"
              className="w-10 h-10 mx-2 rounded-full border-2 border-red-600"
            />
            <img
              src={require("../images/lachlan.jpg")}
              alt="random stuff"
              className="w-10 h-10 mx-2 rounded-full border-2 border-white"
            />
            <p className="w-10 h-10 mx-2 text-md pt-1 pl-1 bg-orange-200 text-orange-900 rounded-full border-2 border-dotted border-orange-400">
                23+
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
