import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';

export default function BasicRating(props) {

    useEffect(() => {
        console.log(
            `post_id: ${props.post_id}\n` +
            `user_id: ${props.user_id}\n` +
            `rating: ${props.value}`
        );
    }, [props.value])

    const [message, setMessage] = useState(null);

    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>
            <Typography component="legend">{props.average_rating} and {props.value}</Typography>
            <Rating
                name="simple-uncontrolled"
                value={props.value}
                onChange={(event, newValue) => {
                    props.setValue(newValue);
                }}
            />
        </Box>
    );
}
