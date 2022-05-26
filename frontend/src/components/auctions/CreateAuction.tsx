import {useParams} from "react-router-dom";
import React from "react";
import axios from "axios";

const Auction = () => {

    const [auctionName, setAuctionName] = React.useState("")
    const [auctionPostDate, setAuctionPostDate] = React.useState("")
    const [auctionAuthor, setAuctionAuthor] = React.useState("")


    return (
        <h1>Create new auction</h1>
    )
}

export default Auction;