import {useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {Alert, AlertTitle, TextField} from "@mui/material";
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
import {deleteCookie, isThereCookie} from "../services/CookiesService";
import {fetchAuction} from "../services/AuctionServices";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { styled } from '@mui/material/styles';
import CardMedia from "@mui/material/CardMedia";
import SendIcon from "@mui/icons-material/Send";

function createData(
    name: string,
    calories: number,
) {
    return { name, calories };
}

const rows = [
    createData('Win bids', 237),
    createData('Lost bids', 262),
    createData('Bidding', 305),
    createData('All listings', 356),
    createData('Current listings', 356),
];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
}));

const Auction = () => {
    const params = useParams();
    const id = params.id

    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

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
        handleLoadAuction().then((r) => {
            setAuction(r.data)

        })
    },  )

    const handleLoadAuction = async () => {
        if (id != null) {
            return await fetchAuction(id)
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
        if (isThereCookie()) {
            setOpen(true);
        } else {
            navigator('/login')
        }

    };

    const handleClose = () => {
        setOpen(false);
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

    return (

        <Container maxWidth="lg" sx={{marginTop: 15}}>

            <Grid container spacing={2}>

                <Grid item xs={7}>
                    <CardMedia
                        component="img"
                        sx={{
                            // 16:9

                            height: 410
                        }}
                        image={"http://localhost:4941/api/v1/auctions/"+ id +"/image"}
                        alt="random"
                    />

                    <Box sx={{ m: 0, marginTop: 5, marginBottom: 5 }}>

                        <Typography variant="button" gutterBottom component="div" sx={{ marginBottom: 1.5 }}>
                            DESCRIPTION
                        </Typography>

                        <Typography>
                            {auction.description}
                        </Typography>

                        <Typography variant="button" gutterBottom component="div" sx={{ marginTop: 5, marginBottom: 1.5 }}>
                            MANAGE
                        </Typography>

                        <Button variant="contained"  sx={{ marginRight: 3 }}>My current bids</Button>
                        <Button variant="outlined"  sx={{ marginRight: 3 }}>My current listings</Button>
                        <Button variant="text" sx={{ marginRight: 3 }} onClick={handleEditUser}>Edit my info</Button>
                        <Button variant="text" onClick={handleClickOpen}>
                            Log out
                        </Button>

                    </Box>




                    <Typography variant="button" gutterBottom component="div" sx={{ marginBottom: 1.5 }}>
                        STATISTICS
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 70 }} aria-label="simple table">
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>



                </Grid>

                <Grid item xs={5}>
                    <Box sx={{m: 3}}>
                        <Typography variant={"h5"} sx={{marginBottom: 3}}>{auction.title}</Typography>
                        <Alert severity="info" sx={{marginBottom: 3}}>Closes {displayEndDayOfWeek(auction.endDate)}, {displayEndDate(auction.endDate)}</Alert>

                        <Item >

                            <Typography variant={"h6"} align="center">Current bid</Typography>
                            <Typography variant={"h3"} align="center" sx={{marginBottom: 0}}>${displayHighestBid(auction.highestBid)}.00</Typography>

                            <Typography variant={"subtitle1"} align="center">5 bids - view history</Typography>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }} endIcon={<SendIcon/>}
                                onClick={handleClickOpen}
                            >
                                Place your bid
                            </Button>

                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {"Place my bid"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Enter the amount.
                                    </DialogContentText>

                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Email Address"
                                        type="email"
                                        fullWidth
                                        variant="standard"
                                    />

                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={handleLogOut} autoFocus>
                                        Log me out
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Typography align="center" variant={"subtitle2"} >Reserve not met</Typography>
                        </Item>

                        <Grid container spacing={1} sx={{ marginTop: 3}}>

                            <Grid item xs={2} >

                                <Avatar
                                    src={"http://localhost:4941/api/v1/users/" + auction.sellerId + "/image"}
                                    sx={{ marginBottom: 3, width: 56, height: 56}}
                                />

                            </Grid>

                            <Grid item xs={5}>
                                <Typography variant={"body2"} sx={{marginTop: 1, marginBottom: 0}}>Listed by</Typography>
                                <Typography>{auction.sellerFirstName} {auction.sellerLastName}</Typography>
                            </Grid>
                        </Grid>

                    </Box>






                </Grid>

            </Grid>





            <Box sx={{ m: 0, marginBottom: 5 }}>
                {errorFlag && <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}
            </Box>






        </Container>



    )
}

export default Auction;