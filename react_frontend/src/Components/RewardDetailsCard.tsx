import React from 'react';
import '../CSS/RewardDetailsCard.css';
const investedImg = require('../Assets/points-invested.svg');
const earnedImg = require('../Assets/points-earned.svg');
const milestoneImg = require('../Assets/milestones.svg');

const RewardDetailsCard = (props: any) => {
    const { title, value, icon } = props;
    const imgSrc = icon === 'earned' ? earnedImg : icon === 'milestone' ? milestoneImg : investedImg;

    return (
        <div className="flex col container">
            <div className="flex row">
                <div className="image-countainer">
                    <img className="align-center reward-img" src={imgSrc.default} alt="points-invested" />
                </div>
                <div className="content-container">
                    <div className="flex row title-text">{title}</div>
                    <div className="flex row value-text">{value}</div>
                </div>
            </div>
        </div>
    );
}

export default RewardDetailsCard;