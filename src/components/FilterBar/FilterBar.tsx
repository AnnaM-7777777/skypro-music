import styles from './FilterBar.module.css';

export default function FilterBar() {
    return (
        <div className={styles.centerblockFilter}>
            <div className={styles.filterTitle}>Искать по:</div>
            <div className={styles.filterButton}>исполнителю</div>
            <div className={styles.filterButton}>году выпуска</div>
            <div className={styles.filterButton}>жанру</div>
        </div>
    );
}
