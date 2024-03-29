import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.scss'


const SubCategoryButton = ({ data, index, selectedFilter, filterCallback }) => {
    const { name, categoryId } = data;

    const handleClick = () => {
        filterCallback(categoryId, index)
    }

    return (
        <button onClick={handleClick} className={clsx(styles.button, selectedFilter === index && styles.selectedButton)}>
            {name}
        </button>


    )
}

export default SubCategoryButton
