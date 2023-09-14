import React, {useState} from "react";
import Card from "./Card";
import HeroBanner from "./HeroBanner";
import SideBar from "./SideBar";

export default function HomePage({cards, setCards}) {

    const [newCard, setNewCard] = useState({});

    // capture input
    const onUserInput = (e) => {
        const {name, value} = e.target;
        setNewCard({...newCard, [name]: value});
        console.log(newCard);
    };

    // insert captured input into cards object
    const handleSubmit = () => {
        setCards([...cards, {id: cards.length + 1, ...newCard}]);
    };

    return (
        <div class="flex justify-between relative bg-white">

            {/* -> this is sidebar component */}
            <SideBar/>


            <main className="flex-8 h-screen w-8/12 mt-12">
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-4xl text-black">Good Night Team!</h1>
                        <label htmlFor="my-modal-4" className="btn btn-sm text-white font-bold"> ADD NEW TRIP </label>
                    </div>
                </div>
                {/*card can generate in area of full width and full height*/}
                <div className="w-full h-full">
                    {/*card component*/}
                    <Card cards={cards} setCards={setCards}/>
                </div>
            </main>

            {/*popup prompt for new trip when click on ADD NEW TRIP */}
            <input type="checkbox" id="my-modal-4" className="modal-toggle"/>
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
                <label className="modal-box relative bg-white" htmlFor="">
                    <div className="flex flex-col items-center m-0 p-0">
                        <label htmlFor="title" className="text-black font-bold my-2 w-11/12">Title</label>
                        <input name="title" type="text" placeholder="Type here"
                               className="input bg-white text-black input-bordered input-warning w-11/12"
                               onChange={onUserInput}/>
                        <label htmlFor="description" className="text-black font-bold my-2 w-11/12">Description</label>
                        <input name="description" type="text" placeholder="Type here"
                               className="input bg-white text-black input-bordered input-info w-11/12"
                               onChange={onUserInput}/>
                        <label htmlFor="peopleGoing" className="text-black font-bold my-2 w-11/12">People Going</label>
                        <input name="peopleGoing" type="number" placeholder="Type here"
                               className="input bg-white text-black input-bordered input-info w-11/12"
                               onChange={onUserInput}/>
                        <label htmlFor="status" className="text-black font-bold my-2 w-11/12">Title</label>
                        <select name="status" className="select select-bordered w-11/12 bg-white text-black"
                                onChange={onUserInput}>
                            <option disabled selected>--- Choose any option ---</option>
                            <option value="beach">Beach</option>
                            <option value="forest">Forest</option>
                            <option value="mountain">Mountain</option>
                        </select>
                        <button className="btn self-start mt-5 ml-5" onClick={handleSubmit}>Submit</button>
                    </div>
                </label>
            </label>
            {/*prompt ends here */}

            {/*banner on the right hand side */}
            <HeroBanner/>

        </div>
    );
}
