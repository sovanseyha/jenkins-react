import React, {useState} from "react";

export default function Card({cards, setCards}) {

    // logic for changing status
    const changeStatus = (id) => {
        const change = cards.map(card => {
                if (card.id === id) {
                    return {
                        ...card,
                        status: (card.status = card.status === "beach" ? "mountain" : card.status === "mountain" ? "forest" : "beach")
                    }
                }
                return card;
            }
        )
        setCards(change)
    }

    const [setShowDetail] = useState({});

    // logic for show details
    const handleShowDetail = (detail) => {
        setShowDetail(detail);
    }

    return (
        // this divided cards into 3 column. gap setting for size of the width size of the box
        <div className="grid grid-cols-3 gap-x-20">
            {cards.map((data) => (
                // card container
                <div className="bg-cyan-800  h-auto rounded-lg my-5 text-white">
                    <div className="p-5 ">
                        <h1 className="font-bold text-2xl py-1 uppercase ">{data.title}</h1>
                        <p className="line-clamp-3 py-1">{data.description}</p>
                        <p className="pt-1">People Going</p>
                        <p className="pb-4 font-bold text-xl">{data.peopleGoing}</p>
                        <button
                            className={data.status === "beach" ? "bg-blue-500 w-32 h-10 rounded-xl mr-5 uppercase" : data.status === "mountain" ? "bg-red-500 w-32 h-10 rounded-xl mr-5 uppercase" : "bg-green-500 w-32 h-10 rounded-xl mr-5 uppercase"}
                            onClick={() => changeStatus(data.id)}>{data.status}</button>
                        <label for={`${data.id}`} className="btn"
                               onClick={() => handleShowDetail(data)}>READ DETAILS</label>

                            {/*on click READ DETAILS will show up. -> info popup box*/}
                        <input type="checkbox" id={`${data.id}`} className="modal-toggle bg-white text-black"/>
                        <div className="modal">
                            <div className="modal-box relative">
                                <label for={`${data.id}`}
                                       className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                                <h3 className="text-lg text-black uppercase font-bold">{data.title}</h3>
                                <p className="py-4 text-black">{data.description}</p>
                                <p className="py-4 text-black">Around {data.peopleGoing} people going there</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
