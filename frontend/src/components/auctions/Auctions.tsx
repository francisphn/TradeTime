import * as React from 'react';
import {fetchAllAuctions, fetchAllCategories} from "../services/AuctionServices";
import axios from "axios";

import {alpha, styled} from '@mui/material/styles';
import {
    Box,
    FormControl,
    InputAdornment,
    InputLabel,
    Pagination,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

import InputBase from '@mui/material/InputBase';
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import {Simulate} from "react-dom/test-utils";


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];





const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
}));

export default function Auctions() {
    const navigator = useNavigate()


    const [auctionCount, setAuctionCount] = React.useState(-1)

    const [auctions, setAuctions] = React.useState<Array<auction>>([])

    const [displayAuctions, setDisplayAuctions] = React.useState<Array<auction>>([])

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [categories, setCategories] = React.useState<Array<category>>([])

    React.useEffect(() => {
        const getCategoriesMe = getCategories().then(r => {
            setCategories(r.data)

        })

        getAuctions().then(r => {
            setAuctions(r.data.auctions)
            setDisplayAuctions(r.data.auctions)
            setAuctionCount(r.data.count)
        }
        )
    }, [])



    const getAuctions = async () => {
        return await fetchAllAuctions();
    }

    const getCategories = async () => {
        return await fetchAllCategories();
    }

    const handleClickRegister = () => {
        navigator("/register")
    }

    const handleClickLogIn = () => {
        navigator('/login')
    }

    const [chosenCategoryId, setChosenCategoryId] = React.useState("");
    const [chosenSort, setChosenSort] = React.useState("");


    const handleChange = (event: SelectChangeEvent) => {
        setChosenCategoryId(event.target.value as string);
    };

    const handleChangeCategories = (event: SelectChangeEvent) => {
        setChosenCategoryId(event.target.value as string);
        console.log(event.target.value)
    };

    const handleChangeSort = (event: SelectChangeEvent) => {
        setChosenSort(event.target.value as string);
    };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const queryString = data.get('query')
        const categories = data.get('categories')
        const sort = data.get('sort')
        const status = data.get('status')

        console.log(queryString)
        console.log(categories)
        console.log(sort)
        console.log(status)


    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Haere mai!
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            TradeTime is your one-stop site for all things auctions. Discover {auctionCount.toString()} listings on now!
                        </Typography>

                        <Item sx={{ mt: 3 }}>

                            <Box component="form" noValidate onChange={handleSubmit} >

                                <Typography variant={"h6"} sx={{mb: 1}}>Start your search...</Typography>

                                <TextField
                                    autoFocus
                                    name="query"
                                    margin="dense"
                                    id="query"
                                    label="Try searching a user or a keyword"
                                    InputProps={{startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,}}
                                    type="text"
                                    fullWidth
                                    variant="outlined" sx={{marginBottom: 2}}/>

                                <Grid container spacing={2}>

                                    <Grid item xs={12} sm={4}>


                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                                            <Select
                                                labelId="category"
                                                id="category"
                                                name={"categories"}
                                                label="Categories"
                                                defaultValue={"All categories"}
                                                onChange={handleChangeCategories}
                                            >

                                                <MenuItem key={"All categories"} value={"All categories"}>All categories</MenuItem>

                                                {categories.map(category =>
                                                    <MenuItem key={(category.categoryId +1).toString()} value={(category.categoryId +1).toString()}>{category.name}</MenuItem>
                                                )}

                                            </Select>
                                        </FormControl>

                                    </Grid>

                                    <Grid item xs={12} sm={4}>


                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Sort listings by</InputLabel>
                                            <Select
                                                labelId="category"
                                                id="sort"
                                                name="sort"
                                                label="Sort listings by"
                                                defaultValue={"Closing soon"}
                                            >


                                                <MenuItem key={"Current bid (low-high)"} value={"Current bid (low-high)"}>Current bid (low-high)</MenuItem>
                                                <MenuItem key={"Current bid (high-low)"} value={"Current bid (high-low)"}>Current bid (high-low)</MenuItem>
                                                <MenuItem key={"Alphabetical (A-Z)"} value={"Alphabetical (A-Z)"}>Alphabetical (A-Z)</MenuItem>
                                                <MenuItem key={"Alphabetical (Z-A)"} value={"Alphabetical (Z-A)"}>Alphabetical (Z-A)</MenuItem>
                                                <MenuItem key={"Closing soon"} value={"Closing soon"}>Closing soon</MenuItem>
                                                <MenuItem key={"Closing last"} value={"Closing last"}>Closing last</MenuItem>
                                                <MenuItem key={"Reserve price lowest"} value={"Reserve price lowest"}>Reserve price lowest</MenuItem>
                                                <MenuItem key={"Reserve price highest"} value={"Reserve price highest"}>Reserve price highest</MenuItem>

                                            </Select>
                                        </FormControl>

                                    </Grid>

                                    <Grid item xs={12} sm={4}>


                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                            <Select
                                                labelId="category"
                                                id="status"
                                                name="status"
                                                label="Status"
                                                defaultValue={"Open"}
                                            >

                                                <MenuItem key={"Open"} value={"Open"}>Open</MenuItem>
                                                <MenuItem key={"Closed"} value={"Closed"}>Closed</MenuItem>
                                                <MenuItem key={"All listings"} value={"All listings"}>All listings</MenuItem>

                                            </Select>
                                        </FormControl>

                                    </Grid>





                                </Grid>



                            </Box>

                        </Item>








                    </Container>
                </Box>

                <Container sx={{ py: 8 }} >
                    {/* End hero unit */}

                    <Stack
                        sx={{ pt: 4 }}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >

                    </Stack>



                    <Stack
                        sx={{ pt: 4 }}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >
                        <Box sx={{marginBottom: 5}}>
                            <Pagination count={10} variant="outlined" color="primary" />
                        </Box>
                    </Stack>




                    <Grid container spacing={4}>
                        {auctions.map((auction) => (
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
                                        <Typography variant="caption">
                                            Listed by {auction.sellerFirstName} {auction.sellerLastName}

                                        </Typography>

                                        <Typography variant="caption">
                                            {auction.sellerFirstName}
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" href={"/auctions/" + auction.auctionId}>View</Button>
                                        <Button size="small">Bid</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Something here to give the footer a purpose!
                </Typography>

            </Box>
            {/* End footer */}
        </ThemeProvider>
    )
}