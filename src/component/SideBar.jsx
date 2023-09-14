import React from "react";

export default function SideBar() {
    return (
        // sidebar container
        <aside class="h-screen sticky top-0 w-32 bg-slate-100">

            {/* all icon elements container (icon block divided into 4 section and this will contain all 4)  */}
            <div className="flex flex-col items-center m-4">

                {/* 1 menu icon block  */}
                <div className="flex flex-col items-center ">
                    <img
                        src={require("../images/category_icon.png")}
                        alt="random stuff"
                        className="w-8 h-8 mb-16 mt-9"
                    />
                </div>

                {/* 4 elements icon block  */}
                <div className="flex flex-col items-center ">
                    <img
                        src={require("../images/cube.png")}
                        alt="random stuff"
                        className="w-8 h-8 my-3"
                    />
                    <img
                        src={require("../images/list.png")}
                        alt="random stuff"
                        className="w-8 h-8 my-3"
                    />
                    <img
                        src={require("../images/messenger.png")}
                        alt="random stuff"
                        className="w-8 h-8 my-3"
                    />
                    <img
                        src={require("../images/list.png")}
                        alt="random stuff"
                        className="w-8 h-8 mt-4 mb-16"
                    />
                </div>

                {/* 3 elements icon block  */}
                <div className="flex flex-col items-center ">
                    <img
                        src={require("../images/success.png")}
                        alt="random stuff"
                        className="w-8 h-8 my-3"
                    />
                    <img
                        src={require("../images/security.png")}
                        alt="random stuff"
                        className="w-8 h-8 my-3"
                    />
                    <img
                        src={require("../images/users.png")}
                        alt="random stuff"
                        className="w-8 h-8 my-3 mb-16"
                    />
                </div>

                {/* profile icon block  */}
                <div className="flex flex-col items-center ">
                    <img
                        src={require("../images/lachlan.jpg")}
                        alt="random stuff"
                        className="w-8 h-8 my-3 rounded-full"
                    />
                    <img
                        src={require("../images/raamin.jpg")}
                        alt="random stuff"
                        className="w-8 h-8 my-3 rounded-full"
                    />
                    <img
                        src={require("../images/nonamesontheway.jpg")}
                        alt="random stuff"
                        className="w-8 h-8 my-3 rounded-full"
                    />
                    <img
                        src={require("../images/plus.png")}
                        alt="random stuff"
                        className="w-8 h-8 my-3"
                    />
                </div>
            </div>
        </aside>
    );
}
