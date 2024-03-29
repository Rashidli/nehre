import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";

import Image from "next/image";

const Review = ({ data }) => {
    const {
        files,
        image,
        message,
        reviewId,
        star,
        user
    } = data;

    return (
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <div className={styles.imageWrapper}>
                    <Image
                        layout="responsive"
                        width={"100%"}
                        height={"100%"}
                        alt="review"
                        src={user.avatar}
                        className={styles.profile}
                    />
                </div>

                <div className={styles.costumerInfo}>
                    <p className={styles.userName}>{user.name}</p>
                    <div className={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((item, index) => {
                            if (item <= star) {
                                return (
                                    <StarOutlinedIcon
                                        key={index + "star"}
                                        className={styles.starFilled}
                                    />
                                );
                            } else {
                                return (
                                    <StarOutlineOutlinedIcon
                                        key={index + "star"}
                                        className={styles.starOutline}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
            </div>

            <p className={styles.text}>{message}</p>
        </div>
    );
};
export default Review;
