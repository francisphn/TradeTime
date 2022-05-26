import * as React from 'react';
import fetchAllAuctions from "../services/AuctionService";
import axios from "axios";

export default function CreateAuction() {

    const [auctions, setAuctions] = React.useState<Array<baseAuction>>([])

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const getAuctions = () => {
            axios.get('http://localhost:4941/api/v1/auctions')
                .then(response => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuctions(response.data)
                    console.log(auctions)
                }, error => {
                    setErrorFlag(true)
                    setErrorMessage(error.statusText)
                    //console.log(error.statusText)
                })
        }

        getAuctions()

    }, [setAuctions])

    return (
        <div>
            {!errorFlag}
            <h1>Haha</h1>
        </div>

    )
}