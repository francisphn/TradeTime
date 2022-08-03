import {useNavigate} from "react-router-dom";
import React from "react";
import {deleteCookie, getCookie, isThereCookie} from "../services/CookiesService";
import {getUserAvatar, getUserFromBackend,} from "../services/UserAccountServices";
import Button from "@mui/material/Button";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Alert, AlertTitle} from "@mui/material";

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

const User = () => {

    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [userData, setUserData] = React.useState<userReturnWithEmail>({
        firstName: "",
        lastName: "",
        email: ""
    })

    const [userAvatar, setUserAvatar] = React.useState("")

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (!isThereCookie()) {
            navigator('/login')
        } else {

        }
        handleLoadUserDetails().then(r => {
            if (r.status === 404) {
                navigator('/login')
            }
            setUserData(r.data)
        })

        setUserAvatar("http://localhost:4941/api/v1/users/"+ getCookie('userId') + "/image")

    }, [userAvatar])

    const handleLoadUserDetails = async () => {
        return await getUserFromBackend()
    }



    const handleLogOut = () => {
        deleteCookie()
        navigator('/login')
    }

    const handleEditUser = () => {
        navigator('/users/edit')
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (

        <Box sx={{ m: 80, marginTop: 15, marginBottom: 4, }}>

            <Box sx={{ m: 0, marginBottom: 5 }}>

                <Avatar
                    alt="Remy Sharp"
                    src={userAvatar}
                    sx={{ marginBottom: 3, width: 56, height: 56}}
                />

                <Typography variant="h5" gutterBottom component="div">
                    Kia ora, {userData.firstName} {userData.lastName}!
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                    {userData.email}
                </Typography>

                {errorFlag && <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}

            </Box>

            <Box sx={{ m: 0, marginBottom: 5 }}>

                <Typography variant="button" gutterBottom component="div" sx={{ marginBottom: 1.5 }}>
                    MANAGE
                </Typography>
                <Button variant="outlined" href={"/auctions/create"} sx={{ marginRight: 3 }}>Create new auctions</Button>
                <Button variant="outlined" href={"/auctions/my"} sx={{ marginRight: 3 }}>My listings</Button>
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

    );


}

export default User;