import { makeStyles, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import '../CSS/RangeSlider.css'

const useStyles = makeStyles({
  root: {
    width: 670,
    display:'flex',
    justifyContent:'center',
    textAlign:'center',
  },
});

const PrettoSlider = withStyles({
root: {
    color: '#eeb6b6',
    height: 8,
},
thumb: {
    height: 17,
    width: 14,
    color: '#D7322D',
    marginTop: -4,
    marginLeft: -6,
    '&:focus, &:hover, &$active': {
    boxShadow: 'inherit',
    },
    border: 1,
    borderRadius: 3
},
active: {},

track: {
    height: 8,
    borderRadius: 4,
},
rail: {
    height: 8,
    borderRadius: 4,
},
})(Slider);

const RangeSlider = (props: any) => {
    const classes = useStyles();

    const totalOptions = Object.keys(props.data.options).length;
    const unit = Math.floor(100 / (totalOptions - 1))
    const marks: any[] = [];
    const optionsView: any[] = [];
    
    for(let i=0;i<totalOptions;i++)
    {
      marks.push({
        "value": (unit * i),
        "label_option": Object.keys(props.data.options)[i]
      })

      const keyOption = Object.keys(props.data.options)[i]
      optionsView.push(<div className="specific-opiton-slid">{props.data.options[keyOption]}</div>)
    }

    const handleChange = (event: any, value: number | number[]) => {
      let element = marks.find(x=>x.value === value)
      if(element !== undefined)
      {
          props.onChange(props.data.sl_no, element.label_option)
      }
    };

    return (
    <div className="question-container">
        <p className="black question-radio">{props.data.sl_no}. {props.data.question}</p>
          <div className="options-slider">
            {optionsView}
          </div>
        <div className={classes.root}>
            <PrettoSlider
                track={false}
                defaultValue={marks[0].value}
                step={null}
                marks={marks}
                onChange={handleChange}
            />
        </div>
    </div>
    );
}


export default RangeSlider;