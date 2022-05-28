import {useNavigate, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {Alert, AlertTitle} from "@mui/material";
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
import {deleteCookie} from "../services/CookiesService";
import {fetchAuction} from "../services/AuctionServices";

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
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (



        <Box sx={{  m: "30rem", marginTop: 15, marginBottom: 4, }}>

            <Box sx={{ m: 0, marginBottom: 5 }}>

                <Avatar
                    alt="Remy Sharp"
                    src={""}
                    sx={{ marginBottom: 3, width: 56, height: 56}}
                />

                <Typography variant="h5" gutterBottom component="div">
                    {auction.title}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                    Closes: {auction.endDate}
                </Typography>

                {errorFlag && <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}

            </Box>

            <img src="http://s" alt="Italian Trulli">

            <Box sx={{ m: 0, marginBottom: 5 }}>

                <Typography variant="button" gutterBottom component="div" sx={{ marginBottom: 1.5 }}>
                    MANAGE
                </Typography>

                <Button variant="contained"  sx={{ marginRight: 3 }}>My current bids</Button>
                <Button variant="outlined"  sx={{ marginRight: 3 }}>My current listings</Button>
                <Button variant="text" sx={{ marginRight: 3 }} onClick={handleEditUser}>Edit my info</Button>
                <Button variant="text" onClick={handleClickOpen}>
                    Log out
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Log out now?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please confirm that you would like to log out.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleLogOut} autoFocus>
                            Log me out
                        </Button>
                    </DialogActions>
                </Dialog>

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
        </Box>


    )
}

export default Auction;