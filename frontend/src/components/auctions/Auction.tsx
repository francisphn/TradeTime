import {useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {Alert, AlertTitle, Breadcrumbs, InputAdornment, SelectChangeEvent, TableHead, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {deleteCookie, getCookie, isThereCookie} from "../services/CookiesService";
import {
    fetchAllAuctions,
    fetchAllCategories,
    fetchAuction,
    fetchAuctionHistory,
    userBidAuction
} from "../services/AuctionServices";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { styled } from '@mui/material/styles';
import CardMedia from "@mui/material/CardMedia";
import SendIcon from "@mui/icons-material/Send";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

function createData(
    amount: number,
    name: string,
    timestamp:string
) {
    return { amount, name, timestamp };
}



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
}));


const Auction = () => {
    const params = useParams();
    const id = params.id

    const navigator = useNavigate()

    const [bids, setBids] = React.useState<Array<bid>>([
        {
            bidderId: 0,
            firstName: "",
            lastName: "",
            timestamp: "",
            amount: 0

        }
    ])

    const [categories, setCategories] = React.useState<Array<category>>([])

    const [auctions, setAuctions] = React.useState<Array<auction>>([])

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [hasAuctionClosedFlag, setHasAuctionClosedFlag] = React.useState(false)

    const [bidStatusFlag, setBidStatusFlag] = React.useState(false)
    const [bidStatusMessage, setBidStatusMessage] = React.useState("")

    const [auction, setAuction] = React.useState<auctions>({
        categoryId: 0,
        description: "",
        endDate: "",
        highestBid: 0,
        numBids: 0,
        reserve: 0,
        sellerFirstName: "",
        sellerId: 0,
        sellerLastName: "",
        auctionId: 0,
        title: ""
    })

    const [open, setOpen] = React.useState(false);




    React.useEffect(() => {

        const getCategoriesMe = getCategories().then(r => {
            setCategories(r.data)

        })

        handleLoadAuction().then((r) => {
            setAuction(r.data)
        })

        handleLoadAuctionHistory().then((r) => {
            setBids(r.data)

        })

        getAuctions().then(r => {
            setAuctions(r.data.auctions)
        })

    }, [open])

    const getAuctions = async () => {
        return await fetchAllAuctions();
    }

    const getCategories = async () => {
        return await fetchAllCategories();
    }

    const checkIfSeller = () => {
        if (getCookie("userId") === auction.sellerId.toString()) {
            return true
        }
        return false
    }

    const checkCurrent = () => {
        const today = new Date();
        const auctionExpirationDay = new Date(auction.endDate)
        console.log(today)
        console.log(auctionExpirationDay)
        console.log(today > auctionExpirationDay)
        if (today > auctionExpirationDay) {
            return false
        }
        return true
    }

    const createRows = (data: Array<bid>) => {
        let myRows = [createData(0, "Listings created", "")]

        data.map((bid) => {
            myRows.push(createData(bid.amount, (bid.firstName + " " + bid.lastName), (displayEndDayOfWeek(bid.timestamp) + " " + displayEndDate(bid.timestamp))))
        })

        if (myRows.length > 1) {
            myRows.shift()
        }

        return myRows
    }

    const handleLoadAuction = async () => {
        if (id != null) {
            const response = await fetchAuction(id)
            if (response.status === 404) {
                setErrorFlag(true)
                setErrorMessage("This auction listing does not exist, or has been removed.")
            }
            return response
        }
    }

    const handleLoadAuctionHistory = async () => {
        if (id != null) {
            return await fetchAuctionHistory(id)
        }
    }

    const handleLogOut = () => {
        deleteCookie()
        navigator('/login')
    }

    const handleEditUser = () => {
        navigator('/user/edit')
    }

    const handleClickOpen = () => {
            setOpen(true);
    };

    const handleClose = () => {

        setOpen(false)
        setBidStatusFlag(false)

    };

    const displayEndDate = (endDate: string) => {
        let options = { year: "numeric", month: "long", day: "numeric" } as const;
        return new Date(endDate).toLocaleDateString("en-NZ", options)
    }

    const displayEndDayOfWeek = (endDate: string) => {
        const number = new Date(endDate).getDay()
        let day = "";
        switch (number) {
            case 0:
                day = "Sunday";
                break;
            case 1:
                day = "Monday";
                break;
            case 2:
                day = "Tuesday";
                break;
            case 3:
                day = "Wednesday";
                break;
            case 4:
                day = "Thursday";
                break;
            case 5:
                day = "Friday";
                break;
            case 6:
                day = "Saturday";
        }
        return day;
    }

    const displayHighestBid = (bid: number) => {
        if (bid === 0 || bid === null) {
            return "0"
        } else {
            return bid
        }
    }

    const displayReserveMet = () => {
        if (auction.reserve <= auction.highestBid) {
            return "Reserve met"
        } else {
            return "Reserve not met"
        }
    }

    const handleSubmitBid = async(event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        const data = new FormData(event.currentTarget)

        const bidAmountInput = data.get('amount')

        if (bidAmountInput != null) {

            const bidAmount = parseInt(bidAmountInput.toString())

            console.log(bidAmount)

            if (isNaN(bidAmount)) {
                setBidStatusFlag(true)
                setBidStatusMessage("Invalid bid amount!")
            } else if (bidAmount > auction.highestBid) {
                const response = await userBidAuction(auction.auctionId.toString(), bidAmount)

                if (response.status === 201) {
                    setOpen(false)
                } else {
                    setBidStatusFlag(true)
                    setBidStatusMessage(response.statusText)
                }

            } else {
                setBidStatusFlag(true)
                setBidStatusMessage("Your bid must be higher than the current bid!")
            }
        }



    }

    const displayNumBids = () => {
        const numBid = auction.numBids
        if (numBid === 0) {
            return "No bids"
        } else if (numBid === 1) {
            return "1 bid"
        } else {
            return numBid.toString() + " bids"
        }
    }

    const relevantAuctions = () => {
        let myAuctions: auction[] = [];
        (auctions.map(auctional => {
            if (auctional.sellerId === auction.sellerId) {
                myAuctions.push(auctional)
            } else if (auctional.categoryId === auction.categoryId) {
                myAuctions.push(auctional)
            }
        }));
        return myAuctions
    }

    return (

        <Container maxWidth="lg" sx={{marginTop: 9}}>

            {errorFlag &&

                <div>
                    <Alert severity="error">
                        <AlertTitle>Uh oh...</AlertTitle>
                        <Typography>{errorMessage}</Typography>
                    </Alert>

                </div>

            }

            {!errorFlag &&

                <>

                <Grid container spacing={2}>



                    <Grid item xs={7}>
                        <CardMedia
                            component="img"
                            sx={{
                                // 16:9
                                height: 410
                            }}
                            image={"http://localhost:4941/api/v1/auctions/" + id + "/image"}
                            alt="random"/>

                        <Box sx={{m: 0, marginTop: 5, marginBottom: 5}}>

                            <Typography variant="button" gutterBottom component="div" sx={{marginBottom: 1.5}}>
                                DESCRIPTION
                            </Typography>

                            <Typography>
                                {auction.description}
                            </Typography>



                        </Box>


                        <Typography variant="button" gutterBottom component="div" sx={{marginBottom: 1.5}}>
                            BID HISTORY
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>From</TableCell>
                                        <TableCell align="right">Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {createRows(bids).map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                ${row.amount}
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell align="right">{row.timestamp}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                    </Grid>

                    <Grid item xs={5}>
                        <Box sx={{m: 3}}>
                            <Typography variant={"h5"} sx={{marginBottom: 3}}>{auction.title}</Typography>
                            {!(checkCurrent()) &&
                                <><Alert severity="success" sx={{marginBottom: 3}}>Closed on {displayEndDayOfWeek(auction.endDate)}, {displayEndDate(auction.endDate)}</Alert>

                            </>}

                            {checkCurrent() &&
                                <><Alert severity="info" sx={{marginBottom: 3}}>Closes: {displayEndDayOfWeek(auction.endDate)}, {displayEndDate(auction.endDate)}</Alert>

                                </>}
                            <Item>
                                <Typography variant={"h6"} align="center">Highest bid</Typography>
                                <Typography variant={"h3"} align="center"
                                            sx={{marginBottom: 0}}>${displayHighestBid(auction.highestBid)}</Typography>

                                <Typography variant={"subtitle1"} align="center">{displayNumBids()}</Typography>

                                {checkCurrent() && !checkIfSeller() &&

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{mt: 2, mb: 2}} endIcon={<SendIcon/>}
                                        onClick={handleClickOpen}

                                    >
                                        Place your bid
                                    </Button>

                                }

                                {checkCurrent() && checkIfSeller() &&

                                    <>
                                        <Grid container spacing={2} sx={{marginTop: 2, mb: 4}}>

                                            <Grid item xs={6}>

                                                <Button fullWidth variant="contained" sx={{marginRight: 3}} href={"/auctions/" + auction.auctionId + "/edit/"}>Edit listing</Button>

                                            </Grid>

                                            <Grid item xs={6}>
                                                <Button fullWidth variant="outlined" sx={{marginRight: 0}}>Accept highest bid</Button>

                                            </Grid>



                                        </Grid>

                                    </>

                                }

                                {!(checkCurrent()) &&

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{mt: 2, mb: 2}} endIcon={<SendIcon/>}
                                        onClick={handleClickOpen}
                                        disabled
                                    >
                                        Place my bid
                                    </Button>

                                }

                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        {"Place my bid"}
                                    </DialogTitle>
                                    {isThereCookie() &&

                                        <><DialogContent>

                                            <Box component="form" noValidate onSubmit={handleSubmitBid}>

                                                <TextField
                                                    autoFocus
                                                    name="amount"
                                                    margin="dense"
                                                    id="amount"
                                                    label="Your bid amount"
                                                    type="text"
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                    }}
                                                    variant="outlined"/>

                                                <DialogContentText id="alert-dialog-description">

                                                    {bidStatusFlag && <Alert severity="error" sx={{marginTop: 1}}>
                                                        {bidStatusMessage}
                                                    </Alert>}

                                                    <Alert severity="info" sx={{marginTop: 1}}>
                                                        Please remember that bids cannot be withdrawn. Once you've placed your bid and are the successful bidder, you must complete the transaction.

                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            sx={{ mt: 1.5, mb: 0.5}}

                                                        >
                                                            Submit bid
                                                        </Button>

                                                        <Button variant="outlined" onClick={handleClose} sx={{ mt: 1.5, mb: 0.5, ml: 2}}>Cancel</Button>

                                                    </Alert>



                                                </DialogContentText>

                                            </Box>






                                        </DialogContent><DialogActions>

                                        </DialogActions></>
                                    }

                                    {!isThereCookie() &&
                                        <><DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                You need to log in, or create an account to start bidding on this listing.
                                            </DialogContentText>


                                        </DialogContent><DialogActions>
                                            <Button onClick={handleClose}>Cancel</Button>
                                            <Button onClick={handleClose}>Sign up</Button>
                                            <Button onClick={handleLogOut} autoFocus>
                                                Log in
                                            </Button>
                                        </DialogActions></>}

                                </Dialog>

                                <Typography align="center" variant={"subtitle2"}>{displayReserveMet()}</Typography>
                            </Item>

                            <Paper>

                                <Grid container spacing={1} sx={{marginTop: 3, padding: 2}}>


                                    <Grid item xs={2}>

                                        <Avatar
                                            src={"http://localhost:4941/api/v1/users/" + auction.sellerId + "/image"}
                                            sx={{marginTop: -1, width: 56, height: 56}}/>

                                    </Grid>

                                    <Grid item xs={5}>
                                        <Typography variant={"body2"} sx={{ marginBottom: 0}}>Listed
                                            by</Typography>
                                        <Typography>{auction.sellerFirstName} {auction.sellerLastName}</Typography>
                                    </Grid>


                                </Grid>
                            </Paper>





                        </Box>


                    </Grid>

                </Grid><Box sx={{m: 0, marginBottom: 5}}>
                    {errorFlag && <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
                </Box></>


            }

            <Typography variant="button" gutterBottom component="div" sx={{marginBottom: 1.5}}>
                Relevant other auctions
            </Typography>

            <Grid container spacing={4} sx={{mb: 5}}>



                {relevantAuctions().map((auction) => (
                    <Grid item key={auction.auctionId} xs={5} sm={6} md={4}>
                        <Card
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    // 16:9
                                    width: 390,
                                    height: 200
                                }}
                                image={"http://localhost:4941/api/v1/auctions/" + auction.auctionId + "/image"}
                                alt="random"
                            />
                            <CardContent sx={{ flexGrow: 1 }}>

                                <Typography gutterBottom variant="overline" component="h2">
                                    {categories[auction.categoryId-1].name}
                                </Typography>

                                <Typography gutterBottom variant="h6" component="h2">
                                    {auction.title}
                                </Typography>
                                <Typography variant="subtitle2">
                                    Listed by {auction.sellerFirstName} {auction.sellerLastName}

                                </Typography>

                                <Typography variant="subtitle2">
                                    Reserve: {auction.reserve} - Highest bid: ${auction.highestBid === null && "0"}{auction.highestBid != null && auction.highestBid}

                                </Typography>


                            </CardContent>
                            <CardActions>
                                <Button size="small" href={"/auctions/" + auction.auctionId}>View</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </Container>



    )
}

export default Auction;