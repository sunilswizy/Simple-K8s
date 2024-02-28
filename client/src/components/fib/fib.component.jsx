import React, { useEffect, useState } from "react";
import axios from "axios";


const Fib = () => {
    
    const [seenIndex, setSeenIndex] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    const fetchValues = async () => {
        const values = await axios.get('/api/values/current');
        setValues(values.data);
    }

    const fetchIndex = async () => {
        const seenIndex = await axios.get('/api/values/all');
        setSeenIndex(seenIndex.data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('/api/values', {
            index
        });

        setIndex('');
    };

    useEffect(() => {
        fetchValues();
        fetchIndex();
    }, []);

    return (
        <div>
            <form>
                <label>Enter your index: </label>
                <input value={index} onChange={(e) => setIndex(e.target.value)}/>
                <button onClick={(e) => handleSubmit(e)}>Submit</button>
            </form>

            <h3>Index already Seen: </h3>
            {
                seenIndex.map(({ number }) => number).join(', ')
            }

            <h3>Calculated Values: </h3>

            {
                Object.keys(values).map((key) => {
                    return (
                        <div key={key}>
                            For index {key} I Calculated { values[key] }
                        </div>
                    )
                })
            }
        </div>
    )

};

export default Fib;