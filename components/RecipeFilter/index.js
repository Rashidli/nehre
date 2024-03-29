import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import styles from './styles.module.scss';
import {Search} from '@mui/icons-material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import RefreshIcon from '@mui/icons-material/Refresh';
import useTranslate from '../../hooks/useTranslate';
const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 120,
    label: '120',
  },
  {
    value: 240,
    label: '240',
  },
];

const difficultyLevels = [
  {
    value: 0,
    label: '1',
  },
  {
    value: 1,
    label: '2',
  },
  {
    value: 2,
    label: '3',
  },
  {
    value: 3,
    label: '4',
  },
  {
    value: 4,
    label: '5',
  },
];

const initialValues = {
  receipt_categories: [],
  time: 0,
  name:"",
  difficulty: 2,
};

const checkBoxStyle = {
'&.MuiCheckbox-root': { 
    color: '#a0a6a6',
},
  '&.Mui-checked': {
    color: '#7dbf29',
  },
};

const rangeStyle = {
  '& .MuiSlider-thumb': {
    color: '#7dbf29',
  },

  '& .MuiSlider-track': {
    color: '#7dbf29',
  },
  '& .MuiSlider-rail': {
    color: '#7dbf29',
  },
  '& .MuiSlider-mark': {
    color: '#7dbf29',
  },
};

const formControlLabelStyle = { 
  fontSize: '14px',

}

const RecipeFilter = ({categories, filterCallback}) => {
  const texts = useTranslate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors},
    reset,
  } = useForm({
    values: initialValues,
  });


  const small = useMediaQuery('(max-width:650px)');

  const [isVisible, setVisible] = useState(false);

  const selectedValues = watch('receipt_categories');
  const handlePress = (data) => {
    setVisible(!isVisible);
  };

const onSubmit = (data) => {
  filterCallback(data);
}

  function valueText(value) {
    return `${value}`;
  }
  
  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputContainer}>
        <div>
          <input type="text" placeholder={texts.toSearchText} {...register("name")} />
          <button type='submit'>
            <Search />
            {small ? null : texts.toSearchText}
          </button>
        </div>

        <button
          className={styles.filterButton}
          type="button"
          onClick={handlePress}>
          <TuneRoundedIcon />
          {small ? null : texts.filterText}{' '}
        </button>
      </div>
      {isVisible && (
        <div className={styles.optionsContainer}>
          <FormGroup
          >
            <h2 className={styles.filterTitle}>{texts.recipeCategoryText}</h2>
            <Grid 
            container 
            direction="row"
            > 
           
       
{
  categories.map((category,index) => (
    <FormControlLabel
    key={category.slug}
              control={
                  <Checkbox
                  value={category.id}
                  checked={selectedValues.includes(`${category.id}`)}
                    {...register(`receipt_categories.${index}`)} 
                    sx={checkBoxStyle}
                  />
              }
              label={
                <Typography sx={formControlLabelStyle}>
                {category.name}
                </Typography>}
            />
          ))
}


            

       
            </Grid>

          </FormGroup>

          <h2 className={styles.filterTitle}>{texts.recipeCookTimeText}</h2>

          <div className={styles.rangeContainer}>

            <Box sx={{flex: 1}}>
              <Controller
                name="time"
                control={control}
                render={({field}) => (
                  <Slider
                    {...field}
                    sx={rangeStyle}
                    aria-label="Custom marks"
                    getAriaValueText={valueText}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={marks}
                    max={240}
                  />
                )}
              />
            </Box>
            <Box sx={{flex: 1}}>
              <Controller
                name="difficulty"
                control={control}
                render={({field}) => (
                  <Slider
                    {...field}
                    sx={rangeStyle}
                    aria-label="Custom marks"
                    getAriaValueText={valueText}
                    step={1}
                    max={4}
                    valueLabelDisplay="auto"
                    marks={difficultyLevels}
                  />
                )}
              />
            </Box>
          </div>
          <button
            className={styles.resetButton}
            onClick={() => reset(initialValues)}
            type="button">
            <RefreshIcon />
            {texts.resetText}{' '}
          </button>
        </div>
      )}
    </form>
  );
};

export default RecipeFilter;
