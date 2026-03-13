import styles from './SearchBar.module.css';

export default function SearchBar() {
    return (
        <div className={styles.search}>
            <svg className={styles.searchSvg}>
                <use href='/img/icon/sprite.svg#icon-search'></use>
            </svg>

            <input className={styles.searchInput} type='search' placeholder='Поиск' name='search' />
        </div>
    );
}
