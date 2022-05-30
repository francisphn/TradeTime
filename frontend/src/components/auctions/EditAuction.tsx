import {useParams} from "react-router-dom";
import axios from "axios";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {Alert, AlertTitle, FormControl, InputAdornment, InputLabel, Select, SelectChangeEvent} from "@mui/material";
import {useNavigate} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import {getCookie, isThereCookie} from "../services/CookiesService";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    fetchAllCategories,
    fetchAuction,
    userCreateAuction, userDeleteListing,
    userPatchAuction,
    userUploadImageAuction
} from "../services/AuctionServices";
import CardMedia from "@mui/material/CardMedia";

const theme = createTheme()

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
}));

const Input = styled('input')({
    display: 'none',
});

export default function EditAuction() {

    const params = useParams();
    const id = params.id


    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [errorAuthorisationFlag, setErrorAuthorisationFlag] = React.useState(false)
    const [errorAuthorisationMessage, setErrorAuthorisationMessage] = React.useState("")

    const [imageFile, setImageFile] = React.useState()
    const [isFilePicked, setIsFilePicked] = React.useState(false)

    const [preview, setPreview] = React.useState("")


    const [categories, setCategories] = React.useState<Array<category>>([
        {
            categoryId: 0,
            name: ""
        }
    ])

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

    React.useEffect(() => {

        getCategories().then(r => {
            setCategories(r.data)
        })



        if (!isThereCookie()) {
            navigator('/login')
        }

        handleLoadAuction().then((r) => {

            setAuction(r.data)

            checkIfSeller()
            checkIfBiddingStarted()
        })

        setChosenCategoryId(auction.categoryId.toString())

        if (!imageFile) {
            if (!userManuallyRemovePhoto) {
                setPreview("http://localhost:4941/api/v1/auctions/" + auction.auctionId.toString() + "/image/")

            }
            return
        } else {

        }




        const objectUrl = URL.createObjectURL(imageFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)


    }, [imageFile, auction])

    const checkIfBiddingStarted = () => {
        if (auction.numBids > 0) {
            setErrorAuthorisationFlag(true)
            setErrorAuthorisationMessage("Bidding has started, so you can't edit this listing.")
        }
    }

    const checkIfSeller = () => {
        if (getCookie("userId") === auction.sellerId.toString()) {
            setErrorAuthorisationFlag(false)
            setErrorAuthorisationMessage("")
        } else {
            setErrorAuthorisationFlag(true)
            setErrorAuthorisationMessage("You're unable to edit this listing.")
        }
    }

    const getCategories = async () => {
        return await fetchAllCategories();
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


    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const title = data.get('title')
        const category = chosenCategoryId
        const description = data.get('description')
        const endDate = data.get('expiration')
        const reserve = data.get('amount')

        console.log(category)
        console.log(title, description, endDate, reserve)

        if (title === null || category === null || description === null || reserve === null || endDate === null) {
            setErrorFlag(true)
            setErrorMessage("One of the fields is blank!")
        } else if (title === "" || category === "" || description === "" || endDate === "") {
            setErrorFlag(true)
            setErrorMessage("One of the fields is blank!")
        } else if (userManuallyRemovePhoto) {
            setErrorFlag(true)
            setErrorMessage("You need to have an image!")
        } else {
            let patchMyAuction;
            if (reserve === "") {
                patchMyAuction = await userPatchAuction(auction.auctionId, title.toString(), description.toString(), parseInt(category), endDate.toString(), 0)
            } else {
                patchMyAuction = await userPatchAuction(auction.auctionId, title.toString(), description.toString(), parseInt(category), endDate.toString(), parseInt(reserve.toString()))
            }

            if (patchMyAuction.status === 200) {

                if (isFilePicked) {
                    const uploadPhoto = await userUploadImageAuction(imageFile, auction.auctionId.toString())
                    if (uploadPhoto.status === 201 || uploadPhoto.status === 200) {
                        navigator('/auctions/' + auction.auctionId)
                    } else {
                        setErrorFlag(true)
                        setErrorMessage(uploadPhoto.statusText)
                    }
                } else {
                    navigator('/auctions/' + auction.auctionId)
                }

            } else {
                console.log(patchMyAuction)
                setErrorFlag(true)
                setErrorMessage(patchMyAuction.statusText)
            }

        }

    }

    const handleSubmitPhoto = (event: any) => {
        setImageFile(event.target.files[0])
        setIsFilePicked(true);
        setUserManuallyRemovePhoto(false)
    }

    const [userManuallyRemovePhoto, setUserManuallyRemovePhoto] = React.useState(false)

    const handleAbortPhoto = () => {
        setPreview("")
        setUserManuallyRemovePhoto(true)
        setImageFile(undefined)
        setIsFilePicked(false)
    }

    const handleDeleteAuction = async () => {
        const deleteMyListing = await userDeleteListing(auction.auctionId)
        if (deleteMyListing.status === 200) {
            setErrorFlag(false)
            setErrorMessage("")
            navigator('/')
        }
        else {
            setErrorFlag(true)
            setErrorMessage(deleteMyListing.statusText)
        }

    }

    const [chosenCategoryId, setChosenCategoryId] = React.useState("");

    const getExpiration = () => {

        return auction.endDate.slice(0, -5)
    }

    const handleChange = (event: SelectChangeEvent) => {
        setChosenCategoryId(event.target.value as string);
    };


    return (

        <Container component="main" maxWidth="lg" sx={{marginTop: 8}}>

            {errorAuthorisationFlag &&

                <div>
                    <Alert severity="error">
                        <AlertTitle>Uh oh...</AlertTitle>
                        <Typography>{errorAuthorisationMessage}</Typography>
                    </Alert>

                </div>

            }

            {!errorAuthorisationFlag &&

                <>

                    <Typography component="h1" variant="h4">Edit listing</Typography>
                    <Typography component="h1" variant="h6">Listing {auction.auctionId}</Typography>

                    {errorFlag && <Alert severity="error" sx={{marginTop: 2}}>
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt:3 }}>


                        <Grid container spacing={4}>

                            <Grid item xs={7}>

                                <Item >

                                    <Typography variant={"h6"} sx={{marginTop: 1, mb: 2}}>Edit photo</Typography>

                                    <CardMedia
                                        component="img"
                                        sx={{
                                            // 16:9
                                            height: 410
                                        }}
                                        image={preview}
                                        alt="random"/>


                                    <label htmlFor="contained-button-file">
                                        <Input accept="image/*" id="contained-button-file" type="file" onChange={handleSubmitPhoto} />
                                        <Button variant="contained" component="span" fullWidth sx={{ mt: 3, mb: 2 }}>
                                            Upload different photo
                                        </Button>
                                    </label>




                                    <Button variant="outlined" component="span" sx={{ mt: 3, mb: 2, ml: 2 }} onClick={handleAbortPhoto}>
                                        Remove photo
                                    </Button>

                                </Item>

                            </Grid>

                            <Grid item xs={5}>



                                <Typography variant={"h6"} sx={{marginTop: 1, marginBottom: 2}}>Edit your details</Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="title"
                                            required
                                            fullWidth
                                            id="Title"
                                            label="Give your listing a short title..."
                                            defaultValue={auction.title}
                                            autoFocus

                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select a category</InputLabel>
                                            <Select
                                                labelId="category"
                                                id="category"
                                                defaultValue={(auction.categoryId + 1).toString()}
                                                value={(auction.categoryId + 1).toString()}
                                                label="Select a category"
                                                onChange={handleChange}>

                                                {categories.map(category =>
                                                    <MenuItem key={(category.categoryId +1).toString()} value={(category.categoryId +1).toString()}>{category.name}</MenuItem>
                                                )}

                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="description"
                                            label="Describe your item"
                                            type="text"
                                            id="description"
                                            multiline
                                            defaultValue={auction.description}
                                            rows={4}

                                        />
                                    </Grid>

                                    <Grid item xs={12}>

                                        <TextField
                                            id="expiration"
                                            name="expiration"
                                            label="When should this listing expire?"
                                            type="datetime-local"
                                            fullWidth
                                            defaultValue={getExpiration()}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />


                                    </Grid>

                                </Grid>

                                <Typography variant={"h6"} sx={{marginTop: 5, marginBottom: 2}}>Set your reserve price</Typography>


                                <TextField
                                    autoFocus
                                    name="amount"
                                    margin="dense"
                                    id="amount"
                                    label="Reserve price"
                                    defaultValue={auction.reserve}
                                    type="text"
                                    fullWidth
                                    InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}}
                                    variant="outlined"/>



                                <Grid container spacing={2} sx={{marginTop: 0, mb: 2}}>

                                    <Grid item xs={6}>

                                        <Button type="submit" fullWidth variant="contained" sx={{marginRight: 3}} endIcon={<SendIcon/>}>Save changes</Button>

                                    </Grid>

                                    <Grid item xs={6}>
                                        <Button fullWidth variant="contained" sx={{marginRight: 0}} endIcon={<DeleteIcon/>} color={"error"} onClick={handleDeleteAuction}>Delete listing</Button>

                                    </Grid>



                                </Grid>
                            </Grid>


                        </Grid>



                    </Box>

                </>

                }



        </Container>
    );
}

