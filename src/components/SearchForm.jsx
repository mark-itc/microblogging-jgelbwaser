import { FormGroup, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import {useState, useRef, useContext} from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import SearchIcon from '@mui/icons-material/Search';
import {TweetsContext} from '../context/TweetsContext'



const options = ['users', 'tweets'];

export default function SearchForm() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const inputRef = useRef();
  
  const {searchInUsers, searchInTweets} =useContext(TweetsContext)
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputRef.current.value) return
    if(selectedIndex === 1) {
      searchInTweets(inputRef.current.value )
    } else{
    searchInUsers(inputRef.current.value)
  }
  inputRef.current.value ='';
  }; 

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <form className='search-form' onSubmit={handleSubmit}>
      <FormGroup 
      sx={{
        display: 'flex',
        flexFlow: 'nowrap'
    }}
      row>

        <TextField
          inputRef = {inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment  position="start">
                <SearchIcon  />
              </InputAdornment>
            ),
          }}
          sx={{
            display: 'flex',
            minWidth: '10rem',
            width: '25vw',
            maxWidth: '15rem',
            justifyContent: "center",
            height: '2.5rem',
            backgroundColor: 'white',
            overflow: 'hidden',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { 
                
                
            justifyContent: "center",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderColor: "white", },
            },
          }}
            />

            <ButtonGroup  variant="contained"
               
              ref={anchorRef} aria-label="split button">
              <Button
                type='submit'
                sx={{
                  width: '4rem',
                  textTransform: 'lowercase',
                  padding: '5px 10px',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}

               >{options[selectedIndex]}</Button>
              <Button
    
                size="small"
                sx={{ padding: '5px 5px'}}
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
      </FormGroup>
      <Popper
        sx={{
          width: '5.5rem',
          zIndex: 1,
          marginLeft: 'auto'
        }}
        placement='bottom-start'
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </form>
  );
}
