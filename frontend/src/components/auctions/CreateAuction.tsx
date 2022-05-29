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
import {isThereCookie} from "../services/CookiesService";
import Paper from "@mui/material/Paper";
import SendIcon from "@mui/icons-material/Send";
import {fetchAllCategories, userCreateAuction, userUploadImageAuction} from "../services/AuctionServices";
import CardMedia from "@mui/material/CardMedia";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const theme = createTheme()

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
}));

const Input = styled('input')({
    display: 'none',
});

export default function CreateAuction() {

    const navigator = useNavigate()

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [imageFile, setImageFile] = React.useState()
    const [isFilePicked, setIsFilePicked] = React.useState(false)

    const [preview, setPreview] = React.useState("")


    const [categories, setCategories] = React.useState<Array<category>>([
        {
            categoryId: 0,
            name: ""
        }
    ])

    React.useEffect(() => {

        getCategories().then(r => {
            setCategories(r.data)
        })

        if (!isThereCookie()) {
            navigator('/login')
        }

        if (!imageFile) {
            setPreview("")
            return
        } else {

        }

        const objectUrl = URL.createObjectURL(imageFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)


    }, [imageFile])

    const getCategories = async () => {
        return await fetchAllCategories();
    }


    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const title = data.get('title')
        const category = chosenCategoryId
        const description = data.get('description')
        const endDate = data.get('expiration')
        const reserve = data.get('amount')

        console.log(reserve)

        if (title === null || category === null || description === null || reserve === null || endDate === null) {
            setErrorFlag(true)
            setErrorMessage("One of the fields is blank!")
        } else if (title === "" || category === "" || description === "" || endDate === "") {
            setErrorFlag(true)
            setErrorMessage("One of the fields is blank!")
        } else if (!isFilePicked) {
            setErrorFlag(true)
            setErrorMessage("You need to have an image!")
        } else {
            let createMyAuction;
            if (reserve === "") {
                createMyAuction = await userCreateAuction(title.toString(), description.toString(), parseInt(category), endDate.toString(), 0)
            } else {
                createMyAuction = await userCreateAuction(title.toString(), description.toString(), parseInt(category), endDate.toString(), parseInt(reserve.toString()))
            }

            if (createMyAuction.status === 201) {

                const uploadPhoto = await userUploadImageAuction(imageFile, createMyAuction.data.auctionId)

                if (uploadPhoto.status === 201) {
                    navigator('/auctions/' + createMyAuction.data.auctionId)
                } else {
                    setErrorFlag(true)
                    setErrorMessage(uploadPhoto.statusText)
                }
            } else {
                setErrorFlag(true)
                setErrorMessage(createMyAuction.statusText)
            }

        }

    }

    const handleSubmitPhoto = (event: any) => {
        setImageFile(event.target.files[0])
        setIsFilePicked(true);
    }

    const handleAbortPhoto = () => {
        setImageFile(undefined)
        setIsFilePicked(false)
    }

    const [chosenCategoryId, setChosenCategoryId] = React.useState('');

    const getDefaultExpiration = () => {
        let now = new Date();
        now.setDate(now.getDate() + 7);
        let stringNow = now.toISOString()
        return stringNow.slice(0, -5)
    }

    const handleChange = (event: SelectChangeEvent) => {
        setChosenCategoryId(event.target.value as string);
    };


    return (

        <Container component="main" maxWidth="lg" sx={{marginTop: 8}}>

            <Typography component="h1" variant="h4">Ko te wa hokohoko!</Typography>
            <Typography component="h1" variant="h6">What are you listing today?</Typography>

            {errorFlag && <Alert severity="error" sx={{marginTop: 2}}>
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
            </Alert>}

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt:3 }}>


                    <Grid container spacing={4}>

                        <Grid item xs={7}>

                            <Item >

                                <Typography variant={"h6"} sx={{marginTop: 1, mb: 2}}>Upload a photo</Typography>

                                {isFilePicked && <CardMedia
                                    component="img"
                                    sx={{
                                        // 16:9
                                        height: 410
                                    }}
                                    image={preview}
                                    alt="random"/>}

                                {!isFilePicked &&
                                    <Typography variant={"subtitle1"} sx={{marginTop: 1, marginBottom: 50}}>No file picked.</Typography>
                                }

                                <label htmlFor="contained-button-file">
                                    <Input accept="image/*" id="contained-button-file" type="file" onChange={handleSubmitPhoto} />
                                    <Button variant="contained" component="span" fullWidth sx={{ mt: 3, mb: 2 }}>
                                        Upload photo
                                    </Button>
                                </label>




                                <Button variant="outlined" component="span" sx={{ mt: 3, mb: 2, ml: 2 }} onClick={handleAbortPhoto}>
                                    Remove photo
                                </Button>

                            </Item>

                        </Grid>

                        <Grid item xs={5}>



                            <Typography variant={"h6"} sx={{marginTop: 1, marginBottom: 2}}>Describe your item</Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="title"
                                        required
                                        fullWidth
                                        id="Title"
                                        label="Give your listing a short title..."
                                        autoFocus

                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select a category</InputLabel>
                                        <Select
                                            labelId="category"
                                            id="category"
                                            value={chosenCategoryId}
                                            label="Select a category"
                                            onChange={handleChange}>

                                            {categories.map(category =>
                                                <MenuItem key={category.categoryId} value={category.categoryId}>{category.name}</MenuItem>
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
                                        defaultValue={getDefaultExpiration()}

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
                                type="text"
                                fullWidth
                                InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}}
                                variant="outlined"/>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 2, mb: 2}} endIcon={<SendIcon/>}

                            >
                                List this item
                            </Button>
                        </Grid>


                    </Grid>



            </Box>

        </Container>
    );
}

