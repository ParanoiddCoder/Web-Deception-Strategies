import {Form,Button } from "react-bootstrap"
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const SearchBox = () => {
    const {keyword:urlKeyword} = useParams();

    const [keyword,setKeyword] = useState(urlKeyword || '');

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim())
        {
            navigate(`/search/${keyword}`)
            setKeyword('');
        }
        else
        {
            navigate('/');
        }
    }

    return (
        <Form onSubmit={submitHandler} className='d-flex'>
        <Form.Control
          type='text'
          name='q'
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder='Search Products...'
          className='mr-sm-2 ml-sm-5'
        ></Form.Control>
        <Button type='submit' variant='outline-light' className='p-2 mx-2'>
          Search
        </Button>
      </Form>
  
    );
};

export default SearchBox;
