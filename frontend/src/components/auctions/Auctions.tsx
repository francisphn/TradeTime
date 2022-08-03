import * as React from 'react';
import {fetchAllAuctions, fetchAllCategories} from "../services/AuctionServices";
import axios from "axios";

import {alpha, styled} from '@mui/material/styles';
import {
    Box,
    FormControl,
    InputAdornment,
    InputLabel, OutlinedInput,
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
import auction from "./Auction";


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


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
    const [pageAuctions, setPageAuctions] = React.useState<Array<auction>>([])

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

            setAuctionCount(r.data.count);
            setDisplayAuctionCount(r.data.count);
            setPageAuctions(r.data.auctions.slice(0, 6))
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


    // <MenuItem key={"Current bid (low-high)"} value={"Current bid (low-high)"}>Current bid (low-high)</MenuItem>
    // <MenuItem key={"Current bid (high-low)"} value={"Current bid (high-low)"}>Current bid (high-low)</MenuItem>
    // <MenuItem key={"Alphabetical (A-Z)"} value={"Alphabetical (A-Z)"}>Alphabetical (A-Z)</MenuItem>
    // <MenuItem key={"Alphabetical (Z-A)"} value={"Alphabetical (Z-A)"}>Alphabetical (Z-A)</MenuItem>
    // <MenuItem key={"ExpirationLast"} value={"Closing soon"}>Date of expiration (latest-earliest)</MenuItem>
    // <MenuItem key={"ExpirationFirst"} value={"Closing last"}>Date of expiration (earliest-latest)</MenuItem>
    // <MenuItem key={"Reserve price lowest"} value={"Reserve price lowest"}>Reserve price lowest</MenuItem>
    // <MenuItem key={"Reserve price highest"} value={"Reserve price highest"}>Reserve price highest</MenuItem>

    function sortCurrentBidLowHigh(a: auction, b: auction) : number {
        if (Number(a.highestBid) < Number(b.highestBid)) {
            return -1
        }
        return 1
    }

    function sortCurrentBidHighLow(a: auction, b: auction) : number {
        if (Number(a.highestBid) > Number(b.highestBid)) {
            return -1
        }
        return 1
    }

    function sortAlphabeticalAZ(a: auction, b: auction) : number {
        if (a.title.slice(0, 1) < b.title.slice(0, 1)) {
            return -1
        }
        return 1
    }

    function sortAlphabeticalZA(a: auction, b: auction) : number {
        if (a.title.slice(0, 1) > b.title.slice(0, 1)) {
            return -1
        }
        return 1
    }

    function sortExpirationLast(a: auction, b: auction) : number {
        const now = new Date(a.endDate)
        const forever = new Date(b.endDate)

        if (now > forever) {

            return -1
        }
        return 1
    }

    function sortExpirationFirst(a: auction, b: auction) : number {
        const now = new Date(a.endDate)
        const forever = new Date(b.endDate)

        if (now > forever) {
            console.log("Nice")
            return 1
        }
        return -1
    }

    function sortReserveLowest(a: auction, b: auction) : number {
        if (Number(a.reserve) < Number(b.reserve)) {

            return -1
        }
        return 1
    }

    function sortReserveHighest(a: auction, b: auction) : number {
        if (Number(a.reserve) > Number(b.reserve)) {
            return -1
        }
        return 1
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const queryString = data.get('query')
        const categories = data.get('categories')
        const sort = data.get('sort')
        const status = data.get('status')


        let results: auction[] = [];

        if (queryString === null || categories === null || sort === null || status === null) {

        } else {

            let now = new Date();

            (auctions.map(auction => {
                let expiration = new Date(auction.endDate)

                // if (auction.title === "HP Laptop") {
                //     console.log(auction.categoryId)
                // }

                if (
                    (auction.categoryId === parseInt(categories.toString()) || categories.toString() === "All categories") &&
                    (auction.title.includes(queryString.toString().charAt(0).toUpperCase() + queryString.toString().slice(1)) || auction.title.includes(queryString.toString()) || queryString === "")) {
                    if (status === "Open") {
                        if (expiration > now) {
                            results.push(auction)
                        }
                    } else if (status === "Closed") {
                        if (expiration < now) {
                            results.push(auction)
                        }
                    } else {
                        results.push(auction)
                    }
                }
            }))
        }

        // <MenuItem key={"Current bid (low-high)"} value={"Current bid (low-high)"}>Current bid (low-high)</MenuItem>
        // <MenuItem key={"Current bid (high-low)"} value={"Current bid (high-low)"}>Current bid (high-low)</MenuItem>
        // <MenuItem key={"Alphabetical (A-Z)"} value={"Alphabetical (A-Z)"}>Alphabetical (A-Z)</MenuItem>
        // <MenuItem key={"Alphabetical (Z-A)"} value={"Alphabetical (Z-A)"}>Alphabetical (Z-A)</MenuItem>
        // <MenuItem key={"ExpirationLast"} value={"Closing soon"}>Date of expiration (latest-earliest)</MenuItem>
        // <MenuItem key={"ExpirationFirst"} value={"Closing last"}>Date of expiration (earliest-latest)</MenuItem>
        // <MenuItem key={"Reserve price lowest"} value={"Reserve price lowest"}>Reserve price lowest</MenuItem>
        // <MenuItem key={"Reserve price highest"} value={"Reserve price highest"}>Reserve price highest</MenuItem>

        if (sort === null) {
        } else {
            switch (sort) {
                case "Current bid (low-high)":
                    results.sort(sortCurrentBidLowHigh)
                    break
                case "Current bid (high-low)":
                    results.sort(sortCurrentBidHighLow)
                    break
                case "Alphabetical (A-Z)":
                    results.sort(sortAlphabeticalAZ)
                    break
                case "Alphabetical (Z-A)":
                    results.sort(sortAlphabeticalZA)
                    break
                case "ExpirationLast":
                    break
                case "ExpirationFirst":
                    results.reverse()
                    break
                case "Reserve price lowest":
                    results.sort(sortReserveLowest)
                    break
                case "Reserve price highest":
                    results.sort(sortReserveHighest)
                    break

            }
        }

        setDisplayAuctionCount(auctionCount)
        setDisplayAuctions(results)
        setPageAuctions(results.slice(0,6))

    }

    const onChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        const start_index = (page - 1) * 6
        const end_index = page * 6
        setPageAuctions(displayAuctions.slice(start_index, end_index))
    }

    const [displayAuctionCount, setDisplayAuctionCount] = React.useState(auctionCount)

    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChangeMul = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


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

                            <Box component="form" noValidate onSubmit={handleSubmit} >

                                <Grid container spacing={2} sx={{mb: 2}}>
                                    <Grid item xs={12} sm={10}><Typography variant={"h6"} sx={{mb: 1}}>Start your search...</Typography></Grid>
                                    <Grid item xs={12} sm={2}><Button
                                        href={"/auctions/create"}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        CREATE
                                    </Button></Grid>

                                </Grid>





                                <TextField
                                    autoFocus
                                    name="query"
                                    margin="dense"
                                    id="query"
                                    label="Try searching a keyword"
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
                                            >

                                                <MenuItem key={"All categories"} value={"All categories"}>All categories</MenuItem>

                                                {categories.map(category =>
                                                    <MenuItem key={(category.categoryId).toString()} value={(category.categoryId).toString()}>{category.name}</MenuItem>
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
                                                <MenuItem key={"ExpirationLast"} value={"Closing soon"}>Date of expiration (latest-earliest)</MenuItem>
                                                <MenuItem key={"ExpirationFirst"} value={"Closing last"}>Date of expiration (earliest-latest)</MenuItem>
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
                                                defaultValue={"All listings"}
                                            >

                                                <MenuItem key={"Open"} value={"Open"}>Open</MenuItem>
                                                <MenuItem key={"Closed"} value={"Closed"}>Closed</MenuItem>
                                                <MenuItem key={"All listings"} value={"All listings"}>All listings</MenuItem>

                                            </Select>
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Search
                                        </Button>

                                    </Grid>





                                </Grid>



                            </Box>

                        </Item>








                    </Container>
                </Box>

                <Container >
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
                            <Pagination count={Math.ceil(displayAuctionCount/6)} variant="outlined" color="primary" onChange={onChangePage}/>

                        </Box>
                    </Stack>




                    <Grid container spacing={4}>
                        {pageAuctions.map((auction) => (
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