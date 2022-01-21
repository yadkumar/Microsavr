import React, { useEffect, useState } from 'react';
import '../CSS/AddCardModal.css';
import Modal from 'react-modal';
import { NativeSelect, InputBase, withStyles, OutlinedInput, Input } from "@material-ui/core";
import CardNumInput from "./CardNumInput/index";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        background: "#23202142"
    }
};

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const AddCardModal = (props: any) => {
    const [cardNum, setCardNum] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [nameOnCard, setNameOnCard] = useState("");
    const [secNum, setSecNum] = useState("");
    const [btnDisabled, setBtnDisabled] = useState(true);

    const getMonthOptions = () => {
        const months = [
            { title: "01", value: 1 },
            { title: "02", value: 2 },
            { title: "03", value: 3 },
            { title: "04", value: 4 },
            { title: "05", value: 5 },
            { title: "06", value: 6 },
            { title: "07", value: 7 },
            { title: "08", value: 8 },
            { title: "09", value: 9 },
            { title: "10", value: 10 },
            { title: "11", value: 11 },
            { title: "12", value: 12 }
        ];
        return months.map(item => <option value={item.value}>{item.title}</option>)
    }

    const getYearOptions = () => {
        const currentDate = new Date();
        let currYear = currentDate.getFullYear();
        const years = [
            { title: `${currYear}`, value: currYear }
        ];
        for (let i = 0; i < 19; i++) {
            years.push({
                title: `${currYear + 1}`,
                value: currYear + 1
            });
            currYear = currYear + 1;
        }
        return years.map(item => <option value={item.value}>{item.title}</option>)
    }

    useEffect(() => {
        if (!props.modalVisible) {
            setNameOnCard("");
            setSecNum("");
            setExpMonth("");
            setExpYear("");
            setBtnDisabled(false);
        }
    }, [props.modalVisible]);
    //eslint-disable-next-line
    const isButtonDisabled = () => {
        let btnDisabled = true;
        if (cardNum.length === 16 && nameOnCard.trim() && secNum.trim().length === 3 && expMonth && expYear) {
            btnDisabled = false;
        }
        return btnDisabled;
    }

    const onChangeMonth = (month: any) => {
        setExpMonth(month);
    }

    const onChangeYear = (year: any) => {
        setExpYear(year);
    }

    useEffect(() => {
        setBtnDisabled(isButtonDisabled())
    }, [isButtonDisabled, nameOnCard, cardNum, secNum])

    const cardNumHandler = (cardNum: string) => {
        setCardNum(cardNum);
    }

    return (
        <>
            {props.modalVisible &&
                <Modal isOpen={props.modalVisible} style={customStyles} contentLabel="Add your Credit Card">
                    <div className="flex row add-card-modal" style={{ maxWidth: "41vw", flexDirection: "column" }}>
                        <div className="header-modal flex row" style={{ justifyContent: "space-between" }}>
                            <h2 style={{ margin: '0' }}>Add your Credit Card</h2>
                            <img className="close-icon-modal" onClick={() => props.modalHideShowHandler(false)}
                                src={require('../Assets/close.svg').default} alt="" />
                        </div>
                        <div className="flex row" style={{ margin: "1rem 0rem", justifyContent: "space-between" }}>
                            <div style={{ width: "60%" }}>
                                <h3>Enter Card Number</h3>
                                <div>
                                    <CardNumInput
                                        autoFocus
                                        isNumberInput
                                        length={16}
                                        className="cardNumContainer"
                                        inputClassName="cardNumInput"
                                        onChangeCardNum={(num) => cardNumHandler(num)} />
                                </div>
                            </div>
                            <div style={{ width: "40%" }}><h3>Enter Expiry Date</h3>
                                <NativeSelect
                                    value={expMonth}
                                    onChange={(e) => onChangeMonth(e.target.value)}
                                    input={<BootstrapInput />}
                                >
                                    <option aria-label="None" value="">Month</option>
                                    {getMonthOptions()}
                                </NativeSelect>
                                <NativeSelect
                                    value={expYear}
                                    onChange={(e) => onChangeYear(e.target.value)}
                                    input={<BootstrapInput />}
                                    style={{ marginLeft: "1rem" }}
                                >
                                    <option aria-label="None" value="">Year</option>
                                    {getYearOptions()}
                                </NativeSelect></div>
                        </div>
                        <div className="flex row" style={{ margin: "1rem 0rem", flexDirection: "column" }}>
                            <div className="flex col" style={{ width: "50%" }}>
                                <h3 style={{ marginBottom: "0rem" }}>Enter Name on Card</h3>
                                <Input
                                    id="standard-adornment-weight"
                                    value={nameOnCard}
                                    onChange={(e) => e.target.value.length < 25 && setNameOnCard(e.target.value)}
                                    endAdornment={null}
                                    aria-describedby="standard-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    style={{ fontSize: "1.4rem" }}
                                />
                            </div>
                        </div>
                        <div className="flex row" style={{ margin: "1rem 0rem", flexDirection: "column" }}>
                            <div className="flex col" style={{ width: "20%" }}>
                                <h3>Security Number</h3>
                            </div>
                            <div className="flex row" style={{ alignItems: "flex-end" }}>
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    value={secNum}
                                    onChange={(e) => e.target.value.length < 4 && setSecNum(e.target.value)}
                                    endAdornment={null}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    labelWidth={0}
                                    style={{ width: "16%", fontSize: "1.4rem" }}
                                    className="cvv-input"
                                />
                                <p style={{ marginLeft: "0.5rem", color: "gray", textDecoration: "underline", cursor: "pointer" }}>
                                    What is This?
                            </p>
                            </div>
                        </div>
                        <div className="flex row" style={{ justifyContent: "center", marginTop: "2rem" }}>
                            <button disabled={btnDisabled} className={btnDisabled ? "proceed-btn-reg btn-disabled" : "proceed-btn-reg"} onClick={() => props.addCardHandler(Number(cardNum))}>Add Card</button>
                        </div>
                    </div>
                </Modal>}
        </>
    );
}

export default AddCardModal;